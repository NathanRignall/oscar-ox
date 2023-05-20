import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "../db-types.ts";

type CompanyMembersRecord = Database["public"]["Tables"]["company_members"]["Row"];

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: CompanyMembersRecord;
  schema: string;
  old_record: null | CompanyMembersRecord;
}

const api = Deno.env.get("LISTMONK_API");

const headers = {
  "Content-Type": "application/json",
  Authorization: Deno.env.get("LISTMONK_API_AUTHORIZATION") as string,
};

serve(async (req) => {
  const payload: WebhookPayload = await req.json()

  try {
    // connect to supabase
    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );

    if (payload.type === "INSERT") {
      const { profile_id, company_id, role } = payload.record;

      // do nothing if the role is not "admin"
      if (role !== "admin") return new Response("okay");

      // get the user's email
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("email, given_name, family_name")
        .eq("id", profile_id)
        .single();

      if (!profile) throw new Error("No profile found");

      const email = profile.email;
      const given_name = profile.given_name;
      const family_name = profile.family_name;

      // check if email is from ox.ac.uk
      if (!email.endsWith("@ox.ac.uk")) {
        return new Response("none");
      }

      // now verify the company
      await supabaseClient
        .from("companies")
        .update({ is_verified: true })
        .eq("id", company_id)
        .single();

      // get the company name
      const { data: company } = await supabaseClient
        .from("companies")
        .select("name")
        .eq("id", company_id)
        .single();

      if (!company) throw new Error("No company found");

      // get the list id
      const listResponse = await fetch(
        `${api}/lists?query=company-${company_id}&page=1&per_page=1`,
        {
          method: "GET",
          headers,
        }
      );

      const list = await listResponse.json();
      const list_id = list.data.results[0].id;

      // create a new campaign
      const campaignResponse = await fetch(`${api}/campaigns`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: `Company Verification - ${company.name}`,
          subject: "Your company has been verified!",
          lists: [list_id],
          type: "regular",
          content_type: "markdown",
          body: `Hi, your company has been verified automatically by ${given_name} ${family_name} as they have an @ox.ac.uk email address.`,
          template_id: 1,
        }),
      });

      const campaign = await campaignResponse.json();
      const campaign_id = campaign.data.id;

      // start the campaign
      await fetch(`${api}/campaigns/${campaign_id}/status`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          status: "running",
        }),
      });

      return new Response("okay");
    }

    return new Response("none");
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
})
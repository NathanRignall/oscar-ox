import { serve } from "std/server";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "../db-types.ts";

type CompanyMembersRecord =
  Database["public"]["Tables"]["company_members"]["Row"];

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
  const payload: WebhookPayload = await req.json();

  try {
    // connect to supabase
    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );

    if (payload.type === "INSERT") {
      const { profile_id, company_id, role } = payload.record;

      // get the user's email
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("email, name")
        .eq("id", profile_id)
        .single();

      if (!profile) throw new Error("No profile found");

      const email = profile.email;
      const name = profile.name;

      // get the number of members of the company
      const { data: companyMembers } = await supabaseClient
        .from("company_members")
        .select("company_id")
        .eq("company_id", company_id);

      if (!companyMembers) throw new Error("No company members found");

      const companyMembersCount = companyMembers.length;

      // get the company name
      const { data: company } = await supabaseClient
        .from("companies")
        .select("name")
        .eq("id", company_id)
        .single();

      if (!company) throw new Error("No company found");

      const companyName = company.name;

      // create a subject
      const subject = companyMembersCount == 1 ? `You have created the production company ${companyName}` : `You have been added as a member at ${companyName}`;

      // create a message
      const message = companyMembersCount == 1 ? `You have created a new production company called '${companyName}'.` : `You have been added as a member of the '${companyName}' production company with the ${role} role.`;

      // create a transaction
      await fetch(`${api}/tx`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          subscriber_email: email,
          template_id: 3,
          data: {
            subject,
            lead: `Hello ${name},`,
            message,
          },
        }),
      });

      return new Response("ok");
    } else if (payload.type === "DELETE") {
      // if there is no old record, do nothing
      if (!payload.old_record) {
        return new Response("okay");
      }

      const { profile_id, company_id } = payload.old_record;

      // get the user's email
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("email, name")
        .eq("id", profile_id)
        .single();

      if (!profile) throw new Error("No profile found");

      const email = profile.email;
      const name = profile.name;

      // get the company name
      const { data: company } = await supabaseClient
        .from("companies")
        .select("name")
        .eq("id", company_id)
        .single();

      if (!company) throw new Error("No company found");

      const companyName = company.name;

      // create a subject
      const subject = `You have been removed from ${companyName}`;

      // create a message
      const message = `You have been removed as a member from the '${companyName}' production company.`;

      // create a transaction
      await fetch(`${api}/tx`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          subscriber_email: email,
          template_id: 3,
          data: {
            subject,
            lead: `Hello ${name},`,
            message,
          },
        }),
      });

      return new Response("ok");
    }

    return new Response("none");
  } catch (error) {
    console.log(error);
    return new Response("error");
  }
});

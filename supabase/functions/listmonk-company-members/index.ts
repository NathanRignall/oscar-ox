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
        .select("email, given_name, family_name")
        .eq("id", profile_id)
        .single();

      if (!profile) throw new Error("No profile found");

      const email = profile.email;
      const given_name = profile.given_name;
      const family_name = profile.family_name;

      // get the subscriber id
      const subscribersResponse = await fetch(
        `${api}/subscribers?query=subscribers.email='${email}'&page=1&per_page=1`,
        {
          method: "GET",
          headers,
        }
      );

      const subscribers = await subscribersResponse.json();
      const subscriber_id = subscribers.data.results[0].id;

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

      // subscribe the user to the list
      await fetch(`${api}/subscribers/lists`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          ids: [subscriber_id],
          action: "add",
          target_list_ids: [list_id],
          status: "confirmed",
        }),
      });

      // get the company name
      const { data: company } = await supabaseClient
        .from("companies")
        .select("name")
        .eq("id", company_id)
        .single();

      if (!company) throw new Error("No company found");

      const companyName = company.name;

      // create a new campaign
      const campaignResponse = await fetch(`${api}/campaigns`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: `Company Member Added - ${profile_id} - ${company_id}`,
          subject: "A new member has been added to your company!",
          lists: [list_id],
          type: "regular",
          content_type: "markdown",
          body: `Hi, ${given_name} ${family_name} has been added as a member of ${companyName} as a ${role}!`,
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
    } else if (payload.type === "DELETE") {
      // if there is no old record, do nothing
      if (!payload.old_record) {
        return new Response("okay");
      }

      const { profile_id, company_id } = payload.old_record;

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

      // get the subscriber id
      const subscribersResponse = await fetch(
        `${api}/subscribers?query=subscribers.email='${email}'&page=1&per_page=1`,
        {
          method: "GET",
          headers,
        }
      );

      const subscribers = await subscribersResponse.json();
      const subscriber_id = subscribers.data.results[0].id;

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

      // unsubscribe the user from the list
      await fetch(`${api}/subscribers/lists`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          ids: [subscriber_id],
          action: "remove",
          target_list_ids: [list_id],
        }),
      });

      // get the company name
      const { data: company } = await supabaseClient
        .from("companies")
        .select("name")
        .eq("id", company_id)
        .single();

      if (!company) throw new Error("No company found");

      const companyName = company.name;

      // create a new campaign
      const campaignResponse = await fetch(`${api}/campaigns`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: `Company Member Removed - ${profile_id} - ${company_id}`,
          subject: "A member has been removed from your company!",
          lists: [list_id],
          type: "regular",
          content_type: "markdown",
          body: `Hi, ${given_name} ${family_name} has been removed as a member of ${companyName}!`,
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
});

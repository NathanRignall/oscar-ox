import { serve } from "std/server";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "../db-types.ts";

type SubscriptionsRecord = Database["public"]["Tables"]["subscriptions"]["Row"];

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: SubscriptionsRecord;
  schema: string;
  old_record: null | SubscriptionsRecord;
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
      const { profile_id, category_id } = payload.record;

      // get the user's email
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("email")
        .eq("id", profile_id)
        .single();

      if (!profile) throw new Error("No profile found");

      const email = profile.email;

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
        `${api}/lists?query=category-${category_id}&page=1&per_page=1`,
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

      return new Response("okay");
    } else if (payload.type === "DELETE") {
      // if there is no old record, do nothing
      if (!payload.old_record) throw new Error("No old record found");

      const { profile_id, category_id } = payload.old_record;

      // get the user's email
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("email")
        .eq("id", profile_id)
        .single();

      if (!profile) throw new Error("No profile found");

      const email = profile.email;

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
        `${api}/lists?query=category-${category_id}&page=1&per_page=1`,
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

      return new Response("okay");
    }

    return new Response("none");
  } catch (error) {
    console.log(error);
    return new Response("error");
  }
});

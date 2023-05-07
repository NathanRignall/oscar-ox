import { serve } from "std/server";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "../db-types.ts";
import { getArray, getSingle } from "../type-convert.ts";

type UserRecord = {
  id: string;
  email: string;
  raw_user_meta_data: {
    [key: string]: string;
  };
};

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: UserRecord;
  schema: string;
  old_record: null | UserRecord;
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
      const { email } = payload.record;

      await fetch(`${api}/subscribers`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          email,
          name: payload.record.raw_user_meta_data.name,
          status: "enabled",
          attribs: {
            source: "supabase",
            user_id: payload.record.id,
          },
        }),
      });

      return new Response("okay");
    } else if (payload.type === "UPDATE") {
      // if there is no old record, do nothing
      if (!payload.old_record) {
        return new Response("okay");
      }

      // get the user id
      const { id } = payload.record;

      // get the email from the old record and the new record
      const { email: oldEmail } = payload.old_record;
      const { email: newEmail } = payload.record;

      // if the email is changed
      if (oldEmail != newEmail) {
        // get the subscriber id
        const subscribersResponse = await fetch(
          `${api}/subscribers?query=subscribers.email='${oldEmail}'&page=1&per_page=1`,
          {
            method: "GET",
            headers,
          }
        );

        const subscribers = await subscribersResponse.json();
        const id = subscribers.data.results[0].id;

        // update the subscriber
        await fetch(`${api}/subscribers/${id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({
            email: newEmail,
          }),
        });
      }

      // get the raw_user_meta_data from the old record and the new record
      const { raw_user_meta_data: oldRawUserMetaData } = payload.old_record;
      const { raw_user_meta_data: newRawUserMetaData } = payload.record;

      // if the raw_user_meta_data is changed
      if (oldRawUserMetaData != newRawUserMetaData) {
        // get the finished_onboarding from the old record and the new record
        const finishedOnboarding = newRawUserMetaData.finished_onboarding;
        const previousFinishedOnboarding =
          oldRawUserMetaData.finished_onboarding;

        // if the finished_onboarding is changed from false to true
        if (finishedOnboarding && !previousFinishedOnboarding) {
          // get the subscriber id
          const subscribersResponse = await fetch(
            `${api}/subscribers?query=subscribers.email='${newEmail}'&page=1&per_page=1`,
            {
              method: "GET",
              headers,
            }
          );

          const subscribers = await subscribersResponse.json();
          const subscriber_id = subscribers.data.results[0].id;

          // get subscriptions the subscriber is subscribed to
          const { data: _subscriptions } = await supabaseClient
            .from("subscriptions")
            .select(
              `
              category: categories (id, title)
            `
            )
            .eq("profile_id", id);

          // do nothing if there are no subscriptions
          if (!_subscriptions) {
            return new Response("okay");
          }

          const subscriptions = getArray(_subscriptions).map((subscription) => {
            return {
              category: getSingle(subscription.category),
            };
          });

          // create a message
          const message = `Thanks for signing up to notifcations. You're now subscribed to the following categories: ${subscriptions
            .map((subscription) => subscription.category.title)
            .join(", ")}.`;

          // create a transaction
          await fetch(`${api}/tx`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              subscriber_email: newEmail,
              template_id: 3,
              data: {
                subject: "Welcome to Oscar Ox!",
                lead: "Hello,",
                message,
              },
            }),
          });
        }
      }

      return new Response("okay");
    } else if (payload.type === "DELETE") {
      // if there is no old record, do nothing
      if (!payload.old_record) {
        return new Response("okay");
      }

      // get the email from the old record
      const { email } = payload.old_record;

      // get the subscriber id
      const subscribersResponse = await fetch(
        `${api}/subscribers?query=subscribers.email='${email}'&page=1&per_page=1`,
        {
          method: "GET",
          headers,
        }
      );

      const subscribers = await subscribersResponse.json();
      const id = subscribers.data.results[0].id;

      // delete the subscriber
      await fetch(`${api}/subscribers/${id}`, {
        method: "DELETE",
        headers,
      });

      return new Response("okay");
    }

    return new Response("none");
  } catch (error) {
    console.log(error);
    return new Response("error");
  }
});

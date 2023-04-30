import { serve } from "std/server";

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

const api = Deno.env.get('LISTMONK_API');

const headers = {
  "Content-Type": "application/json",
  Authorization: Deno.env.get('LISTMONK_API_AUTHORIZATION'),
};

serve(async (req) => {
  const payload: WebhookPayload = await req.json();

  try {
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

      await fetch(`${api}/tx`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          subscriber_email: email,
          template_id: 3,
        }),
      });

      return new Response("okay");
    } else if (payload.type === "UPDATE") {
      // if there is no old record, do nothing
      if (!payload.old_record) {
        return new Response("okay");
      }

      // get the email from the old record and the new record
      const { email: oldEmail } = payload.old_record;
      const { email: newEmail } = payload.record;

      // if the email is the same, do nothing
      if (oldEmail === newEmail) {
        return new Response("okay");
      }

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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Database } from "../db-types.ts";

type CompanyRecord = Database["public"]["Tables"]["companies"]["Row"];

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: CompanyRecord;
  schema: string;
  old_record: null | CompanyRecord;
}

const api = Deno.env.get("LISTMONK_API");

const headers = {
  "Content-Type": "application/json",
  Authorization: Deno.env.get('LISTMONK_API_AUTHORIZATION') as string,
};

serve(async (req) => {
  const payload: WebhookPayload = await req.json();

  try {
    if (payload.type === "INSERT") {
      const { id: uuid, name } = payload.record;

      // create a new list
      await fetch(`${api}/lists`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: `company-${uuid}`,
          type: "private",
          optin: "single",
          description: `Category: ${name}`,
        }),
      });

      return new Response("okay");
    } else if (payload.type === "DELETE") {
      // if there is no old record, do nothing
      if (!payload.old_record) {
        return new Response("okay");
      }

      // get the uuid from the old record (it should be the same as the new record)
      const { id: uuid } = payload.old_record;

      // get the list id
      const listResponse = await fetch(
        `${api}/lists?query=company-${uuid}&page=1&per_page=1`,
        {
          method: "GET",
          headers,
        }
      );

      const list = await listResponse.json();
      const id = list.data.results[0].id;

      // delete the list
      await fetch(`${api}/lists/${id}`, {
        method: "DELETE",
        headers,
      });

      return new Response("okay");
    }
    
    return new Response("none");
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

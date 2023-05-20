import { serve } from "std/server";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "../db-types.ts";
import { getSingle } from "../type-convert.ts";

type ParticipantRecord =
  Database["public"]["Tables"]["participants"]["Row"];

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: ParticipantRecord;
  schema: string;
  old_record: null | ParticipantRecord;
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
      const { profile_id, production_id, title } = payload.record;

      // get the user's email
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("email, given_name")
        .eq("id", profile_id)
        .single();

      if (!profile) throw new Error("No profile found");

      const email = profile.email;
      const given_name = profile.given_name;

      // get the details of the production joined with the company
      const { data: _production } = await supabaseClient
        .from("productions")
        .select(
          `
            id,
            title,
            company: companies (
              id,
              name,
              main_colour
            )
          `
        ).match({ id: production_id }).single();

      if (!_production) throw new Error("No production found");

      const production = {
        id: _production.id,
        title: _production.title,
        company: getSingle(_production.company),
      };

      // create a subject
      const subject = `You have been added as a participant for ${production.title}`;

      // create a message
      const message = `You have been added as a participant for the '${production.title}' production with the '${title}' title by ${production.company.name}. You can log in to your account to view the production details and optionally remove yourself from the production.`;

      // create a transaction
      await fetch(`${api}/tx`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          subscriber_email: email,
          template_id: 3,
          data: {
            subject,
            lead: `Hello ${given_name},`,
            message,
          },
        }),
      });

      return new Response("ok");
    }

    return new Response("none");
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

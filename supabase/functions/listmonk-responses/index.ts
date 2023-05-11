import { serve } from "std/server";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "../db-types.ts";
import { getSingle } from "../type-convert.ts";

type ResponseRecord =
  Database["public"]["Tables"]["responses"]["Row"];

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: ResponseRecord;
  schema: string;
  old_record: null | ResponseRecord;
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
      const { profile_id, vacancy_id } = payload.record;

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
      const { data: _vacancies } = await supabaseClient
        .from("vacancies")
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
        ).match({ id: vacancy_id }).single();

      if (!_vacancies) throw new Error("No production found");

      const vacancies = {
        id: _vacancies.id,
        title: _vacancies.title,
        company: getSingle(_vacancies.company),
      };

      // create a subject
      const subject = `Thanks for responding to '${vacancies.title}'`;

      // create a message
      const message = `Thank you for responding to '${vacancies.title}' from ${vacancies.company.name}! We'll be in touch soon via email.`;

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
    return new Response("error");
  }
});

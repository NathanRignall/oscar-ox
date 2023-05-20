import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "../db-types.ts";

type User = {
  email: string;
  given_name: string;
  family_name: string;
};

type Participant = {
  production_id: string;
  category_id: string;
  title: string;
};

interface Payload {
  user: User;
  participant: Participant;
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const payload: Payload = await req.json();

  try {
    // connect to supabase as admin
    const supabaseAdminClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );

    // invite user
    const { error } = await supabaseAdminClient.auth.admin.inviteUserByEmail(
      payload.user.email,
      {
        data: {
          given_name: payload.user.given_name,
          family_name: payload.user.family_name,
        },
        redirectTo: "https://ox.nlr.app/",
      }
    );

    if (error) throw new Error(error.message);

    // get the user's id
    const { data: profile } = await supabaseAdminClient
      .from("profiles")
      .select("id")
      .eq("email", payload.user.email)
      .single();

    if (!profile) throw new Error("No profile found");

    const profile_id = profile.id;

    // connect to supabase with the user's token
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_ANON_KEY") as string,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // add the user as a participant
    const { error: participantsError } = await supabaseClient
      .from("participants")
      .insert({
        profile_id,
        production_id: payload.participant.production_id,
        category_id: payload.participant.category_id,
        title: payload.participant.title,
      });

    if (participantsError) throw new Error(participantsError.message);

    return new Response("done", { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});

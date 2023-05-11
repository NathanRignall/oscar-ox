import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "../db-types.ts";

type User = {
  email: string;
  given_name: string;
  family_name: string;
};

interface Payload {
  users: User[];
}

serve(async (req) => {
  const payload: Payload = await req.json();

  // take an array of email and names and use them to invite users to the platform

  try {
    // connect to supabase
    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );

    // invite users
    Promise.all(
      payload.users.map(async (user) => {
        const { error } = await supabaseClient.auth.admin.inviteUserByEmail(
          user.email,
          {
            data: {
              given_name: user.given_name,
              family_name: user.family_name,
            },
            redirectTo : "https://ox.nlr.app/profile",
          }
        );

        if (error) throw new Error(error.message);
      })
    );

    return new Response("done");
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
});

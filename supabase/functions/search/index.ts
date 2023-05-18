import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "../db-types.ts";
import { getArray, getSingle } from "../type-convert.ts";

interface Payload {
  search: string;
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
  const search = payload.search;

  try {
    // connect to supabase
    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_ANON_KEY") as string,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const getCompanies = async () => {
      const { data: _companies } = await supabaseClient
        .from("companies")
        .select(
          `
            id,
            slug,
            name,
            main_colour
            `
        )
        .textSearch("name", search, {
          type: "websearch",
          config: "english",
        });

      const companies = getArray(_companies);

      return companies.map((company) => ({
        type: "company",
        data: company,
      }));
    };

    const getProuctions = async () => {
      const { data: _productions } = await supabaseClient
        .from("productions")
        .select(
          `
          id,
          title,
          description,
          is_published,
          events(
            id,
            venue:venues (
                id,
                title
            ),
            start_time,
            end_time,
            ticket_link
          ),
          company: companies (
            id,
            slug,
            name,
            main_colour
          )
          `
        )
        .textSearch("title", search, {
          type: "websearch",
          config: "english",
        });

      const productions = getArray(_productions);

      return productions.map((production) => ({
        type: "production",
        data: {
          id: production.id,
          title: production.title,
          description: production.description,
          is_published: production.is_published,
          events: getArray(production.events).map((event) => ({
            id: event.id,
            venue: getSingle(event.venue),
            start_time: event.start_time,
            end_time: event.end_time,
            ticket_link: event.ticket_link,
          })),
          company: getSingle(production.company),
        },
      }));
    };

    const getProfiles = async () => {
      const { data: _profiles } = await supabaseClient
        .from("profiles")
        .select(
          `
          id,
          given_name,
          family_name,
          biography,
          avatar_url
        `
        )
        .textSearch("given_name", search, {
          type: "websearch",
          config: "english",
        });

      const profiles = getArray(_profiles);

      return profiles.map((profile) => ({
        type: "profile",
        data: profile,
      }));
    };

    const getVacancies = async () => {
      const { data: _vacancies } = await supabaseClient
        .from("vacancies")
        .select(
          `
          id,
          company: companies (
            id,
            slug,
            name,
            main_colour
          ),
          title,
          content,
          response_type,
          response_deadline,
          categories(
            id,
            title
          )
        `
        )
        .textSearch("title", search, {
          type: "websearch",
          config: "english",
        });

      const vacancies = getArray(_vacancies);

      return vacancies.map((vacancy) => ({
        type: "vacancy",
        data: {
          id: vacancy.id,
          company: getSingle(vacancy.company),
          title: vacancy.title,
          content: vacancy.content,
          response_type: vacancy.response_type,
          response_deadline: vacancy.response_deadline,
          categories: getArray(vacancy.categories),
        },
      }));
    };

    const getVenues = async () => {
      const { data: _venues } = await supabaseClient
        .from("venues")
        .select(
          `
          id,
          slug,
          title,
          location,
          image_url
        `
        )
        .textSearch("title", search, {
          type: "websearch",
          config: "english",
        });

      const venues = getArray(_venues);

      return venues.map((venue) => ({
        type: "venue",
        data: venue,
      }));
    };

    // asynvrounously get all the data and then combine it
    const data = [
      ...(await getCompanies()),
      ...(await getProuctions()),
      ...(await getProfiles()),
      ...(await getVacancies()),
      ...(await getVenues()),
    ];

    // sort by most exact match to search term
    data.sort((a, b) => {
      const aName = a.data.name || a.data.title || a.data.given_name;
      const bName = b.data.name || b.data.title || b.data.given_name;

      const aIndex = aName.indexOf(search);
      const bIndex = bName.indexOf(search);

      if (aIndex < bIndex) return -1;
      if (aIndex > bIndex) return 1;

      return 0;
    });

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500, ...corsHeaders });
  }
});

import { serve } from "std/server";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "../db-types.ts";

type VancanciesRecord = Database["public"]["Tables"]["vacancies"]["Row"];

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: VancanciesRecord;
  schema: string;
  old_record: null | VancanciesRecord;
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

    if (payload.type === "UPDATE") {
      // if there is no old record, do nothing
      if (!payload.old_record) throw new Error("No old record found");

      const { is_published } = payload.record;
      const { is_published: was_published } = payload.old_record;

      // if the vacancy was not not published and now it is
      if (!(!was_published && is_published)) return new Response("okay");

      // get the category ids
      const { data: vacancy_categories } = await supabaseClient
        .from("vacancy_categories")
        .select(`vacancy_id, category_id`)
        .eq("vacancy_id", payload.record.id);

      if (!vacancy_categories) throw new Error("No vacancy categories found");

      const category_ids = vacancy_categories.map(
        (vacancy_category) => vacancy_category.category_id
      );

      // get the list ids
      const listIds = await Promise.all(
        category_ids.map(async (category_id) => {
          const listResponse = await fetch(
            `${api}/lists?query=category-${category_id}&page=1&per_page=1`,
            {
              method: "GET",
              headers,
            }
          );

          const list = await listResponse.json();
          return list.data.results[0].id;
        })
      );

      // create a new campaign
      const campaignResponse = await fetch(`${api}/campaigns`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: `Vacancy ${payload.record.id}`,
          subject: "Vacancy: " + payload.record.title,
          lists: listIds,
          type: "regular",
          content_type: "markdown",
          body: payload.record.content,
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
    console.log(error);
    return new Response("error");
  }
});

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import { ProfileNavigation } from "@/containers";

// do not cache this page
export const revalidate = 0;

// page
export default async function Account() {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: _responses } = await supabase
    .from("responses")
    .select(
      `
        id,
        vacancy:vacancies (
          title,
          inserted_at
        ),
        message
      `
    )
    .match({ profile_id: user?.id })

  const responses = getArray(_responses).map((response) => ({
    id: response.id,
    vacancy: getSingle(response.vacancy),
    message: response.message,
  }))

  return (
    <>
      <main className="max-w-3xl mx-auto">

        Responses

        {JSON.stringify(responses)}

      </main>
    </>
  );
}

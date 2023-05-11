import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";

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
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="mb-3 text-5xl sm:text-6xl font-extrabold text-slate-900">
          Responses
        </h1>
        <p className="mb-3 text-xl text-slate-600">
          Your Responses to Vacancies
        </p>
      </header>

      <main className="max-w-3xl mx-auto">

        Responses

        {JSON.stringify(responses)}

      </main>
    </>
  );
}

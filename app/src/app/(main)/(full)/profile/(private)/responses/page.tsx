import { Tag } from "@/components/ui";
import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import Link from "next/link";

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
          id,
          company:companies (
            id,
            slug,
            name,
            main_colour
          ),
          title,
          inserted_at
        ),
        message
      `
    )
    .match({ profile_id: user?.id })

  const responses = getArray(_responses).map((response) => {
    const vacancy = getSingle(response.vacancy)
    return {
      id: response.id,
      vacancy: {
        id: vacancy.id,
        company: getSingle(vacancy.company),
        title: vacancy.title,
      },
      message: response.message,
    }
  })

  return (
    <>
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="mb-3 text-5xl font-extrabold text-slate-900">
          Responses
        </h1>
        <p className="mb-3 text-xl text-slate-600">
          Your Responses to Vacancies
        </p>
      </header>

      <main className="max-w-3xl mx-auto">
        <ul className="mt-4 grid gap-4">
          {responses.map((response) => {
            return (
              <li
                key={response.id}
                className=" bg-white rounded-lg border-2 border-slate-200 p-6"
              >
                <Link
                  href={`/companies/${response.vacancy.company.slug}#${response.vacancy.id}`}
                  scroll={false}
                >
                  <h3 className="text-lg font-bold text-slate-900 underline mb-2">
                    {response.vacancy.title}
                  </h3>
                </Link>
                
                <ul className="flex flex-wrap gap-2 mb-3">
                  <li>
                    <Tag
                      text={response.vacancy.company.name}
                      href={`/companies/${encodeURIComponent(
                        response.vacancy.company.slug
                      )}`}
                      color={response.vacancy.company.main_colour}
                      size="sm"
                    />
                  </li>
                </ul>

                <p className="text-sm text-slate-600 mb-2 line-clamp-3">
                  {response.message}
                </p>
              </li>
            );
          })}
        </ul>

      </main>
    </>
  );
}

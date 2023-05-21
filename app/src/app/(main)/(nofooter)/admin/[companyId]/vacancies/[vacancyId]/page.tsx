import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import { Editor } from "./Editor";

// do not cache this page
export const revalidate = 0;

// Page
export default async function Production({
  params,
}: {
  params: { companyId: string; vacancyId: string };
}) {
  const supabase = createServerClient();

  const { data: _vacancy } = await supabase
    .from("vacancies")
    .select(
      `
      id,
      title,
      content,
      is_open,
      is_published,
      inserted_at,
      responses(
        id,
        message,
        inserted_at,
        profile: profiles (
          id,
          email,
          given_name,
          family_name
        )
      ),
      categories(
        id,
        title
      )
      `
    )
    .match({ id: params.vacancyId })
    .single();

  if (!_vacancy) notFound();

  const vacnacy = {
    id: _vacancy.id,
    title: _vacancy.title,
    content: _vacancy.content,
    is_open: _vacancy.is_open,
    is_published: _vacancy.is_published,
    inserted_at: _vacancy.inserted_at,
    responses: getArray(_vacancy.responses).map((response) => ({
      id: response.id,
      message: response.message,
      inserted_at: response.inserted_at,
      profile: getSingle(response.profile),
    })),
    categories: getArray(_vacancy.categories),
  };

  return (
    <>
      <header>
        <div className="flex items-center">
          <h1 className="flex items-center text-4xl font-bold text-slate-900 dark:text-white">
            <Link href={`/admin/${params.companyId}/vacancies`}>
              <svg
                className="h-5 w-5 mr-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={4}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </Link>
            Vacancies
          </h1>
        </div>
      </header>

      <section className="mt-4">
        <Editor vacancy={vacnacy} />
      </section>

      <section className="mt-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Responses
        </h2>

        <ul className="mt-4 grid 2xl:grid-cols-2 gap-4">
          {vacnacy.responses.map((response) => (
            <li
              key={response.id}
              className=" rounded-lg border-2 p-6 bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-600"
            >
              <Link href={`/profile/${response.profile.id}`} scroll={false}>
                <h3 className="text-lg font-bold underline mb-1 text-slate-900 dark:text-white">
                  {`${response.profile.given_name} ${response.profile.family_name}`}
                </h3>
              </Link>

              <p className="text-sm mb-1 text-slate-600 dark:text-slate-300">
                {response.profile.email}
              </p>

              <p className="text-sm text-slate-600 dark:text-slate-300">
                {response.message}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

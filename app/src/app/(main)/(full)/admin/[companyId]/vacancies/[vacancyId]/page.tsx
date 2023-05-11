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
          <h1 className="flex items-center text-4xl font-bold text-slate-900">
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
        <h2 className="text-2xl font-bold text-slate-900">Responses</h2>

        {vacnacy.responses.map((response) => (
          <div key={response.id} className="mt-4">
            {response.id}
            <br />
            {response.message}
            <br />
            {response.inserted_at}
            <br />
            {response.profile.family_name} - {response.profile.given_name} - {response.profile.email}
          </div>
        ))}
      </section>
    </>
  );
}

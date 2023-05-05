import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { Tag } from "@/components/ui";
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
      inserted_at
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
  };

  return (
    <>
      <header>
        <div className="flex items-center">
          <h1 className="flex items-center text-4xl font-bold text-slate-900 mb-3">
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
            {vacnacy.title}
          </h1>

          {vacnacy.is_published ? (
            <Tag text="Published" variant="green" className="ml-2" size="sm" />
          ) : (
            <Tag text="Draft" variant="blue" className="ml-2" size="sm" />
          )}
        </div>
      </header>

      <section className="mt-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          {vacnacy.is_published ? "Preview" : "Editor"}
        </h2>

        <Editor
          vacancyId={params.vacancyId}
          intialContent={vacnacy.content || undefined}
          preview={vacnacy.is_published}
        />
      </section>
    </>
  );
}

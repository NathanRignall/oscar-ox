import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";

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
      description,
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
    description: _vacancy.description,
    is_open: _vacancy.is_open,
    is_published: _vacancy.is_published,
    inserted_at: _vacancy.inserted_at,
  };

  return (
    <>
      <header>
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
      </header>
    </>
  );
}

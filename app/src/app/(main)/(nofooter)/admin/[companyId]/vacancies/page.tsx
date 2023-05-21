import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray } from "@/lib/supabase-type-convert";
import { NewVacancyButton } from "./NewVacancyButton";
import { Tag } from "@/components/ui";

// do not cache this page
export const revalidate = 0;

// Page
export default async function Vacancies({
  params,
}: {
  params: { companyId: string };
}) {
  const supabase = createServerClient();

  const { data: _vacancies } = await supabase
    .from("vacancies")
    .select(
      `
      id,
      title,
      is_open,
      is_published,
      inserted_at,
      responses(
        id
      ),
      categories(
        id,
        title
      )
      `
    )
    .match({ company_id: params.companyId });

  const vacancies = getArray(_vacancies).map((vacancy) => {
    return {
      id: vacancy.id,
      title: vacancy.title,
      is_open: vacancy.is_open,
      is_published: vacancy.is_published,
      inserted_at: vacancy.inserted_at,
      responses: getArray(vacancy.responses).length,
      categories: getArray(vacancy.categories),
    };
  });

  return (
    <>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Vacancies
      </h1>

      <section className="mt-4">
        <NewVacancyButton companyId={params.companyId} />

        <div className="mt-4 border-2 rounded-lg overflow-hidden border-slate-200 dark:border-slate-600">
          <table className="w-full text-left divide-y-2 divide-slate-200 dark:divide-slate-600">
            <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 dark:text-slate-200 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-4 py-4">
                  Title
                </th>
                <th scope="col" className="px-4 py-4">
                  Issue Date
                </th>
                <th scope="col" className="px-4 py-4">
                  Responses
                </th>
                <th scope="col" className="px-4 py-4">
                  Tags
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-solid divide-slate-200 dark:divide-slate-600">
              {vacancies.map((vacancy) => (
                <tr
                  key={vacancy.id}
                  className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-900"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 font-bold whitespace-nowrap underline text-slate-900 dark:text-white"
                  >
                    <Link
                      href={`/admin/${params.companyId}/vacancies/${vacancy.id}`}
                    >
                      {vacancy.title}
                    </Link>
                  </th>

                  <td className="px-4 py-4 whitespace-nowrap text-slate-500 dark:text-slate-300">
                    {new Date(vacancy.inserted_at).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  <td className="px-4 py-4 text-slate-500 dark:text-slate-300">
                    {vacancy.responses}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap space-x-1 text-slate-500 dark:text-slate-300">
                    {vacancy.categories.map((category) => (
                      <Tag
                        key={category.id}
                        text={category.title}
                        variant="secondary"
                        size="sm"
                      />
                    ))}
                  </td>

                  <td className="px-4 text-right">
                    {vacancy.is_published ? (
                      <Tag text="Published" variant="green" size="sm" />
                    ) : (
                      <Tag text="Draft" variant="blue" size="sm" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

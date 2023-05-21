import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray } from "@/lib/supabase-type-convert";
import { AddProductionModal } from "./AddProductionModal";
import { Tag } from "@/components/ui";

// do not cache this page
export const revalidate = 0;

// Page
export default async function Productions({
  params,
}: {
  params: { companyId: string };
}) {
  const supabase = createServerClient();

  const { data: _productions } = await supabase
    .from("productions")
    .select(
      `
      id,
      title,
      description,
      is_published,
      events(
        id
      ),
      vacancies(
        id
      )
      `
    )
    .match({ company_id: params.companyId });

  const productions = getArray(_productions).map((production) => {
    return {
      id: production.id,
      title: production.title,
      description: production.description,
      is_published: production.is_published,
      events: getArray(production.events).length,
      vacancies: getArray(production.vacancies).length,
    };
  });

  return (
    <>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Productions</h1>

      <section className="mt-4">
        <AddProductionModal company_id={params.companyId} />

        <div className="mt-4 border-2 rounded-lg overflow-hidden border-slate-200 dark:border-slate-600">
          <table className="w-full text-left divide-y-2 divide-slate-200 dark:divide-slate-600">
            <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 dark:text-slate-200 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-4 py-4">
                  Name
                </th>
                <th scope="col" className="px-4 py-4">
                  Description
                </th>
                <th scope="col" className="px-4 py-4">
                  Events
                </th>
                <th scope="col" className="px-4 py-4">
                  Vacancies
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  Visability
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-solid divide-slate-200 dark:divide-slate-600">
              {productions.map((item) => (
                <tr key={item.id} className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-900">
                  <th
                    scope="row"
                    className="px-4 py-4 font-bold whitespace-nowrap underline text-slate-900 dark:text-white"
                  >
                    <Link
                      href={`/admin/${params.companyId}/productions/${item.id}`}
                    >
                      {item.title}
                    </Link>
                  </th>

                  <td className="px-4 py-4 max-w-sm whitespace-nowrap">
                    <p className="text-sm truncate text-slate-500 dark:text-slate-300">
                      {item.description}
                    </p>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-500 dark:text-slate-300">
                      {item.events}
                    </span>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-500 dark:text-slate-300">
                      {item.vacancies}
                    </span>
                  </td>

                  <td className="px-4 text-right whitespace-nowrap">
                    {item.is_published ? (
                      <Tag text="Published" variant="green" />
                    ) : (
                      <Tag text="Draft" variant="blue" />
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

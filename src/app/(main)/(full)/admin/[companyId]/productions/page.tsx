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
      <h1 className="text-4xl font-bold text-slate-900">Productions</h1>

      <section className="mt-4">
        <AddProductionModal company_id={params.companyId} />

        <div className="mt-4 border-2 border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left divide-y-2 divide-gray-200">
            <thead className="text-xs font-semibold text-slate-500 bg-slate-50 uppercase">
              <tr>
                <th scope="col" className="px-4 py-4">
                  Name
                </th>
                <th scope="col" className="px-4 py-4">
                  Description
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  Events
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  Vacancies
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  Visability
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-solid divide-slate-200">
              {productions.map((item) => (
                <tr key={item.id} className="bg-white hover:bg-slate-50">
                  <th
                    scope="row"
                    className="px-4 py-4 font-bold text-slate-900 whitespace-nowrap underline"
                  >
                    <Link href={`/admin/${params.companyId}/productions/${item.id}`}>{item.title}</Link>
                  </th>

                  <td className="px-4 py-4 max-w-md">
                    <p className="text-sm text-slate-500 truncate">{item.description}</p>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <span className="text-sm text-slate-500">
                      {item.events}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <span className="text-sm text-slate-500">
                      {item.vacancies}
                    </span>
                  </td>

                  <td className="px-4 text-right">
                    {item.is_published ? <Tag text="Published" variant="green"/> : <Tag text="Draft" variant="blue"/>}
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

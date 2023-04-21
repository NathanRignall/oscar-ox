import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray } from "@/lib/supabase-type-convert";
import { AddProductionModal } from "./AddProductionModal";
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
      inserted_at
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
    };
  });

  return (
    <>
      <h1 className="text-4xl font-bold text-slate-900">Vacancies</h1>

      <section className="mt-4">
        <AddProductionModal company_id={params.companyId} />

        <div className="mt-4 border-2 border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left divide-y-2 divide-gray-200">
            <thead className="text-xs font-semibold text-slate-500 bg-slate-50 uppercase">
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

            <tbody className="divide-y-2 divide-solid divide-slate-200">
              {vacancies.map((vacancy) => (
                <tr key={vacancy.id} className="bg-white hover:bg-gray-50">
                  <th
                    scope="row"
                    className="px-4 py-4 font-bold text-gray-900 underline"
                  >
                    <Link href={`/admin/${params.companyId}/vacancies/${vacancy.id}`}>{vacancy.title}</Link>
                  </th>

                  <td className="px-4 py-4 text-gray-500">
                    {vacancy.inserted_at}
                  </td>

                  <td className="px-4 py-4 text-gray-500">10</td>

                  <td className="px-4 py-4 text-gray-500">
                    <Tag text="Crew" />
                  </td>

                  <td className="px-4 text-right">
                    {vacancy.is_published ? (
                      <Tag text="Published" color="green" />
                    ) : (
                      <Tag text="Draft" color="blue" />
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

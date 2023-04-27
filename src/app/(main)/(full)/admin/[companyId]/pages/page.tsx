import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray } from "@/lib/supabase-type-convert";
import { Tag } from "@/components/ui";

// do not cache this page
export const revalidate = 0;

// Page
export default async function Pages({
  params,
}: {
  params: { companyId: string };
}) {
  const supabase = createServerClient();

  const { data: _pages } = await supabase
    .from("pages")
    .select(
      `
      id,
      url,
      title,
      is_published
      `
    )
    .match({ company_id: params.companyId });

  const pages = getArray(_pages);

  return (
    <>
      <h1 className="text-4xl font-bold text-slate-900">Pages</h1>

      <section className="mt-4">
        <div className="mt-4 border-2 border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left divide-y-2 divide-gray-200">
            <thead className="text-xs font-semibold text-slate-500 bg-slate-50 uppercase">
              <tr>
                <th scope="col" className="px-4 py-4">
                  Title
                </th>
                <th scope="col" className="px-4 py-4">
                  URL
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-solid divide-slate-200">
              {pages.map((page) => (
                <tr key={page.id} className="bg-white hover:bg-gray-50">
                  <th
                    scope="row"
                    className="px-4 py-4 font-bold text-gray-900 underline"
                  >
                    <Link
                      href={`/admin/${params.companyId}/pages/${page.id}`}
                    >
                      {page.title}
                    </Link>
                  </th>

                  <td className="px-4 py-4">/{page.url}</td>

                  <td className="px-4 text-right">
                    {page.is_published ? (
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

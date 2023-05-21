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
      slug,
      title,
      is_published
      `
    )
    .match({ company_id: params.companyId });

  const pages = getArray(_pages);

  return (
    <>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Pages
      </h1>

      <section className="mt-4">
        <div className="mt-4 border-2 rounded-lg overflow-hidden border-slate-200 dark:border-slate-600">
          <table className="w-full text-left divide-y-2 divide-slate-200 dark:divide-slate-600">
            <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 dark:text-slate-200 dark:bg-slate-700">
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

            <tbody className="divide-y-2 divide-solid divide-slate-200 dark:divide-slate-600">
              {pages.map((page) => (
                <tr
                  key={page.id}
                  className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-900"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 font-bold whitespace-nowrap underline text-gray-900 dark:text-white"
                  >
                    <Link href={`/admin/${params.companyId}/pages/${page.id}`}>
                      {page.title}
                    </Link>
                  </th>

                  <td className="px-4 py-4 whitespace-nowrap text-slate-500 dark:text-slate-300">
                    /{page.slug}
                  </td>

                  <td className="px-4 text-right whitespace-nowrap">
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

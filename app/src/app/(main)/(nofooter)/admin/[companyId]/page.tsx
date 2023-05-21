import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import { Tag } from "@/components/ui";
import { notFound } from "next/navigation";
import { get } from "http";

// do not cache this page
export const revalidate = 0;

// Page
export default async function Pages({
  params,
}: {
  params: { companyId: string };
}) {
  const supabase = createServerClient();

  const { data: company } = await supabase
    .from("companies")
    .select(
      `
      id,
      slug,
      name,
      description,
      main_colour,
      is_public,
      is_verified
      `
    )
    .match({ id: params.companyId })
    .single();

  if (!company) notFound();

  const { data: _vacancies } = await supabase
    .from("vacancies")
    .select(
      `
      id,
      title,
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
      )
      `
    )
    .match({ company_id: params.companyId });

  const vacancies = getArray(_vacancies).map((vacancy) => ({
    id: vacancy.id,
    title: vacancy.title,
    responses: getArray(vacancy.responses).map((response) => ({
      id: response.id,
      message: response.message,
      inserted_at: response.inserted_at,
      profile: getSingle(response.profile),
    })),
  }));

  type Reponse = {
    id: string;
    message: string;
    inserted_at: string;
    profile: {
      id: string;
      email: string;
      given_name: string;
      family_name: string;
    };
    vacancy: {
      id: string;
      title: string;
    };
  };

  // get all responses
  const responses: Reponse[] = [];
  vacancies.forEach((vacancy) => {
    vacancy.responses.forEach((response) => {
      responses.push({
        id: response.id,
        message: response.message,
        inserted_at: response.inserted_at,
        profile: response.profile,
        vacancy: {
          id: vacancy.id,
          title: vacancy.title,
        },
      });
    });
  });

  // sort responses by date
  responses.sort((a, b) => {
    const aDate = new Date(a.inserted_at);
    const bDate = new Date(b.inserted_at);

    if (aDate > bDate) return -1;
    if (aDate < bDate) return 1;
    return 0;
  });

  return (
    <>
      <h1 className="mb-3 text-5xl font-bold text-slate-900 dark:text-white">
        {company.name}
      </h1>

      <ul className="flex flex-wrap gap-2 mb-3">
        {company.is_verified && (
          <li>
            <Tag text="Verified" variant="blue" />
          </li>
        )}

        {company.is_public ? (
          <li>
            <Tag text="Public" variant="green" />
          </li>
        ) : (
          <li>
            <Tag text="Private" variant="red" />
          </li>
        )}
      </ul>

      <p className="mb-3 text-xl text-slate-600 dark:text-slate-300">
        {company.description}
      </p>

      <article className="mt-4">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
          Recent Responses
        </h2>

        <div className="mt-4 border-2 rounded-lg overflow-hidden border-slate-200 dark:border-slate-600">
          <table className="w-full text-left divide-y-2 divide-slate-200 dark:divide-slate-600">
            <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 dark:text-slate-200 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-4 py-4">
                  Name
                </th>
                <th scope="col" className="px-4 py-4">
                  Email
                </th>
                <th scope="col" className="px-4 py-4">
                  Date
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  Vacancy
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-solid divide-slate-200 dark:divide-slate-600">
              {responses.map((response) => (
                <tr
                  key={response.profile.id}
                  className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-900"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 whitespace-nowrap underline text-slate-900 dark:text-white"
                  >
                    <Link href={`/profile/${response.profile.id}`}>
                      {response.profile.given_name}{" "}
                      {response.profile.family_name}
                    </Link>
                  </th>

                  <td className="px-4 py-4 whitespace-nowrap text-slate-900 dark:text-white">
                    {response.profile.email}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-slate-500 dark:text-slate-300">
                    {new Date(response.inserted_at).toLocaleDateString(
                      "en-GB",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </td>

                  <td className="px-4 py-4 text-right whitespace-nowrap underline font-semibold text-slate-900 dark:text-white">
                    <Link
                      href={`/admin/${params.companyId}/vacancies/${response.vacancy.id}#${response.id}`}
                    >
                      {response.vacancy.title}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </>
  );
}

import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray } from "@/lib/supabase-type-convert";
import { Tag } from "@/components/ui";
import { notFound } from "next/navigation";

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
    ).match({ id: params.companyId })
    .single();

  if (!company) notFound();

  return (
    <>
      <h1 className="mb-3 text-5xl font-bold text-slate-900 dark:text-white">
        {company.name}
      </h1>

      <ul className="flex flex-wrap gap-2 mb-3">

        {
          company.is_verified && (
            <li>
              <Tag text="Verified" variant="blue" />
            </li>
          )
        }


        {
          company.is_public ? (
            <li>
              <Tag text="Public" variant="green" />
            </li>
          ) : (
            <li>
              <Tag text="Private" variant="red" />
            </li>
          )
        }

      </ul>

      <p className="mb-3 text-xl text-slate-600 dark:text-slate-300">
        {company.description}
      </p>
    </>
  );
}

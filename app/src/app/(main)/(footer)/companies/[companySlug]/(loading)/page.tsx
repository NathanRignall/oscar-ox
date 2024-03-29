import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { PageProps } from "@/themes";

// import all themes
const Themes = {
  default: dynamic<PageProps>(() => import("@/themes/default/page")),
  "00productions": dynamic<PageProps>(
    () => import("@/themes/00productions/page")
  ),
};

// Page
export default async function Company({
  params,
}: {
  params: { companySlug: string };
}) {
  const supabase = createServerClient();

  const { data: company } = await supabase
    .from("companies")
    .select(
      `
        id,
        theme
      `
    )
    .match({ slug: params.companySlug })
    .single();

  if (!company) notFound();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/companies/${company.id}/pages/index.mdx`
  );

  const markdown = await res.text();

  const Page = Themes[company.theme];

  return <Page source={markdown} companyId={company.id} />;
}

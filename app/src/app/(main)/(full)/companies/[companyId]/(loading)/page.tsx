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
  params: { companyId: string };
}) {
  const supabase = createServerClient();

  const { data: _company } = await supabase
    .from("companies")
    .select(
      `
        theme
      `
    )
    .match({ id: params.companyId })
    .single();

  if (!_company) notFound();

  const company = {
    theme: _company.theme,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/companies/${params.companyId}/pages/index.mdx`
  );

  const markdown = await res.text();

  const Page = Themes[company.theme];

  return <Page source={markdown} companyId={params.companyId} />;
}

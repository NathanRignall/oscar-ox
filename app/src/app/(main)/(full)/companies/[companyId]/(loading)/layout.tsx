import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { createServerClient } from "@/lib/supabase-server";
import { getArray } from "@/lib/supabase-type-convert";
import { LayoutProps } from "@/themes";

// import all themes
const Themes = {
  default: dynamic<LayoutProps>(() => import("@/themes/default/layout")),
  "00productions": dynamic<LayoutProps>(
    () => import("@/themes/00productions/layout")
  ),
};

// layout
export default async function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { companyId: string };
}) {
  const supabase = createServerClient();

  const { data: _company } = await supabase
    .from("companies")
    .select(
      `
        id,
        name,
        description,
        main_colour,
        theme,
        pages (
          id,
          slug,
          title
        )
        `
    )
    .match({ id: params.companyId })
    .single();

  if (!_company) notFound();

  const company = {
    id: _company.id,
    name: _company.name,
    description: _company.description,
    main_colour: _company.main_colour,
    theme: _company.theme,
    pages: getArray(_company.pages),
  };

  const Layout = Themes[company.theme];

  return <Layout company={company}>{children}</Layout>;
}

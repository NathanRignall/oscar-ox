import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { getArray } from "@/lib/supabase-type-convert";
import fontColorContrast from "font-color-contrast";

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
    pages: getArray(_company.pages),
  };

  return (
    <>
      <header
        style={{
          backgroundColor: company.main_colour,
        }}
      >
        <div className="container mx-auto py-6 px-8">
          <h1
            className="mb-4 text-5xl font-extrabold"
            style={{
              color: fontColorContrast(company.main_colour),
            }}
          >
            {company.name}
          </h1>
          <p
            className="mb-4 text-xl"
            style={{
              color: fontColorContrast(company.main_colour),
            }}
          >
            {company.description}
          </p>

          <nav className="relative">
            <ul
              className=" flex space-x-4"
              style={{
                color: fontColorContrast(company.main_colour),
              }}
            >
              <Link href={`/companies/${encodeURIComponent(company.id)}`}>
                <li className="text-lg px-2 py-2">Home</li>
              </Link>

              {company.pages.map((page) => (
                <Link
                  key={page.id}
                  href={`/companies/${encodeURIComponent(
                    company.id
                  )}/${encodeURIComponent(page.slug)}`}
                >
                  <li className="text-lg px-4 py-2">{page.title}</li>
                </Link>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div className="container mx-auto py-6 px-8">{children}</div>
    </>
  );
}

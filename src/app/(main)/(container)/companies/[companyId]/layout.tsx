import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
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

  const { data: company } = await supabase
    .from("companies")
    .select(
      `
        id,
        name,
        description,
        main_colour
        `
    )
    .match({ id: params.companyId })
    .single();

  if (!company) notFound();

  return (
    <>
      <header>
        <div
          className="fixed top-20 left-0 w-full h-48"
          style={{
            backgroundColor: company.main_colour,
          }}
        />

        <div className="relative">
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
        </div>

        <nav className="relative mb-8">
          <ul
            className=" flex space-x-4"
            style={{
              color: fontColorContrast(company.main_colour),
            }}
          >
            <Link href={`/companies/${encodeURIComponent(company.id)}`}>
              <li className="text-lg px-2 py-2">Home</li>
            </Link>
            <Link
              href={`/companies/${encodeURIComponent(company.id)}/vacancies`}
            >
              <li className="text-lg px-4 py-2">Vacancies</li>
            </Link>
          </ul>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}

import Link from "next/link";
import fontColorContrast from "font-color-contrast";
import { LayoutProps } from "@/themes";

// layout
export default function Layout({ children, company }: LayoutProps) {
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

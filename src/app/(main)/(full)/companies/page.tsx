import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray } from "@/lib/supabase-type-convert";
import fontColorContrast from "font-color-contrast";

// Page
export default async function Companies() {
  const supabase = createServerClient();

  const { data } = await supabase.from("companies").select(
    `
    id,
    name,
    main_colour
    `
  );

  const companies = getArray(data);

  return (
    <div className="container mx-auto py-6 px-8">
      <form className="flex justify-end w-full">
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>

        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-slate-900"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="simple-search"
            className="w-full rounded-lg border-2 border-slate-200 pl-10 pr-4 py-3 text-md text-slate-900 placeholder-slate-400"
            placeholder="Search Companies"
            required
          />
        </div>
      </form>

      <main>
        <section className="grid grid-cols-3 gap-4 mt-4">
          {companies.map((company) => (
            <Link
              key={company.id}
              href={`/companies/${encodeURIComponent(company.id)}`}
            >
              <div
                className="p-4 aspect-[4/5] flex items-center justify-center shadow-lg"
                style={{
                  backgroundColor: company.main_colour,
                  color: fontColorContrast(company.main_colour),
                }}
              >
                <h2 className="text-4xl font-bold text-center">
                  {company.name}
                </h2>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}

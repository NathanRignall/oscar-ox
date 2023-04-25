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
    <>
      <div className="grid grid-cols-3 gap-4">
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
              <h2 className="text-4xl font-bold text-center">{company.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

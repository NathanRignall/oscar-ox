import { createServerClient } from "@/lib/supabase-server";
import { getArray } from "@/lib/supabase-type-convert";
import { CompaniesList } from "./CompaniesList";

// Page
export default async function Companies() {
  const supabase = createServerClient();

  const { data: _companies } = await supabase.from("companies").select(
    `
    id,
    slug,
    name,
    main_colour
    `
  );

  const companies = getArray(_companies);

  return (
    <div className="container mx-auto py-6 px-8">
      <CompaniesList _companies={companies} />
    </div>
  );
}

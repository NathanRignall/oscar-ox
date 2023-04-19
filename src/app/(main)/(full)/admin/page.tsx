import { createServerClient } from "@/lib/supabase-server";
import { getSingle } from "@/lib/supabase-type-convert";
import { Button, ButtonLink } from "@/components/ui";

// do not cache this page
export const revalidate = 0;

// Page
export default async function Admin() {
  const supabase = createServerClient();

  const { data } = await supabase.from("company_members").select(
    `
    id,
    company:companies (
      id,
      name
    )
    `
  );

  const members = data
    ? data.map((item) => ({
        id: item.id,
        company: getSingle(item.company),
      }))
    : [];

  return (
    <div className="container mx-auto py-6 px-8">
      <header className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="mb-3 text-6xl font-extrabold text-slate-900">Manage</h1>

        <p className="mb-3 text-xl text-slate-600">
          Your Companies to Configure
        </p>
      </header>

      <section className="max-w-3xl mx-auto mt-4">
        <ul className="mt-4 grid gap-4">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex justify-between items-center bg-white rounded-lg border-2 border-slate-200 py-5 px-4"
            >
              <h2 className="text-lg font-bold text-slate-900">
                {member.company.name}
              </h2>
              <ButtonLink
                href={`/admin/${encodeURIComponent(member.company.id)}`}
              >
                Edit
              </ButtonLink>
            </li>
          ))}
        </ul>
      </section>

      <div className="fixed bottom-0 right-0 m-8">
        <Button>Create</Button>
      </div>
    </div>
  );
}

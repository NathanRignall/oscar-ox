import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
// Page
export default async function Roles({
  params,
}: {
  params: { roleSlug: string };
}) {
  const supabase = createServerClient();

  const { data: role } = await supabase
    .from("roles")
    .select(
      `
        id,
        title,
        description,
        image_url
      `
    )
    .match({ slug: params.roleSlug })
    .single();

  if (!role) notFound();

  return (
    <>
      <header className="flex max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          {role.title}
        </h1>
      </header>

      <main className="max-w-3xl mx-auto">
        <p className="text-slate-600 dark:text-slate-300">{role.description}</p>
      </main>
    </>
  );
}

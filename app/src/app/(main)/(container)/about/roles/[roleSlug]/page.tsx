import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { MDXRemote } from "next-mdx-remote/rsc";

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
        title
        `
    )
    .match({ slug: params.roleSlug })
    .single();

  if (!role) notFound();

  return (
    <>
      <h1 className="text-4xl font-bold text-slate-900 mb-4">{role.title}</h1>
    </>
  );
}

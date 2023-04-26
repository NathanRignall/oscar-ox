import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { MDXRemote } from "next-mdx-remote/rsc";

// Page
export default async function Company({
  params,
}: {
  params: { companyId: string, pageUrl: string };
}) {
  const supabase = createServerClient();

  const { data: page } = await supabase
    .from("pages")
    .select(
      `
        id,
        url,
        title
        `
    )
    .match({ company_id: params.companyId, url: params.pageUrl }).single();

  if (!page) notFound();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}storage/v1/object/public/pages/${params.companyId}/${params.pageUrl}/index.mdx`
  );

  const markdown = await res.text();

  return (
    <>
      <h1 className="text-4xl font-bold text-slate-900 mb-4">Home</h1>
      {/* @ts-expect-error */}
      <MDXRemote source={markdown} />
    </>
  );
}

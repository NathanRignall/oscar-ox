import { MDXRemote } from "next-mdx-remote/rsc";

// Page
export default async function Company({
  params,
}: {
  params: { companyId: string };
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pages/${params.companyId}/index.mdx`
  );

  const markdown = await res.text();

  return (
    <>
      <h1 className="text-4xl font-bold text-slate-900">About</h1>
      {/* @ts-expect-error */}
      <MDXRemote source={markdown} />
    </>
  );
}
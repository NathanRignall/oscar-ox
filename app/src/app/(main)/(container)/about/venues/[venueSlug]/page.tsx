import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { MDXRemote } from "next-mdx-remote/rsc";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("./Map"), {
  ssr: false,
});

// Page
export default async function Venue({
  params,
}: {
  params: { venueSlug: string };
}) {
  const supabase = createServerClient();

  const { data: venue } = await supabase
    .from("venues")
    .select(
      `
        id,
        title
        `
    )
    .match({ slug: params.venueSlug })
    .single();

  if (!venue) notFound();

  return (
    <>
      <h1 className="text-4xl font-bold text-slate-900 mb-4">{venue.title}</h1>

      <main>
        <div className="w-full aspect-[2/1] bg-slate-600">
          <MapWithNoSSR />
        </div>
      </main>
    </>
  );
}

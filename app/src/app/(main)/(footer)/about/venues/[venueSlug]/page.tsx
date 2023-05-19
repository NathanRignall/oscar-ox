import { notFound } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { createServerClient } from "@/lib/supabase-server";
import Productions from "./Productions";

const MapWithNoSSR = dynamic(() => import("../Map"), {
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
        title,
        description,
        image_url,
        location,
        latitude,
        longitude
      `
    )
    .match({ slug: params.venueSlug })
    .single();

  if (!venue) notFound();

  return (
    <>
      <header className="flex max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-slate-900">{venue.title}</h1>
      </header>

      <main className="max-w-3xl mx-auto">
        <div className="sm:flex sm:space-x-4 mb-4">
          <div className="basis-2/3">
            <p className="text-slate-600">{venue.description}</p>
          </div>
          <div className="relative basis-1/3">
            <div className="relative aspect-1 bg-slate-300 rounded-md overflow-hidden">
              <Image
                alt=""
                src={`media/venues/${venue.image_url}`}
                className={"duration-200 ease-in-out"}
                fill
                priority
              />
            </div>
          </div>
        </div>

        <div className="w-full aspect-[2/1] bg-slate-600 rounded-md overflow-hidden">
          <MapWithNoSSR
            points={[venue]}
            center={[venue.latitude, venue.longitude]}
            zoom={15}
          />
        </div>

        {/* @ts-expect-error Server Component */}
        <Productions venueId={venue.id} />
      </main>
    </>
  );
}

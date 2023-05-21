import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray } from "@/lib/supabase-type-convert";

const MapWithNoSSR = dynamic(() => import("./Map"), {
  ssr: false,
});

// Page
export default async function Venues() {
  const supabase = createServerClient();

  const { data: _venues } = await supabase.from("venues").select(
    `
    id,
    title,
    slug,
    image_url,
    location,
    latitude,
    longitude
    `
  );

  const venues = getArray(_venues);

  return (
    <>
      <header className="flex max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Venues
        </h1>
      </header>

      <main className="max-w-3xl mx-auto">
        <div className="w-full aspect-[2/1] rounded-md overflow-hiddenbg-slate-700 dark:bg-slate-600">
          <MapWithNoSSR points={venues} />
        </div>
        <ul className="mt-8 grid sm:grid-cols-2 gap-4">
          {venues.map((venue) => (
            <li
              key={venue.id}
              className=" rounded-lg border-2  flex bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-600"
            >
              <div className="p-6 flex-grow">
                <Link href={`/about/venues/${venue.slug}`}>
                  <h2 className="text-lg font-bold underline text-slate-900 dark:text-white">
                    {venue.title}
                  </h2>
                </Link>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {venue.location}
                </p>
              </div>

              <div className="h-full aspect-1 relative rounded-r-md overflow-hidden bg-slate-300 dark:bg-slate-600">
                <Image
                  alt=""
                  src={`media/venues/${venue.image_url}`}
                  className={"duration-200 ease-in-out rounded-r-md"}
                  fill
                  priority
                />
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

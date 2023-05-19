import Link from "next/link";
import Image from "next/image";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import { createServerClient } from "@/lib/supabase-server";
import { Tag } from "@/components/ui";

export type ProductionsProps = {
  venueId: string
};

export default async function Productions({ venueId }: ProductionsProps) {
  const supabase = createServerClient();

  console.log(venueId);

  const { data: _production } = await supabase.from("productions").select(
    `
    id,
    title,
    description,
    company: companies (
      id,
      slug,
      name,
      main_colour
    ),
    events(
      id,
      start_time,
      venue: venues (
        id,
        slug,
        title
      )
    )
    `
  );

  const productions = getArray(_production).map((production) => {
    return {
      id: production.id,
      title: production.title,
      description: production.description,
      company: getSingle(production.company),
      events: getArray(production.events).map((event) => {
        return {
          id: event.id,
          start_time: event.start_time,
          venue: getSingle(event.venue),
        };
      }),
    };
  });

  return (
    <article className="mt-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">
        What&apos;s On
      </h2>

      <ul className="grid sm:grid-cols-2 gap-4">

        {productions.map((production) => {

          let timeMessage = "";

          // get the total number of events
          const totalEvents = production.events.length;

          if (totalEvents == 0) {
            timeMessage = "No events";
          } else if (totalEvents == 1) {
            const event = production.events[0];
            const startTime = new Date(event.start_time);

            timeMessage = `${startTime.toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })} - ${event.venue.title}
      `;
          } else {
            const firstEvent = production.events[0];
            const lastEvent = production.events[totalEvents - 1];

            const startTime = new Date(firstEvent.start_time);
            const endTime = new Date(lastEvent.start_time);

            const startDate = startTime.toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            const endDate = endTime.toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            timeMessage = `${startDate} - ${endDate} - ${firstEvent.venue.title}`;
          }

          return (
            <li key={production.id} className="bg-white rounded-lg border-2 border-slate-200 flex sm:col-span-2">
              <div className="p-6 flex-grow">
                <Link href={`/productions/${production.id}`}>
                  <h3 className="text-lg font-bold text-slate-900 underline mb-2">
                    {production.title}
                  </h3>
                </Link>
                <p className="text-sm text-slate-600 mb-2 ">{timeMessage}</p>

                <ul className="flex flex-wrap gap-2 mb-3">
                  <li>
                    <Tag
                      text={production.company.name}
                      href={`/companies/${encodeURIComponent(production.company.slug)}`}
                      color={production.company.main_colour}
                      size="sm"
                    />
                  </li>
                </ul>
              </div>

              <div className="h-full aspect-1 relative bg-slate-300 rounded-r-md overflow-hidden">
                <Image
                  alt=""
                  src={`profiles/${production.id || "default.jpg"}`}
                  className={"duration-200 ease-in-out rounded-r-md"}
                  fill
                  priority
                />
              </div>
            </li>
          )
        })}
      </ul>
    </article>
  );
}




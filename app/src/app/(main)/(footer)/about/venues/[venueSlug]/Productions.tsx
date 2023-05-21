import Link from "next/link";
import Image from "next/image";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import { createServerClient } from "@/lib/supabase-server";
import { Tag } from "@/components/ui";

export type ProductionsProps = {
  venueId: string;
};

export default async function Productions({ venueId }: ProductionsProps) {
  const supabase = createServerClient();

  console.log(venueId);

  const { data: _events } = await supabase
    .from("events")
    .select(
      `
      id,
      production: productions (
        id,
        company: companies (
          id,
          slug,
          name,
          main_colour
        ),
        image_url,
        title
      ),
      venue: venues (
        id,
        title
      ),
      start_time,
      ticket_link
      `
    )
    .match({ venue_id: venueId });

  const events = getArray(_events).map((event) => {
    const production = getSingle(event.production);
    return {
      id: event.id,
      production: {
        id: production.id,
        company: getSingle(production.company),
        title: production.title,
        image_url: production.image_url,
      },
      venue: getSingle(event.venue),
      start_time: event.start_time,
    };
  });

  type Production = {
    id: string;
    company: {
      id: string;
      name: string;
      slug: string;
      main_colour: string;
    };
    title: string;
    image_url: string | null;
    events: {
      id: string;
      venue: {
        id: string;
        title: string;
      };
      start_time: string;
    }[];
  };

  // loop through the events and get the productions with events as children
  const productions = events.reduce((acc: Production[], event) => {
    // check if the production is already in the accumulator
    const productionIndex = acc.findIndex(
      (production) => production.id == event.production.id
    );

    // if it is, add the event to the production
    if (productionIndex != -1) {
      acc[productionIndex].events.push({
        id: event.id,
        venue: event.venue,
        start_time: event.start_time,
      });
    } else {
      // if it isn't, add the production to the accumulator
      acc.push({
        id: event.production.id,
        company: event.production.company,
        title: event.production.title,
        image_url: event.production.image_url,
        events: [
          {
            id: event.id,
            venue: event.venue,
            start_time: event.start_time,
          },
        ],
      });
    }

    return acc;
  }, []);

  return (
    <article className="mt-8">
      <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
        What&apos;s On
      </h2>

      {productions.length == 0 ? (
        <p className="text-slate-600 dark:text-slate-300">
          No productions found.
        </p>
      ) : (
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
              <li
                key={production.id}
                className="rounded-lg border-2 flex sm:col-span-2 bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-600"
              >
                <div className="p-6 flex-grow">
                  <Link
                    href={`/companies/${production.company.slug}/production/${production.id}`}
                  >
                    <h3 className="text-lg font-bold underline mb-2 text-slate-900 dark:text-white">
                      {production.title}
                    </h3>
                  </Link>
                  <p className="text-sm mb-2 text-slate-600 dark:text-slate-300">
                    {timeMessage}
                  </p>

                  <ul className="flex flex-wrap gap-2 mb-3">
                    <li>
                      <Tag
                        text={production.company.name}
                        href={`/companies/${encodeURIComponent(
                          production.company.slug
                        )}`}
                        color={production.company.main_colour}
                        size="sm"
                      />
                    </li>
                  </ul>
                </div>

                <div className="h-full aspect-1 relative rounded-r-md overflow-hidden bg-slate-300 dark:bg-slate-600">
                  <Image
                    alt=""
                    src={`media/companies/${production.company.id}/images/${production.image_url}`}
                    className={"duration-200 ease-in-out rounded-r-md"}
                    fill
                    priority
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}

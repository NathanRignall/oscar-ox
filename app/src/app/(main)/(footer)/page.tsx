import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import clsx from "clsx";
import Vacancies from "./Vacancies";

// event component props
type CalenderEventProps = {
  title: string;
  time: string;
  location: string;
  variant: "red" | "orange" | "yellow" | "green" | "blue" | "pink" | "purple";
  href: string;
};

// event component
const CalenderEvent = ({
  title,
  time,
  location,
  variant,
  href,
}: CalenderEventProps) => {
  return (
    <Link href={href}>
      <div
        className={clsx(
          variant == "red" && "bg-red-100 border-red-900 dark:bg-red-900 dark:border-red-100 ",
          variant == "orange" && "bg-orange-100 border-orange-900 dark:bg-orange-900 dark:border-orange-100",
          variant == "yellow" && "bg-yellow-100 border-yellow-900 dark:bg-yellow-900 dark:border-yellow-100",
          variant == "green" && "bg-green-100 border-green-900 dark:bg-green-900 dark:border-green-100",
          variant == "blue" && "bg-blue-100 border-blue-900 dark:bg-blue-900 dark:border-blue-100",
          variant == "pink" && "bg-pink-100 border-pink-900 dark:bg-pink-900 dark:border-pink-100",
          variant == "purple" && "bg-purple-100 border-purple-900 dark:bg-purple-900 dark:border-purple-100",
          "rounded-lg border-l-[3px]  px-3 py-1 mb-3"
        )}
      >
        <p
          className={clsx(
            variant == "red" && "text-red-900 dark:text-red-100 ",
            variant == "orange" && "text-orange-900 dark:text-orange-100",
            variant == "yellow" && "text-yellow-900 dark:text-yellow-100",
            variant == "green" && "text-green-900 dark:text-green-100",
            variant == "blue" && "text-blue-900 dark:text-blue-100",
            variant == "pink" && "text-pink-900 dark:text-pink-100",
            variant == "purple" && "text-purple-900 dark:text-purple-100",
            "text-xs font-bold"
          )}
        >
          {time}
        </p>
        <p
          className={clsx(
            variant == "red" && "text-red-900 dark:text-red-100 ",
            variant == "orange" && "text-orange-900 dark:text-orange-100",
            variant == "yellow" && "text-yellow-900 dark:text-yellow-100",
            variant == "green" && "text-green-900 dark:text-green-100",
            variant == "blue" && "text-blue-900 dark:text-blue-100",
            variant == "pink" && "text-pink-900 dark:text-pink-100",
            variant == "purple" && "text-purple-900 dark:text-purple-100",
            " text-sm font-medium"
          )}
        >
          {title}
        </p>
        <p
          className={clsx(
            variant == "red" && "text-red-800 dark:text-red-200",
            variant == "orange" && "text-orange-800 dark:text-orange-200",
            variant == "yellow" && "text-yellow-800 dark:text-yellow-200",
            variant == "green" && "text-green-800 dark:text-green-200",
            variant == "blue" && "text-blue-800 dark:text-blue-200",
            variant == "pink" && "text-pink-800 dark:text-pink-200",
            variant == "purple" && "text-purple-800 dark:text-purple-200",
            "text-xs font-base"
          )}
        >
          {location}
        </p>
      </div>
    </Link>
  );
};

// Page
export default async function Home({
  searchParams,
}: {
  searchParams: { date: string };
}) {
  const supabase = createServerClient();

  // create a date using date (structure DD-MM-YYYY)
  const thisWeek = searchParams.date ? new Date(searchParams.date) : new Date();
  thisWeek.setHours(0, 0, 0, 0);
  const thisWeekString = thisWeek.toISOString();

  // get date 7 days from now at midnight
  const nextWeek = new Date(thisWeek);
  nextWeek.setDate(thisWeek.getDate() + 7);
  nextWeek.setHours(0, 0, 0, 0);
  const nextWeekString = nextWeek.toISOString();

  // get one day back
  const previousDay = new Date(thisWeek);
  previousDay.setDate(thisWeek.getDate() - 1);
  previousDay.setHours(0, 0, 0, 0);

  // get one day forward
  const nextDay = new Date(thisWeek);
  nextDay.setDate(thisWeek.getDate() + 2);
  nextDay.setHours(0, 0, 0, 0);

  // get the events
  const { data: _events } = await supabase
    .from("events")
    .select(
      `
      id,
      production: productions (
        id,
        title,
        company: companies (
          id,
          slug
        )
      ),
      venue: venues (
        id,
        title
      ),
      start_time,
      end_time
    `
    )
    .gte("start_time", thisWeekString)
    .lte("start_time", nextWeekString);

  const events = getArray(_events).map((event) => {
    const production = getSingle(event.production);
    return {
      id: event.id,
      production: {
        id: production.id,
        title: production.title,
        company: getSingle(production.company),
      },
      venue: getSingle(event.venue),
      start_time: event.start_time,
      end_time: event.end_time,
    };
  });

  // get a list of all the productions with no duplicates
  const productions = events
    .map((event) => event.production)
    .filter(
      (production, index, self) =>
        self.findIndex((p) => p.id === production.id) === index
    );

  // give a colour to each production
  const productionColours = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "pink",
    "purple",
  ];
  const productionColoursMap = new Map();
  productions.forEach((production, index) => {
    productionColoursMap.set(production.id, productionColours[index]);
  });

  // form a list of events separated by day
  const days = [];
  for (let i = 1; i <= 7; i++) {
    const day = new Date(thisWeek);
    day.setDate(thisWeek.getDate() + i);
    day.setHours(0, 0, 0, 0);

    const dayEvents = events.filter(
      (event) =>
        event.start_time.slice(0, 10) === day.toISOString().slice(0, 10)
    );
    days.push(dayEvents);
  }

  return (
    <div className="container mx-auto md:py-6 md:px-8 py-6 px-6">
      <header className="mb-8">
        <h1 className="mb-3 text-5xl font-extrabold text-slate-900 dark:text-white">
          Welcome to Oscar Ox
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          The website for amateur theatre in Oxford
        </p>
      </header>

      <main>
        <div className="sm:flex justify-between w-full mb-4">
          <nav className="flex px-5 py-3 border-2 rounded-lg text-gray-700 bg-white border-slate-200 dark:text-slate-200 dark:bg-slate-800 dark:border-slate-600">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li>
                <Link href={`/?date=${previousDay.toISOString().slice(0, 10)}`}>
                  <div className="flex items-center">
                    <span className="mr-1 text-sm font-medium md:ml-2 text-slate-500 dark:text-slate-400">
                      Back
                    </span>
                    <svg
                      className="w-6 h-6 text-slate-400 dark:text-slate-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  {thisWeek.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })}
                </div>
              </li>
              <li>
                <Link href={`/?date=${nextDay.toISOString().slice(0, 10)}`}>
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 text-slate-400 dark:text-slate-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="ml-1 text-sm font-medium md:ml-2 text-slate-500 dark:text-slate-400">
                      Next
                    </span>
                  </div>
                </Link>
              </li>
            </ol>
          </nav>
        </div>

        <div className=" rounded-lg border-2 w-full overflow-hidden bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-600">
          <div className="grid grid-cols-1 lg:grid-cols-7">
            {days.map((dayEvents, index) => {
              const day = new Date(thisWeek);
              day.setDate(thisWeek.getDate() + index);
              day.setHours(0, 0, 0, 0);

              return (
                <div key={index}>
                  <div className="border-b-2  px-4 py-4 bg-slate-50 border-slate-200 dark:bg-slate-700 dark:border-slate-600">
                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                      {day.toLocaleDateString("en-GB", {
                        weekday: "short",
                      })}
                    </p>
                    <p className="text-sm font-semibold uppercase text-slate-900 dark:text-white">
                      {day.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <div className="px-4 py-4">
                    {dayEvents.map((event) => {
                      const time = new Date(event.start_time);
                      return (
                        <CalenderEvent
                          key={event.id}
                          title={event.production.title}
                          time={time.toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          location={event.venue.title}
                          variant={productionColoursMap.get(
                            event.production.id
                          )}
                          href={`/companies/${event.production.company.slug}`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* @ts-expect-error Server Component */}
        <Vacancies />
      </main>
    </div>
  );
}

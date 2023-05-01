import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import clsx from "clsx";

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
          variant == "red" && "bg-red-100 border-red-900",
          variant == "orange" && "bg-orange-100 border-orange-900",
          variant == "yellow" && "bg-yellow-100 border-yellow-900",
          variant == "green" && "bg-green-100 border-green-900",
          variant == "blue" && "bg-blue-100 border-blue-900",
          variant == "pink" && "bg-pink-100 border-pink-900",
          variant == "purple" && "bg-purple-100 border-purple-900",
          "rounded-lg border-l-[3px]  px-3 py-1 mb-3"
        )}
      >
        <p
          className={clsx(
            variant == "red" && "text-red-900",
            variant == "orange" && "text-orange-900",
            variant == "yellow" && "text-yellow-900",
            variant == "green" && "text-green-900",
            variant == "blue" && "text-blue-900",
            variant == "pink" && "text-pink-900",
            variant == "purple" && "text-purple-900",
            "text-xs font-bold"
          )}
        >
          {time}
        </p>
        <p
          className={clsx(
            variant == "red" && "text-red-900",
            variant == "orange" && "text-orange-900",
            variant == "yellow" && "text-yellow-900",
            variant == "green" && "text-green-900",
            variant == "blue" && "text-blue-900",
            variant == "pink" && "text-pink-900",
            variant == "purple" && "text-purple-900",
            " text-sm font-medium"
          )}
        >
          {title}
        </p>
        <p
          className={clsx(
            variant == "red" && "text-red-800",
            variant == "orange" && "text-orange-800",
            variant == "yellow" && "text-yellow-800",
            variant == "green" && "text-green-800",
            variant == "blue" && "text-blue-800",
            variant == "pink" && "text-pink-800",
            variant == "purple" && "text-purple-800",
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
export default async function Home() {
  const supabase = createServerClient();

  // get todays date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = today.toISOString();

  // get date 7 days from now at midnight
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(0, 0, 0, 0);
  const nextWeekString = nextWeek.toISOString();

  // get the events
  const { data: _events } = await supabase
    .from("events")
    .select(
      `
      id,
      production: productions (
        id,
        title,
        company_id
      ),
      venue: venues (
        id,
        title
      ),
      start_time,
      end_time
    `
    )
    .gte("start_time", todayString)
    .lte("start_time", nextWeekString);

  const events = getArray(_events).map((event) => {
    return {
      id: event.id,
      production: getSingle(event.production),
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
    const day = new Date();
    day.setDate(today.getDate() + i);
    day.setHours(0, 0, 0, 0);

    const dayEvents = events.filter(
      (event) =>
        event.start_time.slice(0, 10) === day.toISOString().slice(0, 10)
    );
    days.push(dayEvents);
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="mb-3 text-5xl font-extrabold text-slate-900">
          Welcome to Oscar Ox
        </h1>
        <p className="text-xl text-slate-600">
          The website for amateur theatre in Oxford
        </p>
      </header>

      <main>
        <div className="sm:flex justify-between  w-full mb-4">
          <nav className="flex px-5 py-3 text-gray-700 border-2 border-slate-200 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li>
                <div className="flex items-center">
                  <span className="mr-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                    Back
                  </span>
                  <svg
                    className="w-6 h-6 text-gray-400"
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
              </li>
              <li>
                <div className="flex items-center">
                  <a
                    href="#"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                  >
                    10/5/2021
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
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
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                    Next
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <form>
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>

            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-slate-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                className="w-full rounded-lg border-2 border-slate-200 pl-10 pr-4 py-3 text-md text-slate-900 placeholder-slate-400"
                placeholder="Search Events"
                required
              />
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg border-2 border-slate-200 w-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-7">
            {days.map((dayEvents, index) => {
              const day = new Date();
              day.setDate(today.getDate() + index);
              day.setHours(0, 0, 0, 0);

              return (
                <div key={index}>
                  <div className="bg-slate-50 border-b-2 border-slate-200 px-4 py-4">
                    <p className="text-slate-500 text-xs font-semibold uppercase">
                      {day.toLocaleDateString("en-GB", {
                        weekday: "short",
                      })}
                    </p>
                    <p className="text-slate-900 text-sm font-semibold uppercase">
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
                          href={`/companies/${event.production.company_id}`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}

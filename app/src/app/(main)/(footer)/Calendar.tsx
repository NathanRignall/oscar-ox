"use client";

import { useSupabase } from "@/components/client";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getArray, getSingle } from "@/lib/supabase-type-convert";

type ColourVariant = "red" | "orange" | "yellow" | "green" | "blue" | "pink" | "purple";

// event component props
type EventProps = {
  title: string;
  time: string;
  location: string;
  variant: ColourVariant;
  href: string;
};

// event component
const Event = ({
  title,
  time,
  location,
  variant,
  href,
}: EventProps) => {
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

type Day = {
  id: string;
  production: {
    id: string;
    title: string;
    company: {
      id: string;
      slug: string;
    };
  };
  venue: {
    id: string;
    title: string;
  };
  start_time: string;
  end_time: string | null;
}[]


export const Calendar = () => {
  const { supabase } = useSupabase();

  const [thisWeek, setThisWeek] = useState<Date>((): Date => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [nextWeek, setNextWeek] = useState<Date>((): Date => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 7);
    return date;
  });


  const [days, setDays] = useState<Day[]>([]);
  const [coloursMap, setColoursMap] = useState<Map<string, ColourVariant>>(new Map<string, ColourVariant>());

  const moveDay = (days: number) => {
    setThisWeek((thisWeek) => {
      const date = new Date(thisWeek);
      date.setDate(date.getDate() + days);
      return date;
    });

    setNextWeek((nextWeek) => {
      const date = new Date(nextWeek);
      date.setDate(date.getDate() + days);
      return date;
    });
  }

  useEffect(() => {
    const fetchEvents = async () => {
      // get the events for the next 7 days
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
        .gte("start_time", thisWeek.toISOString())
        .lte("start_time", nextWeek.toISOString());

      // convert the events into a more usable format
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
      const productionColours: ColourVariant[] = [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "pink",
        "purple",
      ];
      const coloursMap = new Map();
      productions.forEach((production, index) => {
        coloursMap.set(production.id, productionColours[index]);
      });

      // form a list of events separated by day
      const days = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(thisWeek);
        day.setDate(thisWeek.getDate() + i);
        day.setHours(0, 0, 0, 0);

        const dayEvents = events.filter(
          (event) => new Date(event.start_time).getDate() === day.getDate()
        );

        days.push(dayEvents);
      }

      // set the state
      setDays(days);
      setColoursMap(coloursMap);
    }

    fetchEvents();
  }, [supabase, thisWeek, nextWeek]);


  return (
    <>
      <div className="flex sm:justify-between justify-center w-full mb-4">
        <nav className="flex px-5 py-3 text-gray-700 border-2 border-slate-200 rounded-lg bg-white">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <button className="flex items-center" onClick={
                () => moveDay(-1)
              }>
                <span className="mr-1 text-sm font-medium text-gray-500 md:ml-2">
                  Back
                </span>
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  transform="rotate(-180)"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </li>
            <li>
              <div className="min-w-[100px] text-center">
                {thisWeek.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </div>
            </li>
            <li>
              <button className="flex items-center" onClick={
                () => moveDay(1)
              }>
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
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  Next
                </span>
              </button>
            </li>
          </ol>
        </nav>
      </div >

      <div className="bg-white rounded-lg border-2 border-slate-200 w-full overflow-hidden min-h-[400px]">
        <div className="grid grid-cols-1 lg:grid-cols-7">
          {days.map((dayEvents, index) => {
            const day = new Date(thisWeek);
            day.setDate(day.getDate() + index + 1);
            day.setUTCHours(0, 0, 0, 0);

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
                      <Event
                        key={event.id}
                        title={event.production.title}
                        time={time.toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        location={event.venue.title}
                        variant={coloursMap.get(event.production.id) || "purple"}
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
    </>
  )
}
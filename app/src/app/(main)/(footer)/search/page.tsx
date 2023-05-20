"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSupabase } from "@/components/client";
import { Button, Tag } from "@/components/ui";
import { Database } from "@/lib/supabase-db-types";
import clsx from "clsx";

type CompaniesRecord = Database["public"]["Tables"]["companies"]["Row"];
type ProductionsRecord = Database["public"]["Tables"]["productions"]["Row"] & {
  events: Database["public"]["Tables"]["events"]["Row"][] &
    {
      venue: Database["public"]["Tables"]["venues"]["Row"];
    }[];
  company: Database["public"]["Tables"]["companies"]["Row"];
};
type ProfilesRecord = Database["public"]["Tables"]["profiles"]["Row"];
type VacanciesRecord = Database["public"]["Tables"]["vacancies"]["Row"] & {
  company: Database["public"]["Tables"]["companies"]["Row"];
  categories: Database["public"]["Tables"]["categories"]["Row"][];
};
type VenuesRecord = Database["public"]["Tables"]["venues"]["Row"];

type SearchRecord = {
  type: "company" | "production" | "profile" | "vacancy" | "venue";
  data:
    | CompaniesRecord
    | ProductionsRecord
    | ProfilesRecord
    | VacanciesRecord
    | VenuesRecord;
};

const Company = ({
  company,
  loading,
}: {
  company: CompaniesRecord;
  loading: boolean;
}) => (
  <li className=" bg-white rounded-lg border-2 border-slate-200 flex">
    <div className="p-6 flex-grow">
      {!loading ? (
        <Link href={`/companies/${company.slug}`}>
          <h2 className="text-lg font-bold text-slate-900 underline">
            {company.name}
          </h2>
        </Link>
      ) : (
        <div className="h-7 w-1/2 bg-slate-300 rounded-md mb-2 animate-pulse" />
      )}
    </div>
  </li>
);

const Production = ({
  production,
  loading,
}: {
  production: ProductionsRecord;
  loading: boolean;
}) => {
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
    <li className=" bg-white rounded-lg border-2 border-slate-200 flex sm:col-span-2">
      <div className="p-6 flex-grow">
        {!loading ? (
          <Link href={`/productions/${production.id}`}>
            <h2 className="text-lg font-bold text-slate-900 underline mb-2">
              {production.title}
            </h2>
          </Link>
        ) : (
          <div className="h-7 w-1/2 bg-slate-300 rounded-md mb-2 animate-pulse" />
        )}
        {!loading ? (
          <p className="text-sm text-slate-600 mb-2 ">{timeMessage}</p>
        ) : (
          <div className="h-5 w-3/4 bg-slate-200 rounded-md animate-pulse mb-2" />
        )}

        {!loading ? (
          <ul className="flex flex-wrap gap-2">
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
        ) : (
          <div className="h-[25px] w-1/4 bg-slate-200 rounded-md animate-pulse" />
        )}
      </div>

      <div
        className={clsx(
          "h-full aspect-1 relative bg-slate-300 rounded-r-md overflow-hidden",
          loading && "animate-pulse"
        )}
      >
        {!loading && (
          <Image
            alt=""
            src={`profiles/${production.id || "default.jpg"}`}
            className="duration-200 ease-in-out rounded-r-md"
            fill
            priority
          />
        )}
      </div>
    </li>
  );
};

const Profile = ({
  profile,
  loading,
}: {
  profile: ProfilesRecord;
  loading: boolean;
}) => (
  <li className="bg-white rounded-lg border-2 border-slate-200 flex">
    <div
      className={clsx(
        "h-full aspect-1 relative bg-slate-300 rounded-l-md overflow-hidden",
        loading && "animate-pulse"
      )}
    >
      {!loading && (
        <Image
          alt=""
          src={`profiles/${profile.avatar_url || "default.jpg"}`}
          className={"duration-200 ease-in-out rounded-l-md"}
          fill
          priority
        />
      )}
    </div>

    <div className="p-6 grow">
      {!loading ? (
        <Link href={`/profiles/${profile.id}`}>
          <h2 className="text-lg font-bold text-slate-900 underline">
            {profile.given_name} {profile.family_name}
          </h2>
        </Link>
      ) : (
        <div className="h-7 w-2/3 bg-slate-300 rounded-md animate-pulse" />
      )}

      {!loading ? (
        <p className="text-sm text-slate-600 truncate">{profile.biography}</p>
      ) : (
        <div className="h-4 w-3/4 bg-slate-200 rounded-md animate-pulse mt-1" />
      )}
    </div>
  </li>
);

const Vacancy = ({
  vacancy,
  loading,
}: {
  vacancy: VacanciesRecord;
  loading: boolean;
}) => {
  const responseMessageType =
    vacancy.response_type == "email"
      ? "by email"
      : vacancy.response_type == "phone"
      ? "by phone"
      : "on platform";
  let responseMessage = `Please respond to this vacancy ${responseMessageType}`;

  if (vacancy.response_deadline) {
    const responseDeadline = new Date(vacancy.response_deadline);
    const responseDeadlineString =
      responseDeadline.toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      " at " +
      responseDeadline.toLocaleTimeString("en-GB", {
        hour: "numeric",
        minute: "numeric",
      });

    responseMessage = responseMessage.concat(
      ` before ${responseDeadlineString}`
    );
  }

  return (
    <li className="bg-white rounded-lg border-2 border-slate-200 p-6 sm:col-span-2">
      {!loading ? (
        <Link
          href={`/companies/${vacancy.company.slug}#${vacancy.id}`}
          scroll={false}
        >
          <h3 className="text-lg font-bold text-slate-900 underline mb-2">
            {vacancy.title}
          </h3>
        </Link>
      ) : (
        <div className="h-7 w-1/2 bg-slate-300 rounded-md mb-2 animate-pulse" />
      )}

      {!loading ? (
        <p className="text-sm text-slate-600 mb-2 ">{responseMessage}</p>
      ) : (
        <div className="h-5 w-1/3 bg-slate-200 rounded-md animate-pulse mb-2" />
      )}

      {!loading ? (
        <ul className="flex flex-wrap gap-2 mb-2">
          {vacancy.categories.map((category) => (
            <li key={category.id}>
              <Tag
                text={category.title}
                href={`/search?category=${encodeURIComponent(category.id)}`}
                variant="secondary"
                size="sm"
              />
            </li>
          ))}

          <li>
            <Tag
              text={vacancy.company.name}
              href={`/companies/${encodeURIComponent(vacancy.company.slug)}`}
              color={vacancy.company.main_colour}
              size="sm"
            />
          </li>
        </ul>
      ) : (
        <div className="h-[25px] w-1/4 bg-slate-200 rounded-md animate-pulse mb-2" />
      )}

      {!loading ? (
        <p className="text-sm text-slate-600 line-clamp-2 sm:line-clamp-1">
          {vacancy.content}
        </p>
      ) : (
        <div className="h-5 w-3/4 bg-slate-200 rounded-md animate-pulse" />
      )}
    </li>
  );
};

const Venue = ({
  venue,
  loading,
}: {
  venue: VenuesRecord;
  loading: boolean;
}) => (
  <li className=" bg-white rounded-lg border-2 border-slate-200 flex">
    <div className="p-6 flex-grow">
      {!loading ? (
        <Link href={`/about/venues/${venue.slug}`}>
          <h2 className="text-lg font-bold text-slate-900 underline">
            {venue.title}
          </h2>
        </Link>
      ) : (
        <div className="h-7 w-2/3 bg-slate-300 rounded-md animate-pulse" />
      )}
      {!loading ? (
        <p className="text-sm text-slate-600 ">{venue.location}</p>
      ) : (
        <div className="h-4 w-3/4 bg-slate-200 rounded-md animate-pulse mt-1" />
      )}
    </div>

    <div
      className={clsx(
        "h-full aspect-1 relative bg-slate-300 rounded-r-md overflow-hidden",
        loading && "animate-pulse"
      )}
    >
      {!loading && (
        <Image
          alt=""
          src={`media/venues/${venue.image_url}`}
          className={"duration-200 ease-in-out rounded-r-md"}
          fill
          priority
        />
      )}
    </div>
  </li>
);

// Page
export default function Search() {
  const [types, setTypes] = useState<string[]>([]);
  const [searchResponse, setSearchResponse] = useState<SearchRecord[]>([]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const { supabase } = useSupabase();

  useEffect(() => {
    async function actionSearch() {
      if (search == "") {
        setSearchResponse([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data } = await supabase.functions.invoke("search", {
          body: JSON.stringify({
            search: search,
            types: types,
          }),
        });

        const response = data as SearchRecord[];

        if (response.length > 0) {
          setSearchResponse(response);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    const timeout = setTimeout(async () => {
      actionSearch();
    }, 100);

    return () => clearTimeout(timeout);
  }, [supabase, types, search]);

  const onClick = (id: string) => {
    if (types.includes(id)) {
      setTypes(types.filter((filter) => filter != id));
    } else {
      setTypes([...types, id]);
    }
  };

  return (
    <div className="container mx-auto md:py-6 md:px-8 py-6 px-6">
      <header className="text-center">
        <h1 className="mb-3 text-5xl font-extrabold text-slate-900">Search</h1>
        <p className="mb-3 text-xl text-slate-600 inline-block">
          Search for filter anything
        </p>

        <div className="flex flex-wrap justify-center space-x-3">
          <Button
            className="mb-2"
            id="companies"
            onClick={(event) => onClick(event.target.id)}
            active={types.includes("companies")}
          >
            Companies
          </Button>
          <Button
            className="mb-2"
            id="productions"
            onClick={(event) => onClick(event.target.id)}
            active={types.includes("productions")}
          >
            Productions
          </Button>
          <Button
            className="mb-2"
            id="profiles"
            onClick={(event) => onClick(event.target.id)}
            active={types.includes("profiles")}
          >
            Profiles
          </Button>
          <Button
            className="mb-2"
            id="vacancies"
            onClick={(event) => onClick(event.target.id)}
            active={types.includes("vacancies")}
          >
            Vacancies
          </Button>
          <Button
            className="mb-2"
            id="venues"
            onClick={(event) => onClick(event.target.id)}
            active={types.includes("venues")}
          >
            Venues
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto">
        <section className="mt-6">
          <form className="flex justify-center w-full">
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>

            <div className="relative w-full max-w-lg">
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
                placeholder="Search Companies"
                required
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>

          <ul className="mt-8 grid grid-flow-row-dense sm:grid-cols-2 gap-4">
            {searchResponse.map((record) => {
              switch (record.type) {
                case "company":
                  return (
                    <Company
                      key={record.data.id}
                      company={record.data as CompaniesRecord}
                      loading={loading}
                    />
                  );
                case "production":
                  return (
                    <Production
                      key={record.data.id}
                      production={record.data as ProductionsRecord}
                      loading={loading}
                    />
                  );
                case "profile":
                  return (
                    <Profile
                      key={record.data.id}
                      profile={record.data as ProfilesRecord}
                      loading={loading}
                    />
                  );
                case "venue":
                  return (
                    <Venue
                      key={record.data.id}
                      venue={record.data as VenuesRecord}
                      loading={loading}
                    />
                  );
                case "vacancy":
                  return (
                    <Vacancy
                      key={record.data.id}
                      vacancy={record.data as VacanciesRecord}
                      loading={loading}
                    />
                  );
                default:
                  return <li>Unknown</li>;
              }
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}

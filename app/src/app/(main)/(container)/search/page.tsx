"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSupabase } from "@/components/client";
import { Button, Tag } from "@/components/ui";
import { Database } from "@/lib/supabase-db-types";

type CompaniesRecord = Database["public"]["Tables"]["companies"]["Row"];
type ProductionsRecord = Database["public"]["Tables"]["productions"]["Row"];
type ProfilesRecord = Database["public"]["Tables"]["profiles"]["Row"];
type VacanciesRecord = Database["public"]["Tables"]["vacancies"]["Row"] & {
  company: Database["public"]["Tables"]["companies"]["Row"];
  categories: Database["public"]["Tables"]["categories"]["Row"][];
}
type VenuesRecord = Database["public"]["Tables"]["venues"]["Row"];

type SearchRecord = {
  type: "company" | "production" | "profile" | "vacancy" | "venue";
  data: CompaniesRecord | ProductionsRecord | ProfilesRecord | VacanciesRecord | VenuesRecord;
};

const Company = ({ company }: { company: CompaniesRecord }) => (
  <li className=" bg-white rounded-lg border-2 border-slate-200 flex">
    <div className="p-6 flex-grow">
      <Link href={`/companies/${company.slug}`}>
        <h2 className="text-lg font-bold text-slate-900 underline">{company.name}</h2>
      </Link>
    </div>
  </li>
);

const Production = ({ production }: { production: ProductionsRecord }) => (
  <li className=" bg-white rounded-lg border-2 border-slate-200 flex">
    <div className="p-6 flex-grow">
      <Link href={`/productions/${production.id}`}>
        <h2 className="text-lg font-bold text-slate-900 underline">{production.title}</h2>
      </Link>
    </div>
  </li>
);

const Profile = ({ profile }: { profile: ProfilesRecord }) => (
  <li className=" bg-white rounded-lg border-2 border-slate-200 flex">
    <div className="h-full aspect-1 relative bg-slate-300 rounded-l-md overflow-hidden">
      <Image
        alt=""
        src={`profiles/${profile.avatar_url}`}
        className={"duration-200 ease-in-out rounded-l-md"}
        fill
        priority
      />
    </div>

    <div className="p-6">
      <Link href={`/profiles/${profile.id}`}>
        <h2 className="text-lg font-bold text-slate-900 underline">
          {profile.given_name} {profile.family_name}
        </h2>
      </Link>

      <p className="text-sm text-slate-600 truncate">{profile.biography}</p>
    </div>
  </li>
);

const Vacancy = ({ vacancy }: { vacancy: VacanciesRecord }) => {
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
    <li className="bg-white rounded-lg border-2 border-slate-200 p-6 col-span-2">
      <Link href={`/companies/${vacancy.company.slug}#${vacancy.id}`} scroll={false}>
        <h3 className="text-lg font-bold text-slate-900 underline mb-2">
          {vacancy.title}
        </h3>
      </Link>

      <p className="text-sm text-slate-600 mb-2 ">{responseMessage}</p>

      <ul className="flex flex-wrap gap-2 mb-3">
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

      <p className="text-sm text-slate-600 mb-2 line-clamp-3">
        {vacancy.content}
      </p>
    </li>
  )
};

const Venue = ({ venue }: { venue: VenuesRecord }) => (
  <li className=" bg-white rounded-lg border-2 border-slate-200 flex">
    <div className="p-6 flex-grow">
      <Link href={`/about/venues/${venue.slug}`}>
        <h2 className="text-lg font-bold text-slate-900 underline">{venue.title}</h2>
      </Link>
      <p className="text-sm text-slate-600 ">{venue.location}</p>
    </div>

    <div className="h-full aspect-1 relative bg-slate-300 rounded-r-md overflow-hidden">
      <Image
        alt=""
        src={`media/venues/${venue.image_url}`}
        className={"duration-200 ease-in-out rounded-r-md"}
        fill
        priority
      />
    </div>
  </li>
);

// Page
export default function Search() {
  const [searchResponse, setSearchResponse] = useState<SearchRecord[]>([]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const { supabase } = useSupabase();

  // only run when search is not rapidly changing
  useEffect(() => {
    async function actionSearch() {
      try {
        

        const { data } = await supabase.functions.invoke("search", {
          body: JSON.stringify({
            search: search,
          }),
        });

        const response = data as SearchRecord[];
        console.log("request");

        if (response.length > 0) setSearchResponse(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      if (search != "") await actionSearch();
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [supabase, search]);

  return (
    <>
      <header className="text-center">
        <Tag text="** Interface Only **" variant="red" />
        <h1 className="mb-3 text-5xl font-extrabold text-slate-900">Search</h1>
        <p className="mb-3 text-xl text-slate-600 inline-block">
          Search for filter anything
        </p>

        <div className="flex flex-wrap justify-center space-x-3">
          <Button className="mb-2">Companies</Button>
          <Button className="mb-2">Productions</Button>
          <Button className="mb-2">Profiles</Button>
          <Button className="mb-2">Vacancies</Button>
          <Button className="mb-2">Venues</Button>
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

          <ul className="mt-8 grid sm:grid-cols-2 gap-4">
            {searchResponse.map((record) => {
              switch (record.type) {
                case "company":
                  return <Company key={record.data.id} company={record.data as CompaniesRecord} />;
                case "production":
                  return <Production key={record.data.id} production={record.data as ProductionsRecord} />;
                case "profile":
                  return <Profile key={record.data.id} profile={record.data as ProfilesRecord} />;
                case "venue":
                  return <Venue key={record.data.id} venue={record.data as VenuesRecord} />;
                case "vacancy":
                  return <Vacancy key={record.data.id} vacancy={record.data as VacanciesRecord} />;
                default:
                  return <li>Unknown</li>;
              }
            })}
          </ul>
        </section>
      </main>
    </>
  );
}

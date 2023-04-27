"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSupabase } from "@/components/client";
import { getArray } from "@/lib/supabase-type-convert";
import fontColorContrast from "font-color-contrast";

type Company = {
  id: string;
  name: string;
  main_colour: string;
};

export type CompaniesListProps = {
  _companies: Company[];
};

export const CompaniesList = ({ _companies }: CompaniesListProps) => {
  const [companies, setCompanies] = useState<Company[]>(_companies);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { supabase } = useSupabase();

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);

        const { data, error, status } = await supabase
          .from("companies")
          .select(
            `
          id,
          name,
          main_colour
          `
          )
          .textSearch("name", search);

        const formatedData = getArray(data);

        setCompanies(formatedData);

        if (error && status !== 406) {
          throw error;
        }
      } catch (error) {
        alert("Error loading data!");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    if (search != "") fetchCompanies();
    else setCompanies(_companies);
  }, [supabase, search, _companies]);

  return (
    <>
      <form className="flex justify-end w-full">
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>

        <div className="relative w-full max-w-sm">
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
            // update the state when a user types in the search bar
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>

      <main>
        <section className="grid grid-cols-3 gap-4 mt-4">
          {companies.map((company) => (
            <Link
              key={company.id}
              href={`/companies/${encodeURIComponent(company.id)}`}
            >
              <div
                className="p-4 aspect-[4/5] flex items-center justify-center shadow-lg"
                style={{
                  backgroundColor: company.main_colour,
                  color: fontColorContrast(company.main_colour),
                }}
              >
                <h2 className="text-4xl font-bold text-center">
                  {company.name}
                </h2>
              </div>
            </Link>
          ))}
        </section>

        {companies.length === 0 && !loading && (
          <p>No companies found. Try another search.</p>
        )}
      </main>
    </>
  );
};

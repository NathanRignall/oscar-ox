"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import Autocomplete from "./Auto"

// Page
export default function Companies() {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <>
      <header className="text-center">
        <h1 className="mb-3 text-5xl font-extrabold text-slate-900">Search</h1>
        <p className="mb-3 text-xl text-slate-600 inline-block">
          Search for filter anything
        </p>

        <div className="flex justify-center space-x-3 ">
          <Button>Companies</Button>
          <Button>Productions</Button>
          <Button>Profiles</Button>
          <Button>Vacancies</Button>
          <Button>Venues</Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto">
        {/* search */}
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
              />
            </div>
          </form>
        </section>
      </main>

      <Autocomplete options={['Chennai', 'Mumbai', 'Bangalore']} 
        value={selectedOption}
        onChange={setSelectedOption}
      />
    </>
  );
}

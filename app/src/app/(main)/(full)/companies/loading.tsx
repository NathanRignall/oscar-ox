// Loading
export default async function Loading() {
  return (
    <div className="container mx-auto py-6 px-8">
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
          />
        </div>
      </form>

      <main>
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 aspect-[4/5] flex items-center justify-center shadow-lg bg-slate-300 animate-pulse" />
          <div className="p-4 aspect-[4/5] flex items-center justify-center shadow-lg bg-slate-300 animate-pulse" />
        </section>
      </main>
    </div>
  );
}

// Loading
export default function Loading() {
  return (
    <>
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="mb-3 text-5xl font-extrabold text-slate-900 dark:text-white">
          Responses
        </h1>
        <p className="mb-3 text-xl text-slate-600 dark:text-slate-300">
          Your Responses to Vacancies
        </p>
      </header>

      <main className="max-w-3xl mx-auto">
        <ul className="mt-4 grid gap-4">
          <li className="rounded-lg h-[150px] animate-pulse bg-slate-200 dark:bg-slate-700"></li>
          <li className="rounded-lg h-[150px] animate-pulse bg-slate-200 dark:bg-slate-700"></li>
          <li className="rounded-lg h-[150px] animate-pulse bg-slate-200 dark:bg-slate-700"></li>
        </ul>
      </main>
    </>
  );
}

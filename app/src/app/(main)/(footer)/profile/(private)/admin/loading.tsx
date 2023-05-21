import { AddCompanyModal } from "./AddCompanyModal";

// Loading
export default function Loading() {
  return (
    <>
      <header className="max-w-3xl mx-auto mb-4">
        <h1 className="mb-3 text-5xl font-extrabold text-slate-900 dark:text-white">
          Admin
        </h1>

        <p className="mb-3 text-xl text-slate-600 dark:text-slate-300">
          Your Companies to Configure
        </p>
      </header>

      <main className="max-w-3xl mx-auto">
        <section>
          <AddCompanyModal />
          <ul className="mt-4 grid gap-4">
            <li className="rounded-lg h-[72px] animate-pulse bg-slate-200 dark:bg-slate-700"></li>
            <li className="rounded-lg h-[72px] animate-pulse bg-slate-200 dark:bg-slate-700"></li>
          </ul>
        </section>
      </main>
    </>
  );
}

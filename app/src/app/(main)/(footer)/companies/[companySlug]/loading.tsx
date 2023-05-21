// Loading
export default async function Loading() {
  return (
    <>
      <header className="animate-pulse bg-slate-200 dark:bg-slate-800">
        <div className="container mx-auto py-6 px-8">
          <div className="mb-4 rounded-lg h-12 animate-pulse max-w-[400px bg-slate-400 dark:bg-slate-600"></div>
          <div className="mb-4 rounded-lg h-7 animate-pulse max-w-[500px] bg-slate-300 dark:bg-slate-700"></div>
          <div className="rounded-lg h-[44px] animate-pulse max-w-[300px] bg-slate-300 dark:bg-slate-700"></div>
        </div>
      </header>

      <div className="container mx-auto py-6 px-8"></div>
    </>
  );
}

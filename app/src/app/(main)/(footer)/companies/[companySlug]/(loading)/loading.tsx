// Loading
export default async function Loading() {
  return (
    <>
      <div className="rounded-lg h-10 animate-pulse max-w-[350px] bg-slate-300 dark:bg-slate-600"></div>

      <main className="rounded-lg h-96 animate-pulse w-full mt-4 bg-slate-200 dark:bg-slate-700" />
    </>
  );
}

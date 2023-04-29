// Loading
export default async function Loading() {
  return (
    <>
      <header className="bg-slate-200 animate-pulse">
        <div className="container mx-auto py-6 px-8">
          <div className="mb-4 bg-slate-400 rounded-lg h-12 animate-pulse max-w-[400px]"></div>
          <div className="mb-4 bg-slate-300 rounded-lg h-7 animate-pulse max-w-[500px]"></div>
          <div className="bg-slate-300 rounded-lg h-[44px] animate-pulse max-w-[300px]"></div>
        </div>
      </header>

      <div className="container mx-auto py-6 px-8"></div>
    </>
  );
}

import { Button } from "@/components/ui";

// Loading
export default function Loading() {
  return (
    <>
      <header className="flex max-w-3xl mx-auto mb-8">
        <div className="flex-1">
          <div className="mb-3 bg-slate-300 rounded-lg h-[60px] animate-pulse max-w-[400px]"></div>
          <div className="mb-3 bg-slate-200 rounded-lg h-7 animate-pulse max-w-[350px]"></div>
          <div className="bg-slate-200 rounded-lg h-7 animate-pulse max-w-[150px]"></div>

          <div className="mt-4">
            <Button>Edit Profile</Button>
            <Button className="ml-2">View Public </Button>
          </div>
        </div>

        <div className="w-[150px]">
          <div className="bg-slate-200 rounded-lg animate-pulse w-full aspect-w-1 aspect-h-1"></div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto">
        <section>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900">Productions</h2>
            </div>
            <div>
              <p className="text-2xl font-normal text-slate-600">
                Involvements
              </p>
            </div>
          </div>

          <ul className="mt-4 grid sm:grid-cols-2 gap-4">
            <li className="bg-slate-200 rounded-lg h-32 animate-pulse"></li>
            <li className="bg-slate-200 rounded-lg h-32 animate-pulse"></li>
            <li className="bg-slate-200 rounded-lg h-32 animate-pulse"></li>
          </ul>
        </section>
      </main>
    </>
  );
}

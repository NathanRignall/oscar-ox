import { Calendar } from "./Calendar";
import Vacancies from "./Vacancies";

// Page
export default async function Home() {
  return (
    <div className="container mx-auto md:py-6 md:px-8 py-6 px-6">
      <header className="mb-8">
        <h1 className="mb-3 text-5xl font-extrabold text-slate-900">
          Welcome to Oscar Ox
        </h1>
        <p className="text-xl text-slate-600">
          The website for amateur theatre in Oxford
        </p>
      </header>

      <main>
        {/* render as client component to avoid date issues for now */}
        <Calendar/>
        
        {/* @ts-expect-error Server Component */}
        <Vacancies />
      </main>
    </div>
  );
}

import Link from "next/link";

// Page
export default async function About() {
  return (
    <>
      <header className="flex max-w-3xl mx-auto mb-8">
        <h1 className="text-5xl font-extrabold text-slate-900">About</h1>
      </header>

      <main className="max-w-3xl mx-auto">
        <section className="mt-8">
          <Link href={"/about/venues"}>
            <h2 className="text-4xl font-bold text-slate-900 underline">
              Venues
            </h2>
          </Link>
        </section>
        <section className="mt-8">
          <Link href={"/about/roles"}>
            <h2 className="text-4xl font-bold text-slate-900 underline">
              Roles
            </h2>
          </Link>
        </section>
        <section className="mt-8">
          <Link href={"/about/documentation"}>
            <h2 className="text-4xl font-bold text-slate-900 underline">
              Documentation
            </h2>
          </Link>
        </section>
        <section className="mt-8">
          <Link href={"/about/privacy"}>
            <h2 className="text-4xl font-bold text-slate-900 underline">
              Privacy
            </h2>
          </Link>
        </section>
        <section className="mt-8">
          <Link href={"/about/contact"}>
            <h2 className="text-4xl font-bold text-slate-900 underline">
              Contact
            </h2>
          </Link>
        </section>
      </main>
    </>
  );
}

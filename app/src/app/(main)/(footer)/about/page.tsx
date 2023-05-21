import Link from "next/link";

// Page
export default async function About() {
  return (
    <>
      <header className="flex max-w-3xl mx-auto mb-8">
        <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white">About</h1>
      </header>

      <main className="max-w-3xl mx-auto">
        <section className="mt-8">
          <Link href={"/about/venues"}>
            <h2 className="text-4xl font-bold underline text-slate-900 dark:text-white">
              Venues
            </h2>
          </Link>
        </section>
        <section className="mt-8">
          <Link href={"/about/roles"}>
            <h2 className="text-4xl font-bold underline text-slate-900 dark:text-white">
              Roles
            </h2>
          </Link>
        </section>
        <section className="mt-8">
          <Link href={"/about/documentation"}>
            <h2 className="text-4xl font-bold underline text-slate-900 dark:text-white">
              Documentation
            </h2>
          </Link>
        </section>
        <section className="mt-8">
          <Link href={"/about/privacy"}>
            <h2 className="text-4xl font-bold underline text-slate-900 dark:text-white">
              Privacy
            </h2>
          </Link>
        </section>
        <section className="mt-8">
          <Link href={"/about/contact"}>
            <h2 className="text-4xl font-bold underline text-slate-900 dark:text-white">
              Contact
            </h2>
          </Link>
        </section>
      </main>
    </>
  );
}

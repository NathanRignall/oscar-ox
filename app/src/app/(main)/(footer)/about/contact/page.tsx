import { PrivacyPolicy } from "@/containers";

// Page
export default async function Roles() {
  return (
    <>
      <header className="flex max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Contact
        </h1>
      </header>

      <main className="max-w-3xl mx-auto">
        <article className="mt-8">
          <h2 className="font-bold text-3xl mt-3 mb-1 text-slate-900 dark:text-white">
            Comming Soon...
          </h2>

          <p className="text-slate-600 dark:text-slate-300">
            This page is under construction. Please check back later. For any urgent
            matters, please contact us at{" "}
            <a
              href="mailto:dev@ox.nlr.app"
              className="underline text-slate-900 dark:text-white"
            >
              dev@ox.nlr.app
            </a>
          </p>
        </article>
      </main>
    </>
  );
}

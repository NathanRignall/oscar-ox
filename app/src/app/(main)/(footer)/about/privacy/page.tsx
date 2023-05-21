import { PrivacyPolicy } from "@/containers";

// Page
export default async function Roles() {
  return (
    <>
      <header className="flex max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Privacy</h1>
      </header>

      <main className="max-w-3xl mx-auto">
        <article className="mt-8">
          <h2 className="font-bold text-3xl mt-3 mb-1 text-slate-900 dark:text-white">Privacy Policy</h2>

          <PrivacyPolicy />
        </article>
      </main>
    </>
  );
}

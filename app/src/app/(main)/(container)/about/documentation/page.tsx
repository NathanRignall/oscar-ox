import { AdminCollapse } from "./AdminCollapse";

// Page
export default async function Roles() {
  return (
    <>
      <header className="flex max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Documentation</h1>
      </header>

      <main className="max-w-3xl mx-auto">
        <article className="mt-8">
          <h2 className="font-bold text-3xl mt-3 mb-2">Admin Panel</h2>
          <AdminCollapse />
        </article>
      </main>
    </>
  );
}

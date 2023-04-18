import { Button, ButtonLink } from "@/components/ui";

// Page
export default function Admin() {
  const companies = [
    {
      id: "1",
      name: "00 Productions",
    },
    {
      id: "2",
      name: "NHGS",
    },
  ];

  return (
    <div className="container mx-auto py-6 px-8">
      <header className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="mb-3 text-6xl font-extrabold text-slate-900">Manage</h1>

        <p className="mb-3 text-xl text-slate-600">
          Your Companies to Configure
        </p>
      </header>

      <section className="max-w-3xl mx-auto mt-4">
        <ul className="mt-4 grid gap-4">
          {companies.map((company) => (
            <li
              key={company.id}
              className="flex justify-between items-center bg-white rounded-lg border-2 border-slate-200 p-4"
            >
              <h2 className="text-lg font-bold text-slate-900">
                {company.name}
              </h2>
              <ButtonLink href={`/admin/${encodeURIComponent(company.id)}`}>
                Edit
              </ButtonLink>
            </li>
          ))}
        </ul>
      </section>
      
      <div className="fixed bottom-0 right-0 m-8">
        <Button>Create</Button>
      </div>
    </div>
  );
}

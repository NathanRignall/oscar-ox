import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import { AddEventModal } from "./AddEventModal";
import { Button, Tag } from "@/components/ui";
import { EditProductionModal } from "./EditProductionModal";

// do not cache this page
export const revalidate = 0;

// Page
export default async function Production({
  params,
}: {
  params: { companyId: string; productionId: string };
}) {
  const supabase = createServerClient();

  const { data: _production } = await supabase
    .from("productions")
    .select(
      `
      id,
      title,
      description,
      is_published,
      events(
        id,
        venue:venues (
            id,
            title
        ),
        start_time,
        end_time
      ),
      vacancies(
        id,
        title,
        is_open,
        is_published,
        inserted_at
      )
      `
    )
    .match({ id: params.productionId })
    .single();

  if (!_production) notFound();

  const production = {
    id: _production.id,
    title: _production.title,
    description: _production.description,
    is_published: _production.is_published,
    events: getArray(_production.events).map((event) => ({
      id: event.id,
      venue: getSingle(event.venue),
      start_time: event.start_time,
      end_time: event.end_time,
    })),
    vacancies: getArray(_production.vacancies).map((vacancy) => ({
      id: vacancy.id,
      title: vacancy.title,
      is_open: vacancy.is_open,
      is_published: vacancy.is_published,
      inserted_at: vacancy.inserted_at,
    })),
  };

  return (
    <>
      <header>
        <h1 className="flex items-center text-4xl font-bold text-slate-900 mb-3">
          <Link href={`/admin/${params.companyId}/productions`}>
            <svg
              className="h-5 w-5 mr-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={4}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </Link>
          {production.title}
        </h1>

        <p className="mb-3 text-xl text-slate-600 ">{production.description} <EditProductionModal/></p>
      </header>

      <section className="mt-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Events</h2>

        <AddEventModal productionId={params.productionId} />

        <div className="mt-4 border-2 border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left divide-y-2 divide-gray-200">
            <thead className="text-xs font-semibold text-gray-500 bg-slate-50 uppercase">
              <tr>
                <th scope="col" className="px-4 py-4">
                  Start
                </th>
                <th scope="col" className="px-4 py-4">
                  Venue
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-solid divide-slate-200">
              {production.events.map((event) => (
                <tr key={event.id} className="bg-white hover:bg-gray-50">
                  <th
                    scope="row"
                    className="px-4 py-4 font-medium text-gray-900"
                  >
                    {event.start_time}
                  </th>
                  <td className="px-4 py-4 text-gray-500">
                    {event.venue.title}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <Button size="sm">Edit</Button>{" "}
                    <Button size="sm">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Linked Vacancies
        </h2>

        <AddEventModal productionId={params.productionId} />

        <div className="mt-4 border-2 border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left divide-y-2 divide-gray-200">
            <thead className="text-xs font-semibold text-gray-500 bg-slate-50 uppercase">
              <tr>
                <th scope="col" className="px-4 py-4">
                  Title
                </th>
                <th scope="col" className="px-4 py-4">
                  Issue Date
                </th>
                <th scope="col" className="px-4 py-4">
                  Responses
                </th>
                <th scope="col" className="px-4 py-4">
                  Tags
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-solid divide-slate-200">
              {production.vacancies.map((vacancy) => (
                <tr key={vacancy.id} className="bg-white hover:bg-gray-50">
                  <th
                    scope="row"
                    className="px-4 py-4 font-bold text-gray-900 underline"
                  >
                    <Link href={`/admin/${params.companyId}/vacancies/${vacancy.id}`}>{vacancy.title}</Link>
                  </th>

                  <td className="px-4 py-4 text-gray-500">
                    {vacancy.inserted_at}
                  </td>

                  <td className="px-4 py-4 text-gray-500">10</td>

                  <td className="px-4 py-4 text-gray-500">
                    <Tag text="Crew" />
                  </td>

                  <td className="px-4 text-right">
                    {vacancy.is_published ? (
                      <Tag text="Published" color="green" />
                    ) : (
                      <Tag text="Draft" color="blue" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

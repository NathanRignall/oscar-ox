import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";

import { Tag } from "@/components/ui";
import { EditProductionModal } from "./EditProductionModal";
import { AddEventModal } from "./AddEventModal";
import { EditEventModal } from "./EditEventModal";
import { RemoveEventModal } from "./RemoveEventModal";
import { NewVacancyButton } from "../../vacancies/NewVacancyButton";
import { AddParticipantModal } from "./AddParticipantModal";
import { EditParticipantModal } from "./EditParticipantModal";
import { RemoveParticipantModal } from "./RemoveParticipantModal";

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
        end_time,
        ticket_link
      ),
      vacancies(
        id,
        title,
        is_open,
        is_published,
        inserted_at,
        responses(
          id
        ),
        categories(
          id,
          title
        )
      ),
      participants(
        id,
        profile:profiles (
          id,
          given_name,
          family_name,
          email
        ),
        title,
        category:categories (
          id,
          title
        )
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
      ticket_link: event.ticket_link,
    })),
    vacancies: getArray(_production.vacancies).map((vacancy) => ({
      id: vacancy.id,
      title: vacancy.title,
      is_open: vacancy.is_open,
      is_published: vacancy.is_published,
      inserted_at: vacancy.inserted_at,
      responses: getArray(vacancy.responses).length,
      categories: getArray(vacancy.categories),
    })),
    participants: getArray(_production.participants).map((participant) => ({
      id: participant.id,
      profile: getSingle(participant.profile),
      title: participant.title,
      category: getSingle(participant.category),
    })),
  };

  return (
    <>
      <header>
        <div className="flex items-center">
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

          {production.is_published ? (
            <Tag text="Published" variant="green" className="ml-2" size="sm" />
          ) : (
            <Tag text="Draft" variant="blue" className="ml-2" size="sm" />
          )}
        </div>

        <div className="sm:flex">
          <div className="flex-1">
            <p className="mb-3 text-xl text-slate-600 inline-block">
              {production.description}{" "}
            </p>
            <EditProductionModal
              productionId={params.productionId}
              title={production.title}
              description={production.description}
              is_published={production.is_published}
            />
          </div>

          <div className="h-full aspect-1 relative bg-slate-300 rounded-md overflow-hidden min-w-[200px]">
            <Image
              alt=""
              src={`media/companies/${params.companyId}/productions/${params.productionId}/main.jpeg`}
              className={"duration-200 ease-in-out rounded-lg"}
              fill
              priority
            />
          </div>
        </div>
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
              {production.events.map((event) => {
                const time =
                  new Date(event.start_time).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }) +
                  " - " +
                  new Date(event.start_time).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                return (
                  <tr key={event.id} className="bg-white hover:bg-gray-50">
                    <th
                      scope="row"
                      className="px-4 py-4 font-medium text-gray-900"
                    >
                      {time}
                    </th>
                    <td className="px-4 py-4 text-gray-500">
                      {event.venue.title}
                    </td>

                    <td className="px-4 text-right">
                      <EditEventModal event={event} />
                      {" "}
                      <RemoveEventModal
                        eventId={event.id}
                        time={time}
                        venue={event.venue.title}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Linked Vacancies
        </h2>

        <NewVacancyButton
          companyId={params.companyId}
          productionId={params.productionId}
        />

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
                    className="px-4 py-4 font-bold text-gray-900 whitespace-nowrap underline"
                  >
                    <Link
                      href={`/admin/${params.companyId}/vacancies/${vacancy.id}`}
                    >
                      {vacancy.title}
                    </Link>
                  </th>

                  <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(vacancy.inserted_at).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  <td className="px-4 py-4 text-gray-500">
                    {vacancy.responses}
                  </td>

                  <td className="px-4 py-4 text-gray-500 whitespace-nowrap space-x-1">
                    {vacancy.categories.map((category) => (
                      <Tag
                        key={category.id}
                        text={category.title}
                        variant="secondary"
                        size="sm"
                      />
                    ))}
                  </td>

                  <td className="px-4 text-right">
                    {vacancy.is_published ? (
                      <Tag text="Published" variant="green" />
                    ) : (
                      <Tag text="Draft" variant="blue" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Participants</h2>

        <AddParticipantModal productionId={params.productionId} />

        <div className="mt-4 border-2 border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left divide-y-2 divide-gray-200">
            <thead className="text-xs font-semibold text-gray-500 bg-slate-50 uppercase">
              <tr>
                <th scope="col" className="px-4 py-4">
                  Name
                </th>
                <th scope="col" className="px-4 py-4">
                  Email
                </th>
                <th scope="col" className="px-4 py-4">
                  Title
                </th>
                <th scope="col" className="px-4 py-4">
                  Tags
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-solid divide-slate-200">
              {production.participants.map((participant) => (
                <tr key={participant.id} className="bg-white hover:bg-gray-50">
                  <th
                    scope="row"
                    className="px-4 py-4 font-bold text-gray-900 whitespace-nowrap"
                  >
                    {`${participant.profile.given_name} ${participant.profile.family_name}`}
                  </th>

                  <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                    {participant.profile.email}
                  </td>

                  <td className="px-4 py-4 text-gray-500">
                    {participant.title}
                  </td>

                  <td className="px-4 py-4 text-gray-500 whitespace-nowrap space-x-1">
                    {participant.category && (
                      <Tag
                        key={participant.category.id}
                        text={participant.category.title}
                        variant="secondary"
                        size="sm"
                      />
                    )}
                  </td>

                  <td className="px-4 text-right">
                    <EditParticipantModal participant={participant} />
                    {" "}
                    <RemoveParticipantModal
                      participantId={participant.id}
                      name={`${participant.profile.given_name} ${participant.profile.family_name}`}
                      email={participant.profile.email}
                      title={participant.title}
                    />
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

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";

export default async function Production({
  params,
}: {
  params: { productionId: string };
}) {
  const supabase = createServerClient();

  const { data: _production } = await supabase
    .from("productions")
    .select(
      `
        id,
        title,
        description,
        image_url,
        is_published,
        company_id,
        events(
          id,
          venue:venues (
              id,
              slug,
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
          is_published
        ),
        participants(
          id,
          profile:profiles (
            id,
            given_name,
            family_name
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
    image_url: _production.image_url,
    is_published: _production.is_published,
    company_id: _production.company_id,
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
    })),
    participants: getArray(_production.participants).map((participant) => ({
      id: participant.id,
      profile: getSingle(participant.profile),
      title: participant.title,
      category: getSingle(participant.category),
    })),
  };

  type Participant = {
    id: string;
    profile: {
      id: string;
      given_name: string;
      family_name: string;
    };
    title: string;
  };

  type Category = {
    id: string;
    title: string;
    participants: Participant[];
  };

  const categories: Category[] = [];

  production.participants.forEach((participant) => {
    const category = categories.find(
      (category) => category.id === participant.category.id
    );

    if (category) {
      category.participants.push(participant);
    } else {
      categories.push({
        id: participant.category.id,
        title: participant.category.title,
        participants: [participant],
      });
    }
  });

  return (
    <article>
      <div className="sm:flex mb-8">
        <div className="flex-1">
          <h2 className="mb-1 text-4xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {production.title}
          </h2>

          {production.events.length > 0 && (
            <ul className="flex flex-col">
              {production.events.map((event) => {
                const time =
                  new Date(event.start_time).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }) +
                  " - " +
                  new Date(event.start_time).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });

                return (
                  <li key={event.id} className="block">
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                      {time} -{" "}
                      <Link
                        className="underline"
                        href={`/about/venues/${event.venue.slug}`}
                      >
                        {event.venue.title}
                      </Link>
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="sm:w-[200px] w-[200px]">
          <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-slate-300 dark:bg-slate-700">
            <Image
              alt={production.title}
              src={`media/companies/${production.company_id}/images/${production.image_url}`}
              className={"duration-200 ease-in-out rounded-lg"}
              width={200}
              height={200}
              priority
            />
          </div>
        </div>
      </div>

      <p className="mb-8 text-lg mt-2 text-slate-900 dark:text-white">
        {production.description}
      </p>

      {categories.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-3 text-3xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Participants
          </h3>

          <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {categories.map((category) => (
              <li
                key={category.id}
                className="rounded-lg border-2 p-6 bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-600"
              >
                <h4 className="mb-1 text-2xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {category.title}
                </h4>

                <ul className="flex flex-col">
                  {category.participants.map((participant) => (
                    <li key={participant.id} className="block">
                      <p className="text-md text-slate-600 dark:text-slate-300">
                        {participant.title} -{" "}
                        <Link
                          href={`/profile/${participant.profile.id}`}
                          className="underline"
                        >
                          {participant.profile.given_name}{" "}
                          {participant.profile.family_name}
                        </Link>
                      </p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

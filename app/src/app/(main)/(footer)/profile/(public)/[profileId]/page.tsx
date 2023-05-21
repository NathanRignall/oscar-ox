import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import { Tag } from "@/components/ui";
import { ProfilePicture } from "@/containers";

// page
export default async function Account({
  params,
}: {
  params: { profileId: string };
}) {
  const supabase = createServerClient();

  const { data: _profile } = await supabase
    .from("profiles")
    .select(
      `
          id,
          email,
          given_name,
          family_name,
          biography,
          avatar_url,
          tags:company_members (
            company:companies (
              id,
              slug,
              name,
              main_colour
              )
          )
      `
    )
    .match({ id: params.profileId })
    .single();

  if (!_profile) notFound();

  const profile = {
    id: _profile.id,
    given_name: _profile.given_name,
    family_name: _profile.family_name,
    email: _profile.email,
    biography: _profile.biography,
    avatar_url: _profile.avatar_url || "default.jpg",
    tags: getArray(_profile.tags).map((tag) => getSingle(tag.company)),
  };

  const { data: _participants } = await supabase
    .from("participants")
    .select(
      `
      id,
      title,
      production:productions (
        id,
        title,
        events:events (
          id,
          start_time,
          venue:venues(
            id, 
            title
          )
        )
      )
    `
    )
    .match({ profile_id: params.profileId });

  const participants = getArray(_participants).map((participant: any) => ({
    id: participant.id,
    title: participant.title,
    production: {
      id: getSingle(participant.production).id,
      title: getSingle(participant.production).title,
      event: {
        id: getSingle(getSingle(participant.production).events).id,
        start_time: getSingle(getSingle(participant.production).events)
          .start_time,
        venue: getSingle(
          getSingle(getSingle(participant.production).events).venue
        ).title,
      },
    },
  }));

  return (
    <>
      <div className="container mx-auto md:py-6 md:px-8 py-6 px-6">
        <header className="sm:flex max-w-3xl mx-auto mb-8">
          <div className="flex-1"> 
            <h1 className="mb-1 text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white">
              {`${profile.given_name} ${profile.family_name}`}
            </h1>
            <p className="mb-3 text-xl mt-2 text-slate-600 dark:text-slate-300">
              {profile.biography}
            </p>

            {profile.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2 mb-3">
                {profile.tags.map((tag) => (
                  <li key={tag.id}>
                    <Tag
                      text={tag.name}
                      href={`/companies/${encodeURIComponent(tag.slug)}`}
                      color={tag.main_colour}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="sm:w-[150px] w-[200px]">
            <ProfilePicture src={`profiles/${profile.avatar_url}`} />
          </div>
        </header>

        <main className="max-w-3xl mx-auto">
          {participants && (
            <section>
              <div className="sm:flex justify-between items-center">
                <div>
                  <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                    Productions
                  </h2>
                </div>
                <div>
                  <p className="text-2xl font-normal text-slate-600 dark:text-slate-300">
                    {participants.length} Involvements
                  </p>
                </div>
              </div>

              <ul className="mt-4 grid sm:grid-cols-2 gap-4">
                {participants.map((participant) => (
                  <li
                    key={participant.id}
                    className="rounded-lg border-2 p-6 bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-600"
                  >
                    <p className="text-xl font-bold uppercase text-slate-900 dark:text-white">
                      {new Date(
                        participant.production.event.start_time
                      ).toLocaleString("default", { month: "long" })}{" "}
                      {new Date(
                        participant.production.event.start_time
                      ).toLocaleString("default", { year: "numeric" })}
                    </p>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {participant.production.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {participant.title} - {participant.production.event.venue}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    </>
  );
}

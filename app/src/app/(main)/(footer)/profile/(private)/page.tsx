import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import { ButtonLink, Tag } from "@/components/ui";
import { ProfilePicture } from "@/containers";
import { EditProfileModal } from "./EditProfileModal";

// do not cache this page
export const revalidate = 0;

// page
export default async function Account() {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    .match({ id: user?.id })
    .single();

  // if no profile, redirect to login
  if (!_profile) redirect("/auth/login");

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
        company:companies (
          id,
          slug
        ),
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
    .match({ profile_id: user?.id });

  const participants = getArray(_participants).map((participant: any) => ({
    id: participant.id,
    title: participant.title,
    production: {
      id: getSingle(participant.production).id,
      title: getSingle(participant.production).title,
      company: getSingle(getSingle(participant.production).company),
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
      <header className="sm:flex max-w-3xl mx-auto mb-8">
        <div className="flex-1">
          <h1 className="mb-1 text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white">
            {`${profile.given_name} ${profile.family_name}`}
          </h1>
          <div className="mb-3">
            <p className="text-xl inline-block text-slate-600 dark:text-slate-300">
              {profile.biography ? profile.biography : "No biography yet."}
            </p>
            <EditProfileModal
              name={`${profile.given_name} ${profile.family_name}`}
              biography={profile.biography}
            />
          </div>

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

          <div>
            <ButtonLink href={`/profile/${encodeURIComponent(profile.id)}`}>
              View Public
            </ButtonLink>
          </div>
        </div>

        <div className="sm:w-[150px] w-[200px] sm:p-0 pt-3 pb-3">
          <ProfilePicture src={`profiles/${profile.avatar_url}`} edit={true} />
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
                <p className="text-2xl font-normal text-slate-600 dark:text-white">
                  {participants.length} Involvements
                </p>
              </div>
            </div>

            <ul className="mt-4 grid sm:grid-cols-2 gap-4">
              {participants.map((participant) => (
                <li
                  key={participant.id}
                  className=" rounded-lg border-2 p-6 bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-600"
                >
                  <Link href={`/companies/${participant.production.company.slug}/production/${participant.production.id}`}>
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
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}

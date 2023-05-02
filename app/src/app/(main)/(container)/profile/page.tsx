import { redirect } from 'next/navigation';
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
          name,
          email,
          biography,
          avatar_url,
          tags:company_members (
            company:companies (
              id,
              name,
              main_colour
              )
          )
      `
    )
    .match({ id: user?.id })
    .single();

  // if no profile, redirect to login
  if (!_profile) redirect('/auth/login');

  const profile = {
    id: _profile.id,
    name: _profile.name,
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
    .match({ profile_id: user?.id });

  const participants = getArray(_participants).map((participant: any) => ({
    id: participant.id,
    production: {
      id: getSingle(participant.production).id,
      title: getSingle(participant.production).title,
      event: getSingle(getSingle(participant.production).events).map(
        (event: any) => ({
          id: event.id,
          start_time: event.start_time,
          venue: getSingle(event.venue),
        })
      ),
    },
  }));

  return (
    <>
      <header className="sm:flex max-w-3xl mx-auto mb-8">
        <div className="flex-1">
          <h1 className="mb-1 text-5xl sm:text-6xl font-extrabold text-slate-900">
            {profile.name}
          </h1>
          <div className="mb-3">
            <p className="text-xl text-slate-600 inline-block">
              {profile.biography ? profile.biography : "No biography yet."}
            </p>
            <EditProfileModal
              name={profile.name}
              biography={profile.biography}
            />
          </div>

          {profile.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 mb-3">
              {profile.tags.map((tag) => (
                <li key={tag.id}>
                  <Tag
                    text={tag.name}
                    href={`/companies/${encodeURIComponent(tag.id)}`}
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
            <ButtonLink href={`/admin`} className="ml-2">
              Admin Panel
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
                <h2 className="text-4xl font-bold text-slate-900">
                  Productions
                </h2>
              </div>
              <div>
                <p className="text-2xl font-normal text-slate-600">
                  {participants.length} Involvements
                </p>
              </div>
            </div>

            <ul className="mt-4 grid sm:grid-cols-2 gap-4">
              {participants.map((participant) => (
                <li
                  key={participant.id}
                  className=" bg-white rounded-lg border-2 border-slate-200 p-6"
                >
                  <p className="text-xl font-bold text-slate-900 uppercase">
                    {participant.production.event.start_time
                      .split("T")[0]
                      .split("-")
                      .slice(1)
                      .join(" ")}
                  </p>
                  <h3 className="text-lg font-bold text-slate-900">
                    {participant.production.title}
                  </h3>
                  <p className="text-sm text-slate-600 ">
                    ROLE - {participant.production.event.venue}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}

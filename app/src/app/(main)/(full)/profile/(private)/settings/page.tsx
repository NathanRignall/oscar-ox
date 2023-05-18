import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import { UpdatePasswordModal } from "./UpdatePasswordModal";

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
    email: _profile.email,
    given_name: _profile.given_name,
    family_name: _profile.family_name,
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
    .match({ profile_id: user?.id });

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

  const { data, error } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  return (
    <>
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="mb-3 text-5xl font-extrabold text-slate-900">
          Settings
        </h1>
        <p className="mb-3 text-xl text-slate-600">Profile Managament</p>
      </header>

      <main className="max-w-3xl mx-auto">
        <section>
          <h2 className="text-4xl font-bold text-slate-900">Security</h2>
        </section>
        <UpdatePasswordModal />
        <br />
        Change Email
        <br />
        Delete Account
        <br />
        Manage Subsciptions
        {JSON.stringify(data)}
      </main>
    </>
  );
}

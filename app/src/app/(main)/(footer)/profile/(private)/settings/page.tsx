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

  return (
    <>
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="mb-3 text-5xl font-extrabold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="mb-3 text-xl text-slate-600 dark:text-slate-300">
          Profile Managament
        </p>
      </header>

      <main className="max-w-3xl mx-auto">
        <section>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Security
          </h2>
          <UpdatePasswordModal />
        </section>
      </main>
    </>
  );
}

import "server-only";

import { Navbar } from "@/containers";
import { createServerClient } from "@/lib/supabase-server";
import { getArray } from "@/lib/supabase-type-convert";
import OnboardModal, { Category } from "./OnboardModal";

// do not cache this layout
export const revalidate = 0;

// layout
export default async function BareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // get categories for onboarding
  let categories: Category[] = [];
  if (user && !user.user_metadata.finished_onboarding) {
    const { data: _categories } = await supabase
      .from("categories")
      .select(`id, title`);
    categories = getArray(_categories);
  }

  return (
    <>
      <Navbar loggedIn={user != null} />
      <div className="grow">{children}</div>

      {user && !user.user_metadata.finished_onboarding && <OnboardModal categories={categories} />}
    </>
  );
}

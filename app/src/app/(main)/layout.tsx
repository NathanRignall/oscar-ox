import "server-only";

import { createServerClient } from "@/lib/supabase-server";
import { getArray } from "@/lib/supabase-type-convert";
import { Navbar } from "@/components/client";
import OnboardModal, { Category } from "./OnboardModal";
import PrivacyModal from "./PrivacyModal";
import { Footer } from "@/components/server";

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
      {children}

      {user && !user.user_metadata.finished_onboarding && (
        <OnboardModal
          categories={categories}
          privacy={
            user.user_metadata.privacy_version < 0.1 ||
            !user.user_metadata.privacy_version
          }
        />
      )}

      {user &&
        user.user_metadata.finished_onboarding &&
        (user.user_metadata.privacy_version < 0.1 ||
          !user.user_metadata.privacy_version) && <PrivacyModal />}
    </>
  );
}

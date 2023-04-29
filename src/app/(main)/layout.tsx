import "server-only";

import { Navbar } from "@/containers";
import { createServerClient } from "@/lib/supabase-server";
import OnboardModal from "./OnboardModal";

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

  return (
    <>
      <Navbar loggedIn={user != null} />
      <div className="grow">{children}</div>

      {user && !user.user_metadata.finished_onboarding && <OnboardModal />}
    </>
  );
}

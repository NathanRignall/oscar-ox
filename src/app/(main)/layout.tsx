import "server-only";

import { Navbar } from "@/containers";
import { createServerClient } from "@/lib/supabase-server";

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
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <>
      <Navbar loggedIn={session != null} />
      <div className="mt-20">{children}</div>
    </>
  );
}

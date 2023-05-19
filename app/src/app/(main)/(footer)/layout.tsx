import "server-only";

import { Footer } from "@/components/server";

// layout
export default async function BareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="grow">{children}</div>
      <Footer />
    </>
  );
}

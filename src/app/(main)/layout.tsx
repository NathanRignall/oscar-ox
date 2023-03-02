import { Navbar } from "@/containers";

export default function BareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar loggedIn={false} />
      <main>{children}</main>
    </>
  );
}

import "server-only";

// layout
export default async function BareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="grow">{children}</div>
    </>
  );
}

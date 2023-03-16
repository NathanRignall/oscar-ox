// layout
export default function BareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container mx-auto py-6 px-8">{children}</div>;
}

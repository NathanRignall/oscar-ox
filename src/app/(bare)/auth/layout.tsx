export default function BareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-screen flex flex-1 flex-col overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex h-full flex-1 flex-col overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

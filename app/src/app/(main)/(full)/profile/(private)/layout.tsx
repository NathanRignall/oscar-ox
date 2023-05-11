import { ProfileNavigation } from "@/containers";

// layout
export default function BareLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="container mx-auto md:py-6 md:px-8 py-6 px-6">
        <ProfileNavigation />
        {children}
      </div>
    );
  }
  
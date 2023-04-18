import Link from "next/link";

const Links = [
  { href: "/", text: "Dashboard", active: true },
  { href: "/productions", text: "Productions", active: false },
  { href: "/vacancies", text: "Vacancies", active: false },
  { href: "/pages", text: "Pages", active: false },
  { href: "/settings", text: "Settings", active: false },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="flex-none w-64 h-full">
        <div className="flex flex-col overflow-y-auto bg-white border-r-2 border-slate-200 h-full">
          <h2 className="text-lg px-7 py-6 border-b-2 border-slate-200">
            Production Name
          </h2>

          <ul className="flex-1 px-3 py-4 border-b-2 border-slate-200 space-y-2">
            {Links.map((link) => (
              <li key={link.href}>
                <Link
                  className={`px-4 py-3 block rounded-lg text-lg ${
                    link.active ? "bg-slate-100" : ""
                  }`}
                  href={link.href}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="px-3 py-4 border-b-2 border-slate-200 space-y-2">
            <li>
              <Link className="px-4 py-1 block rounded-lg text-lg" href="/some">
                Documentation
              </Link>
            </li>
            <li>
              <Link className="px-4 py-1 block rounded-lg text-lg" href="/some">
                Help
              </Link>
            </li>
          </ul>

        </div>
      </aside>

      <main className="flex-1 py-6 px-8">{children}</main>
    </div>
  );
}

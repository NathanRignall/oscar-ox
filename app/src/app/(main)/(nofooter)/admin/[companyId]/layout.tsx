import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { getSingle } from "@/lib/supabase-type-convert";

// do not cache this page
export const revalidate = 0;

const Links = [
  { href: "/", text: "Dashboard", active: false },
  { href: "/productions", text: "Productions", active: false },
  { href: "/vacancies", text: "Vacancies", active: false },
  { href: "/pages", text: "Pages", active: false },
  { href: "/settings", text: "Settings", active: false },
];

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { companyId: string };
}) {
  const supabase = createServerClient();

  // get user and redirect if not logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: _company_members } = await supabase
    .from("company_members")
    .select(
      `
      company:companies (
        id,
        name
      ),
      role
      `
    ).match({ profile_id: user.id }).single();

  if (!_company_members) redirect("/auth/login");

  const company = getSingle(_company_members.company);
  
  if (!company) notFound();

  return (
    <div className="flex h-full">
      <aside className="flex-none w-64 h-full">
        <div className="flex flex-col overflow-y-auto bg-white border-r-2 border-slate-200 h-full">
          <h2 className="flex items-center text-lg px-7 py-6 border-b-2 border-slate-200">
            <Link href={`/profile/admin`}>
              <svg
                className="h-3 w-3 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth={4}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </Link>
            {company.name}
          </h2>

          <ul className="flex-1 px-3 py-4 border-b-2 border-slate-200 space-y-2">
            {Links.map((link) => (
              <li key={link.href}>
                <Link
                  className={`px-4 py-3 block rounded-lg text-lg ${
                    link.active ? "bg-slate-100" : ""
                  }`}
                  href={`/admin/${encodeURIComponent(company.id)}/${link.href}`}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="px-3 py-4 border-b-2 border-slate-200 space-y-2">
            <li>
              <Link
                className="px-4 py-1 block rounded-lg text-lg"
                href="/about/documentation"
              >
                Documentation
              </Link>
            </li>
            <li>
              <Link
                className="px-4 py-1 block rounded-lg text-lg"
                href="/about/contact"
              >
                Help
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <main className="flex-1 py-6 px-8 overflow-x-auto">{children}</main>
    </div>
  );
}

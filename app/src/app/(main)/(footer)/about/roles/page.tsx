import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@/lib/supabase-server";
import { getArray } from "@/lib/supabase-type-convert";

// Page
export default async function Roles() {
  const supabase = createServerClient();

  const { data: _roles } = await supabase.from("roles").select(
    `
        id,
        slug,
        title,
        description,
        image_url
        `
  );

  const roles = getArray(_roles);

  return (
    <>
      <header className="flex max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Roles
        </h1>
      </header>

      <main className="max-w-3xl mx-auto">
        <ul className="mt-8 grid sm:grid-cols-2 gap-4">
          {roles.map((role) => (
            <li
              key={role.id}
              className="rounded-lg border-2 flex bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-600"
            >
              <div className="p-6 flex-grow">
                <Link href={`/about/roles/${role.slug}`}>
                  <h2 className="text-lg font-bold underline text-slate-900 dark:text-white">
                    {role.title}
                  </h2>
                </Link>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {role.description}
                </p>
              </div>

              <div className="h-full aspect-1 relative rounded-r-md overflow-hidden bg-slate-300 dark:bg-slate-600">
                <Image
                  alt=""
                  src={`media/roles/${role.image_url || "default.jpg"}`}
                  className={"duration-200 ease-in-out rounded-r-md"}
                  fill
                />
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

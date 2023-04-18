import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { Tag, BlurImage } from "@/components/ui";

// page
export default async function Account({
  params: { id },
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select()
    .match({ id: id })
    .single();

  if (!profile) {
    notFound();
  }

  // list of tags
  const tags = [
    {
      text: "00Productions",
      href: "/productions",
      color: "#00AEA9",
    },
    {
      text: "NHGS",
      href: "/nhgs",
      color: "#BE1723",
    },
  ];

  // list of productions
  const productions = [
    {
      date: "January 2021",
      title: "The Tempest",
      role: "Lighting Designer",
      location: "Theatre Royal",
    },
    {
      date: "February 2021",
      title: "The Tempest",
      role: "Lighting Designer",
      location: "Theatre Royal",
    },
    {
      date: "March 2021",
      title: "The Tempest",
      role: "Lighting Designer",
      location: "Theatre Royal",
    },
  ];

  return (
    <>
      <header className="flex max-w-3xl mx-auto mb-8">
        <div className="flex-1">
          <h1 className="mb-3 text-6xl font-extrabold text-slate-900">
            {profile.name}
          </h1>
          <p className="mb-3 text-xl text-slate-600 ">{profile.biography}</p>

          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag.text}>
                <Tag {...tag} />
              </li>
            ))}
          </ul>
        </div>

        <div className="w-[150px]">
          <BlurImage image={{ imageSrc: `avatars/${profile.avatar_url}` }} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto">
        <section>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900">Productions</h2>
            </div>
            <div>
              <p className="text-2xl font-normal text-slate-600">
                {productions.length} Involvements
              </p>
            </div>
          </div>

          <ul className="mt-4 grid sm:grid-cols-2 gap-4">
            {productions.map((production) => (
              <li
                key={production.title}
                className=" bg-white rounded-lg border-2 border-slate-200 p-6"
              >
                <p className="text-xl font-bold text-slate-900 uppercase">
                  {production.date}
                </p>

                <h3 className="text-lg font-bold text-slate-900">
                  {production.title}
                </h3>

                <p className="text-sm text-slate-600 ">
                  {production.role} - {production.location}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
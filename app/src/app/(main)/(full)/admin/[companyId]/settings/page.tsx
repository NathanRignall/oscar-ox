import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import { Tag } from "@/components/ui";
import { AddMemberModal } from "./AddMemberModal";
import { DeleteMemberModal } from "./DeleteMemberModal";

// do not cache this page
export const revalidate = 0;

// Page
export default async function Settings({
  params,
}: {
  params: { companyId: string };
}) {
  const supabase = createServerClient();

  const { data: _members } = await supabase
    .from("company_members")
    .select(
      `
      role,
      user:profiles (
        id,
        name,
        email,
        inserted_at
      )
      `
    )
    .match({ company_id: params.companyId });

  const members = getArray(_members).map((member) => ({
    role: member.role,
    user: getSingle(member.user),
  }));

  return (
    <>
      <h1 className="text-4xl font-bold text-slate-900">Settings</h1>

      <section className="mt-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Members</h2>

        <AddMemberModal companyId={params.companyId} />
        
        <div className="mt-4 border-2 border-slate-200 rounded-lg">
          <table className="w-full text-left divide-y-2 divide-gray-200">
            <thead className="text-xs font-semibold text-slate-500 bg-slate-50 uppercase">
              <tr>
                <th scope="col" className="px-4 py-4">
                  Name
                </th>
                <th scope="col" className="px-4 py-4">
                  Email
                </th>
                <th scope="col" className="px-4 py-4">
                  Date Added
                </th>
                <th scope="col" className="px-4 py-4">
                  Role
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-solid divide-slate-200">
              {members.map((member) => (
                <tr key={member.user.id} className="bg-white hover:bg-slate-50">
                  <th scope="row" className="px-4 py-4 whitespace-nowrap">
                    {member.user.name}
                  </th>

                  <td className="px-4 py-4 whitespace-nowrap">
                    {member.user.email}
                  </td>

                  <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(member.user.inserted_at).toLocaleDateString(
                      "en-GB",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <Tag
                      variant={member.role === "admin" ? "red" : "green"}
                      text={member.role}
                    />
                  </td>

                  <td className="px-4 text-right whitespace-nowrap">
                    <DeleteMemberModal
                      companyId={params.companyId}
                      profileId={member.user.id}
                      name={member.user.name}
                      email={member.user.email}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import { Button, Tag } from "@/components/ui";
import { RespondVacancyModal } from "./RespondVacancyModal";

export default async function Vacancies({ companyId }: { companyId: string }) {
  const supabase = createServerClient();

  const { data: _vacancies } = await supabase
    .from("vacancies")
    .select(
      `
      id,
      company: companies (
        id,
        slug,
        name,
        main_colour
      ),
      title,
      content,
      response_type,
      response_deadline,
      is_open,
      is_published,
      inserted_at,
      responses(
        id
      ),
      categories(
        id,
        title
      )
      `
    )
    .eq("is_open", true)
    .eq("is_published", true)
    .eq("company_id", companyId)
    .order("inserted_at", { ascending: false });

  const vacancies = getArray(_vacancies).map((vacancy) => {
    return {
      id: vacancy.id,
      company: getSingle(vacancy.company),
      title: vacancy.title,
      content: vacancy.content,
      response_type: vacancy.response_type,
      response_deadline: vacancy.response_deadline,
      is_open: vacancy.is_open,
      is_published: vacancy.is_published,
      inserted_at: vacancy.inserted_at,
      responses: getArray(vacancy.responses).length,
      categories: getArray(vacancy.categories),
    };
  });

  return (
    <section className="mt-8">
      <div className="sm:flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">Open Vacancies</h2>
        </div>
        <div>
          <p className="text-2xl font-normal text-slate-600">
            {vacancies.length} Open
          </p>
        </div>
      </div>
      <ul className="mt-4 grid gap-4">
        {vacancies.map((vacancy) => {
          const responseMessageType =
            vacancy.response_type == "email"
              ? "by email"
              : vacancy.response_type == "phone"
              ? "by phone"
              : "on platform";
          let responseMessage = `Please respond to this vacancy ${responseMessageType}`;

          if (vacancy.response_deadline) {
            const responseDeadline = new Date(vacancy.response_deadline);
            const responseDeadlineString =
              responseDeadline.toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }) +
              " at " +
              responseDeadline.toLocaleTimeString("en-GB", {
                hour: "numeric",
                minute: "numeric",
              });

            responseMessage = responseMessage.concat(
              ` before ${responseDeadlineString}`
            );
          }

          return (
            <li
              key={vacancy.id}
              className=" bg-white rounded-lg border-2 border-slate-200 p-6"
              id={vacancy.id}
            >
              <Link href={`/companies/${vacancy.company.slug}`}>
                <h3 className="text-lg font-bold text-slate-900 underline mb-2">
                  {vacancy.title}
                </h3>
              </Link>

              <p className="text-sm text-slate-600 mb-2 ">{responseMessage}</p>

              <ul className="flex flex-wrap gap-2 mb-3">
                {vacancy.categories.map((category) => (
                  <li key={category.id}>
                    <Tag
                      text={category.title}
                      href={`/search?category=${encodeURIComponent(
                        category.id
                      )}`}
                      variant="secondary"
                      size="sm"
                    />
                  </li>
                ))}

                <li>
                  <Tag
                    text={vacancy.company.name}
                    href={`/companies/${encodeURIComponent(
                      vacancy.company.slug
                    )}`}
                    color={vacancy.company.main_colour}
                    size="sm"
                  />
                </li>
              </ul>

              <p className="text-sm text-slate-600 mb-4">{vacancy.content}</p>

              <div className="flex mb-2 space-x-2">
                {vacancy.response_type == "platform" && (
                  <RespondVacancyModal vacancyId={vacancy.id} />
                )}

                <Button>View Production</Button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

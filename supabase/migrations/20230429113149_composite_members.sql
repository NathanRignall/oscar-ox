alter table "public"."company_members" drop constraint "company_members_pkey";

alter table "public"."vacancy_categories" drop constraint "vacancy_categories_pkey";

drop index if exists "public"."company_members_pkey";

drop index if exists "public"."vacancy_categories_pkey";

alter table "public"."company_members" drop column "id";

alter table "public"."vacancy_categories" drop column "id";

CREATE UNIQUE INDEX company_members_pkey ON public.company_members USING btree (company_id, profile_id);

CREATE UNIQUE INDEX vacancy_categories_pkey ON public.vacancy_categories USING btree (vacancy_id, category_id);

alter table "public"."company_members" add constraint "company_members_pkey" PRIMARY KEY using index "company_members_pkey";

alter table "public"."vacancy_categories" add constraint "vacancy_categories_pkey" PRIMARY KEY using index "vacancy_categories_pkey";



drop function if exists "public"."create_company"(name text, description text);

alter table "public"."companies" alter column "slug" set not null;

CREATE UNIQUE INDEX companies_slug_key ON public.companies USING btree (slug);

alter table "public"."companies" add constraint "companies_slug_key" UNIQUE using index "companies_slug_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_company(slug text, name text, description text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  new_company_id uuid;
begin
  insert into companies (slug, name, description)
  values (create_company.slug, create_company.name, create_company.description)
  returning id into new_company_id;

  insert into company_members (company_id, profile_id, role)
  values (new_company_id, auth.uid(), 'admin');

  return new_company_id;
end;
$function$
;



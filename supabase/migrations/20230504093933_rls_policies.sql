alter table "public"."categories" enable row level security;

alter table "public"."companies" add column "is_public" boolean not null default true;

alter table "public"."companies" enable row level security;

alter table "public"."company_members" enable row level security;

alter table "public"."events" enable row level security;

alter table "public"."pages" alter column "is_published" set default false;

alter table "public"."pages" enable row level security;

alter table "public"."participants" add column "is_published" boolean default false;

alter table "public"."participants" enable row level security;

alter table "public"."productions" enable row level security;

alter table "public"."profiles" add column "is_public" boolean not null default true;

alter table "public"."profiles" enable row level security;

alter table "public"."responses" enable row level security;

alter table "public"."roles" enable row level security;

alter table "public"."subscriptions" enable row level security;

alter table "public"."vacancies" enable row level security;

alter table "public"."vacancy_categories" enable row level security;

alter table "public"."venues" enable row level security;

CREATE OR REPLACE FUNCTION public.authorize_company_member(company_id uuid, profile_id uuid, role company_role)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
  declare
    bind_permissions int;
  begin
    select
      count(*)
    from public.company_members
    where
      company_members.company_id = authorize_company_member.company_id and
      company_members.profile_id = authorize_company_member.profile_id and
      company_members.role = authorize_company_member.role
    into bind_permissions;

    return bind_permissions > 0;
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.authorize_company_production_member(production_id uuid, profile_id uuid, role company_role)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
  declare
    bind_permissions int;
  begin
    select
      count(*)
    from public.company_members
    join public.productions on productions.company_id = company_members.company_id
    where
      productions.id = authorize_company_production_member.production_id and
      company_members.profile_id = authorize_company_production_member.profile_id and
      company_members.role = authorize_company_production_member.role
    into bind_permissions;

    return bind_permissions > 0;
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.authorize_company_public(company_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
  declare
    bind_permissions int;
  begin
    select
      count(*)
    from public.companies
    where
      companies.id = authorize_company_public.company_id and
      companies.is_public = true
    into bind_permissions;

    return bind_permissions > 0;
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.authorize_company_vacancy_member(vacancy_id uuid, profile_id uuid, role company_role)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
  declare
    bind_permissions int;
  begin
    select
      count(*)
    from public.company_members
    join public.vacancies on vacancies.company_id = company_members.company_id
    where
      vacancies.id = authorize_company_vacancy_member.vacancy_id and
      company_members.profile_id = authorize_company_vacancy_member.profile_id and
      company_members.role = authorize_company_vacancy_member.role
    into bind_permissions;

    return bind_permissions > 0;
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.authorize_production_public(production_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
  declare
    bind_permissions int;
  begin
    select
      count(*)
    from public.productions
    join public.companies on companies.id = productions.company_id
    where
      productions.id = authorize_production_public.production_id and
      productions.is_published = true and
      companies.is_public = true
    into bind_permissions;

    return bind_permissions > 0;
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.authorize_vacancy_public(vacancy_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
  declare
    bind_permissions int;
  begin
    select
      count(*)
    from public.vacancies
    join public.companies on companies.id = vacancies.company_id
    where
      vacancies.id = authorize_vacancy_public.vacancy_id and
      vacancies.is_published = true and
      companies.is_public = true
    into bind_permissions;

    return bind_permissions > 0;
  end;
$function$
;

create policy "Categories are viewable by everyone."
on "public"."categories"
as permissive
for select
to public
using (true);


create policy "Company admins can update their own company."
on "public"."companies"
as permissive
for update
to public
using (authorize_company_member(id, auth.uid(), 'admin'::company_role));


create policy "Company admins can view their own company."
on "public"."companies"
as permissive
for select
to public
using (authorize_company_member(id, auth.uid(), 'admin'::company_role));


create policy "Company moderators can view their own company."
on "public"."companies"
as permissive
for select
to public
using (authorize_company_member(id, auth.uid(), 'moderator'::company_role));


create policy "Public companies are viewable by everyone."
on "public"."companies"
as permissive
for select
to public
using (is_public);


create policy "Company admins can delete their own company members."
on "public"."company_members"
as permissive
for delete
to public
using (authorize_company_member(company_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can insert their own company members."
on "public"."company_members"
as permissive
for insert
to public
with check (authorize_company_member(company_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can update their own company members."
on "public"."company_members"
as permissive
for update
to public
using (authorize_company_member(company_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can view their own company members."
on "public"."company_members"
as permissive
for select
to public
using (authorize_company_member(company_id, auth.uid(), 'admin'::company_role));


create policy "Company moderators can view their own company members."
on "public"."company_members"
as permissive
for select
to public
using (authorize_company_member(company_id, auth.uid(), 'moderator'::company_role));


create policy "Public company members are viewable by everyone."
on "public"."company_members"
as permissive
for select
to public
using (authorize_company_public(company_id));


create policy "Company admins can delete their own events."
on "public"."events"
as permissive
for delete
to public
using (authorize_company_production_member(production_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can insert their own events."
on "public"."events"
as permissive
for insert
to public
with check (authorize_company_production_member(production_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can update their own events."
on "public"."events"
as permissive
for update
to public
using (authorize_company_production_member(production_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can view their own events."
on "public"."events"
as permissive
for select
to public
using (authorize_company_production_member(production_id, auth.uid(), 'admin'::company_role));


create policy "Company moderators can view their own events."
on "public"."events"
as permissive
for select
to public
using (authorize_company_production_member(production_id, auth.uid(), 'moderator'::company_role));


create policy "Public events are viewable by everyone."
on "public"."events"
as permissive
for select
to public
using ((is_published AND authorize_production_public(production_id)));


create policy "Company admins can delete their own pages."
on "public"."pages"
as permissive
for delete
to public
using (authorize_company_member(company_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can insert their own pages."
on "public"."pages"
as permissive
for insert
to public
with check (authorize_company_member(company_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can update their own pages."
on "public"."pages"
as permissive
for update
to public
using (authorize_company_member(company_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can view their own pages."
on "public"."pages"
as permissive
for select
to public
using (authorize_company_member(company_id, auth.uid(), 'admin'::company_role));


create policy "Company moderators can view their own pages."
on "public"."pages"
as permissive
for select
to public
using (authorize_company_member(company_id, auth.uid(), 'moderator'::company_role));


create policy "Public pages are viewable by everyone."
on "public"."pages"
as permissive
for select
to public
using ((is_published AND authorize_company_public(company_id)));


create policy "Company admins can delete their own participants."
on "public"."participants"
as permissive
for delete
to public
using (authorize_company_production_member(production_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can insert their own participants."
on "public"."participants"
as permissive
for insert
to public
with check (authorize_company_production_member(production_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can update their own participants."
on "public"."participants"
as permissive
for update
to public
using (authorize_company_production_member(production_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can view their own participants."
on "public"."participants"
as permissive
for select
to public
using (authorize_company_production_member(production_id, auth.uid(), 'admin'::company_role));


create policy "Company moderators can view their own participants."
on "public"."participants"
as permissive
for select
to public
using (authorize_company_production_member(production_id, auth.uid(), 'moderator'::company_role));


create policy "Public participants are viewable by everyone."
on "public"."participants"
as permissive
for select
to public
using ((is_published AND authorize_production_public(production_id)));


create policy "Company admins can delete their own productions."
on "public"."productions"
as permissive
for delete
to public
using (authorize_company_member(company_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can insert their own productions."
on "public"."productions"
as permissive
for insert
to public
with check (authorize_company_member(company_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can update their own productions."
on "public"."productions"
as permissive
for update
to public
using (authorize_company_member(company_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can view their own productions."
on "public"."productions"
as permissive
for select
to public
using (authorize_company_member(company_id, auth.uid(), 'admin'::company_role));


create policy "Company moderators can view their own productions."
on "public"."productions"
as permissive
for select
to public
using (authorize_company_member(company_id, auth.uid(), 'moderator'::company_role));


create policy "Public productions are viewable by everyone."
on "public"."productions"
as permissive
for select
to public
using (is_published);


create policy "Public profiles are viewable by everyone."
on "public"."profiles"
as permissive
for select
to public
using (is_public);


create policy "Users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update own profile."
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can view their own profile."
on "public"."profiles"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "Company admins can view their own responses."
on "public"."responses"
as permissive
for select
to public
using (authorize_company_vacancy_member(vacancy_id, auth.uid(), 'admin'::company_role));


create policy "Company moderators can view their own responses."
on "public"."responses"
as permissive
for select
to public
using (authorize_company_vacancy_member(vacancy_id, auth.uid(), 'moderator'::company_role));


create policy "Users can insert their own responses."
on "public"."responses"
as permissive
for insert
to public
with check (((profile_id = auth.uid()) AND authorize_vacancy_public(vacancy_id)));


create policy "Users can view their own responses."
on "public"."responses"
as permissive
for select
to public
using ((profile_id = auth.uid()));


create policy "Roles that are published are viewable by everyone."
on "public"."roles"
as permissive
for select
to public
using (is_published);


create policy "Users can delete their own subscriptions."
on "public"."subscriptions"
as permissive
for delete
to public
using ((auth.uid() = profile_id));


create policy "Users can insert their own subscriptions."
on "public"."subscriptions"
as permissive
for insert
to public
with check ((auth.uid() = profile_id));


create policy "Users can update their own subscriptions."
on "public"."subscriptions"
as permissive
for update
to public
using ((auth.uid() = profile_id));


create policy "Users can view their own subscriptions."
on "public"."subscriptions"
as permissive
for select
to public
using ((auth.uid() = profile_id));


create policy "Company admins can delete their own vacancies."
on "public"."vacancies"
as permissive
for delete
to public
using (authorize_company_member(company_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can insert their own vacancies."
on "public"."vacancies"
as permissive
for insert
to public
with check (authorize_company_member(company_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can update their own vacancies."
on "public"."vacancies"
as permissive
for update
to public
using (authorize_company_member(company_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can view their own vacancies."
on "public"."vacancies"
as permissive
for select
to public
using (authorize_company_member(company_id, auth.uid(), 'admin'::company_role));


create policy "Company moderators can view their own vacancies."
on "public"."vacancies"
as permissive
for select
to public
using (authorize_company_member(company_id, auth.uid(), 'moderator'::company_role));


create policy "Public vacancies are viewable by everyone."
on "public"."vacancies"
as permissive
for select
to public
using ((is_published AND authorize_company_public(company_id)));


create policy "Company admins can delete their own vacancy categories."
on "public"."vacancy_categories"
as permissive
for delete
to public
using (authorize_company_vacancy_member(vacancy_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can insert their own vacancy categories."
on "public"."vacancy_categories"
as permissive
for insert
to public
with check (authorize_company_vacancy_member(vacancy_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can update their own vacancy categories."
on "public"."vacancy_categories"
as permissive
for update
to public
using (authorize_company_vacancy_member(vacancy_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can view their own vacancy categories."
on "public"."vacancy_categories"
as permissive
for select
to public
using (authorize_company_vacancy_member(vacancy_id, auth.uid(), 'admin'::company_role));


create policy "Company moderators can view their own vacancy categories."
on "public"."vacancy_categories"
as permissive
for select
to public
using (authorize_company_vacancy_member(vacancy_id, auth.uid(), 'moderator'::company_role));


create policy "Public vacancy categories are viewable by everyone."
on "public"."vacancy_categories"
as permissive
for select
to public
using (authorize_vacancy_public(vacancy_id));


create policy "Venues that are published are iewable by everyone."
on "public"."venues"
as permissive
for select
to public
using (is_published);




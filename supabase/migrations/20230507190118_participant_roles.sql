alter table "public"."participants" drop constraint "participants_role_id_fkey";

create table "public"."participant_roles" (
    "participant_id" uuid not null,
    "role_id" uuid not null
);


alter table "public"."participant_roles" enable row level security;

alter table "public"."participants" drop column "role_id";

CREATE UNIQUE INDEX participant_roles_pkey ON public.participant_roles USING btree (participant_id, role_id);

alter table "public"."participant_roles" add constraint "participant_roles_pkey" PRIMARY KEY using index "participant_roles_pkey";

alter table "public"."participant_roles" add constraint "participant_roles_participant_id_fkey" FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE not valid;

alter table "public"."participant_roles" validate constraint "participant_roles_participant_id_fkey";

alter table "public"."participant_roles" add constraint "participant_roles_role_id_fkey" FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE not valid;

alter table "public"."participant_roles" validate constraint "participant_roles_role_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.authorize_company_participant_member(participant_id uuid, profile_id uuid, role company_role)
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
    join public.participants on participants.production_id = productions.id
    where
      participants.id = authorize_company_participant_member.participant_id and
      company_members.profile_id = authorize_company_participant_member.profile_id and
      company_members.role = authorize_company_participant_member.role
    into bind_permissions;

    return bind_permissions > 0;
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.authorize_participant_public(participant_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
  declare
    bind_permissions int;
  begin
    select
      count(*)
    from public.participants
    join public.productions on productions.id = participants.production_id
    join public.companies on companies.id = productions.company_id
    where
      participants.id = authorize_participant_public.participant_id and
      participants.is_published = true and
      productions.is_published = true and
      companies.is_public = true
    into bind_permissions;

    return bind_permissions > 0;
  end;
$function$
;

create policy "Company admins can delete their own participant roles."
on "public"."participant_roles"
as permissive
for delete
to public
using (authorize_company_participant_member(participant_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can insert their own participant roles."
on "public"."participant_roles"
as permissive
for insert
to public
with check (authorize_company_participant_member(participant_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can update their own participant roles."
on "public"."participant_roles"
as permissive
for update
to public
using (authorize_company_participant_member(participant_id, auth.uid(), 'admin'::company_role));


create policy "Company admins can view their own participant roles."
on "public"."participant_roles"
as permissive
for select
to public
using (authorize_company_participant_member(participant_id, auth.uid(), 'admin'::company_role));


create policy "Company moderators can view their own participant roles."
on "public"."participant_roles"
as permissive
for select
to public
using (authorize_company_participant_member(participant_id, auth.uid(), 'moderator'::company_role));


create policy "Public participant roles are viewable by everyone."
on "public"."participant_roles"
as permissive
for select
to public
using (authorize_participant_public(participant_id));




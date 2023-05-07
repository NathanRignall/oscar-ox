drop policy "Public events are viewable by everyone." on "public"."events";

drop policy "Public participants are viewable by everyone." on "public"."participants";

alter table "public"."events" drop column "is_published";

alter table "public"."participants" drop column "is_published";

set check_function_bodies = off;

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
      productions.is_published = true and
      companies.is_public = true
    into bind_permissions;

    return bind_permissions > 0;
  end;
$function$
;

create policy "Public events are viewable by everyone."
on "public"."events"
as permissive
for select
to public
using (authorize_production_public(production_id));


create policy "Public participants are viewable by everyone."
on "public"."participants"
as permissive
for select
to public
using (authorize_production_public(production_id));




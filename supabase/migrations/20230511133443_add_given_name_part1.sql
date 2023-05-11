alter table "public"."profiles" drop constraint "name_length";

alter table "public"."profiles" drop column "name";

alter table "public"."profiles" add column "family_name" text;

alter table "public"."profiles" add column "given_name" text;

alter table "public"."profiles" add constraint "profiles_family_name_check" CHECK ((char_length(family_name) >= 2)) not valid;

alter table "public"."profiles" validate constraint "profiles_family_name_check";

alter table "public"."profiles" add constraint "profiles_given_name_check" CHECK ((char_length(given_name) >= 2)) not valid;

alter table "public"."profiles" validate constraint "profiles_given_name_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, given_name, family_name, email)
  values (new.id, new.raw_user_meta_data->>'given_name', new.raw_user_meta_data->>'family_name', new.email);
  return new;
end;
$function$
;






create type "public"."company_role" as enum ('admin', 'moderator');

create table "public"."categories" (
    "id" uuid not null,
    "title" text not null,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."companies" (
    "id" uuid not null,
    "name" text not null,
    "description" text not null,
    "main_colour" text not null default '#000000'::text,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."company_members" (
    "id" uuid not null,
    "company_id" uuid not null,
    "profile_id" uuid not null,
    "role" company_role not null default 'moderator'::company_role,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."events" (
    "id" uuid not null,
    "production_id" uuid not null,
    "venue_id" uuid not null,
    "start_time" timestamp with time zone not null,
    "end_time" timestamp with time zone,
    "ticket_link" text,
    "is_published" boolean not null default false,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."pages" (
    "id" uuid not null,
    "company_id" uuid not null,
    "url" text not null,
    "title" text not null,
    "content" text not null,
    "is_published" boolean not null,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."participants" (
    "uuid" uuid not null,
    "profile_id" uuid not null,
    "production_id" uuid not null,
    "role_id" uuid,
    "category_id" uuid,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."productions" (
    "id" uuid not null,
    "company_id" uuid not null,
    "title" text not null,
    "description" text not null,
    "is_published" boolean not null default false,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."profiles" (
    "id" uuid not null,
    "name" text not null,
    "email" text not null,
    "biography" text,
    "avatar_url" text,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."responses" (
    "id" uuid not null,
    "vacancy_id" uuid not null,
    "profile_id" uuid not null,
    "message" text not null,
    "is_accepted" boolean not null,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."roles" (
    "id" uuid not null,
    "title" text not null,
    "description" text not null,
    "image_url" text,
    "is_published" boolean not null default false,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."subscriptions" (
    "id" uuid not null,
    "profile_id" uuid not null,
    "category_id" uuid not null,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."vacancies" (
    "id" uuid not null,
    "company_id" uuid not null,
    "title" text not null,
    "description" text not null,
    "is_open" boolean not null default true,
    "is_published" boolean not null default false,
    "production_id" uuid,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."vacancy_categories" (
    "id" uuid not null,
    "vacancy_id" uuid not null,
    "category_id" uuid not null
);


create table "public"."venues" (
    "id" uuid not null,
    "title" text not null,
    "description" text not null,
    "image_url" text,
    "location" text not null,
    "website" text,
    "is_useradded" boolean not null default false,
    "is_published" boolean not null default false,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id);

CREATE UNIQUE INDEX companies_pkey ON public.companies USING btree (id);

CREATE UNIQUE INDEX company_members_pkey ON public.company_members USING btree (id);

CREATE UNIQUE INDEX events_pkey ON public.events USING btree (id);

CREATE UNIQUE INDEX pages_pkey ON public.pages USING btree (id);

CREATE UNIQUE INDEX participants_pkey ON public.participants USING btree (uuid);

CREATE UNIQUE INDEX productions_pkey ON public.productions USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX responses_pkey ON public.responses USING btree (id);

CREATE UNIQUE INDEX roles_pkey ON public.roles USING btree (id);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

CREATE UNIQUE INDEX vacancies_pkey ON public.vacancies USING btree (id);

CREATE UNIQUE INDEX vacancy_categories_pkey ON public.vacancy_categories USING btree (id);

CREATE UNIQUE INDEX venues_pkey ON public.venues USING btree (id);

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."companies" add constraint "companies_pkey" PRIMARY KEY using index "companies_pkey";

alter table "public"."company_members" add constraint "company_members_pkey" PRIMARY KEY using index "company_members_pkey";

alter table "public"."events" add constraint "events_pkey" PRIMARY KEY using index "events_pkey";

alter table "public"."pages" add constraint "pages_pkey" PRIMARY KEY using index "pages_pkey";

alter table "public"."participants" add constraint "participants_pkey" PRIMARY KEY using index "participants_pkey";

alter table "public"."productions" add constraint "productions_pkey" PRIMARY KEY using index "productions_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."responses" add constraint "responses_pkey" PRIMARY KEY using index "responses_pkey";

alter table "public"."roles" add constraint "roles_pkey" PRIMARY KEY using index "roles_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."vacancies" add constraint "vacancies_pkey" PRIMARY KEY using index "vacancies_pkey";

alter table "public"."vacancy_categories" add constraint "vacancy_categories_pkey" PRIMARY KEY using index "vacancy_categories_pkey";

alter table "public"."venues" add constraint "venues_pkey" PRIMARY KEY using index "venues_pkey";

alter table "public"."company_members" add constraint "company_members_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE not valid;

alter table "public"."company_members" validate constraint "company_members_company_id_fkey";

alter table "public"."company_members" add constraint "company_members_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."company_members" validate constraint "company_members_profile_id_fkey";

alter table "public"."events" add constraint "events_production_id_fkey" FOREIGN KEY (production_id) REFERENCES productions(id) ON DELETE CASCADE not valid;

alter table "public"."events" validate constraint "events_production_id_fkey";

alter table "public"."events" add constraint "events_venue_id_fkey" FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE not valid;

alter table "public"."events" validate constraint "events_venue_id_fkey";

alter table "public"."pages" add constraint "pages_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE not valid;

alter table "public"."pages" validate constraint "pages_company_id_fkey";

alter table "public"."participants" add constraint "participants_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) not valid;

alter table "public"."participants" validate constraint "participants_category_id_fkey";

alter table "public"."participants" add constraint "participants_production_id_fkey" FOREIGN KEY (production_id) REFERENCES productions(id) ON DELETE CASCADE not valid;

alter table "public"."participants" validate constraint "participants_production_id_fkey";

alter table "public"."participants" add constraint "participants_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."participants" validate constraint "participants_profile_id_fkey";

alter table "public"."participants" add constraint "participants_role_id_fkey" FOREIGN KEY (role_id) REFERENCES roles(id) not valid;

alter table "public"."participants" validate constraint "participants_role_id_fkey";

alter table "public"."productions" add constraint "productions_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE not valid;

alter table "public"."productions" validate constraint "productions_company_id_fkey";

alter table "public"."profiles" add constraint "name_length" CHECK ((char_length(name) >= 3)) not valid;

alter table "public"."profiles" validate constraint "name_length";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."responses" add constraint "responses_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."responses" validate constraint "responses_profile_id_fkey";

alter table "public"."responses" add constraint "responses_vacancy_id_fkey" FOREIGN KEY (vacancy_id) REFERENCES vacancies(id) ON DELETE CASCADE not valid;

alter table "public"."responses" validate constraint "responses_vacancy_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_category_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_profile_id_fkey";

alter table "public"."vacancies" add constraint "vacancies_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE not valid;

alter table "public"."vacancies" validate constraint "vacancies_company_id_fkey";

alter table "public"."vacancies" add constraint "vacancies_production_id_fkey" FOREIGN KEY (production_id) REFERENCES productions(id) not valid;

alter table "public"."vacancies" validate constraint "vacancies_production_id_fkey";

alter table "public"."vacancy_categories" add constraint "vacancy_categories_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE not valid;

alter table "public"."vacancy_categories" validate constraint "vacancy_categories_category_id_fkey";

alter table "public"."vacancy_categories" add constraint "vacancy_categories_vacancy_id_fkey" FOREIGN KEY (vacancy_id) REFERENCES vacancies(id) ON DELETE CASCADE not valid;

alter table "public"."vacancy_categories" validate constraint "vacancy_categories_vacancy_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (new.id, new.raw_user_meta_data->>'name', new.email, new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$
;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

create policy "Anyone can upload an avatar"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'avatars'::text));


create policy "Avatar images are publicly accessible"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'avatars'::text));




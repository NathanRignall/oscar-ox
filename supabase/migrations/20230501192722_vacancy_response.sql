create type "public"."response_type" as enum ('platform', 'email', 'phone');

alter table "public"."vacancies" add column "response_deadline" timestamp with time zone;

alter table "public"."vacancies" add column "response_type" response_type not null default 'platform'::response_type;



alter table "public"."vacancies" drop column "description";

alter table "public"."vacancies" add column "content" text;

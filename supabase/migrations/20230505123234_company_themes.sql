create type "public"."page_theme" as enum ('default', '00productions');

alter table "public"."companies" add column "theme" page_theme not null default 'default'::page_theme;



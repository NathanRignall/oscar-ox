alter table "public"."subscriptions" drop constraint "subscriptions_pkey";

drop index if exists "public"."subscriptions_pkey";

alter table "public"."pages" drop column "content";

alter table "public"."subscriptions" drop column "id";

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (profile_id, category_id);

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";


drop policy "Anyone can view a picture" on "storage"."objects";

delete from "storage"."objects" where bucket_id = 'pictures';


alter table "public"."productions" add column "image_url" text;

delete from storage.buckets where id = 'pictures';

insert into storage.buckets (id, name) values ('media', 'media');

create policy "Anyone can view a piece of meida"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'media'::text));


create policy "Company admins can insert media"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'media'::text) AND (auth.role() = 'authenticated'::text) AND ((storage.foldername(name))[1] = 'companies'::text) AND authorize_company_member(((storage.foldername(name))[2])::uuid, auth.uid(), 'admin'::company_role)));




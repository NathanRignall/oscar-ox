drop policy "Company admins can update their own company." on "public"."companies";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_company(id uuid, slug text, name text, description text, main_colour text, is_public boolean)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not authorize_company_member(update_company.id, auth.uid(), 'admin') then
    raise exception 'User is not authorized to update company.';
  end if;

  update companies
  set
    slug = update_company.slug,
    name = update_company.name,
    description = update_company.description,
    main_colour = update_company.main_colour,
    is_public = update_company.is_public
  where
    companies.id = update_company.id;
end;
$function$
;



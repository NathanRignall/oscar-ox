-- -- Set up the database -- --

-- create enum for company roles
create type public.company_role as enum ('admin', 'moderator');

-- create enum for responses
create type public.response_type as enum ('platform', 'email', 'phone');

-- create enum for themes
create type public.page_theme as enum ('default', '00productions');

-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text not null,
  email text not null,
  biography text,
  avatar_url text,
  is_public boolean not null default true,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint name_length check (char_length(name) >= 3)
);

-- create table for venues
create table public.venues (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  description text not null,
  image_url text,
  location text not null,
  website text,
  latitude float8 not null,
  longitude float8 not null,
  is_userAdded boolean not null default false,
  is_published boolean not null default false,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- create table for roles
create table public.roles (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  description text not null,
  image_url text,
  is_published boolean not null default false,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- create table for categories
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- create table for subscriptions
create table public.subscriptions (
  profile_id uuid references public.profiles on delete cascade not null,
  category_id uuid references public.categories on delete cascade not null,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (profile_id, category_id)
);

-- create table for companies
create table public.companies (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text not null,
  main_colour text not null default '#000000',
  theme public.page_theme not null default 'default',
  is_public boolean not null default true,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- create table for company members
create table public.company_members (
  company_id uuid references public.companies on delete cascade not null,
  profile_id uuid references public.profiles on delete cascade not null,
  role public.company_role not null default 'moderator',
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (company_id, profile_id)
);

-- create table for productions
create table public.productions (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references public.companies on delete cascade not null,
  title text not null,
  description text not null,
  is_published boolean not null default false,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- create table for events
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  production_id uuid references public.productions on delete cascade not null,
  venue_id uuid references public.venues on delete cascade not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  ticket_link text,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- create table for participants
create table public.participants (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles on delete cascade not null,
  production_id uuid references public.productions on delete cascade not null,
  category_id uuid references public.categories,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- create table for participant roles
create table public.participant_roles (
  participant_id uuid references public.participants on delete cascade not null,
  role_id uuid references public.roles on delete cascade not null,
  primary key (participant_id, role_id)
);

-- create table for vacancies
create table public.vacancies (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references public.companies on delete cascade not null,
  title text not null,
  content text,
  response_type public.response_type not null default 'platform',
  response_deadline timestamp with time zone,
  is_open boolean not null default true,
  is_published boolean not null default false,
  production_id uuid references public.productions,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- create table for vacancy categories
create table public.vacancy_categories (
  vacancy_id uuid references public.vacancies on delete cascade not null,
  category_id uuid references public.categories on delete cascade not null,
  primary key (vacancy_id, category_id)
);

-- create table for responenses
create table public.responses (
  id uuid primary key default uuid_generate_v4(),
  vacancy_id uuid references public.vacancies on delete cascade not null,
  profile_id uuid references public.profiles on delete cascade not null,
  message text not null,
  is_accepted boolean not null,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- create table for pages
create table public.pages (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references public.companies on delete cascade not null,
  slug text not null unique,
  title text not null,
  is_published boolean not null default false,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- create a profile when a new auth user is created.
create function public.handle_new_user()
returns trigger as
$$
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

GRANT execute ON FUNCTION public.handle_new_user() TO PUBLIC;

-- create company function
create function public.create_company(slug text, name text, description text)
returns uuid as
$$
declare
  new_company_id uuid;
begin
  insert into companies (slug, name, description)
  values (create_company.slug, create_company.name, create_company.description)
  returning id into new_company_id;

  insert into company_members (company_id, profile_id, role)
  values (new_company_id, auth.uid(), 'admin');

  return new_company_id;
end;
$$ language plpgsql security definer;

GRANT execute ON FUNCTION public.create_company(slug text, name text, description text) TO authenticated;

-- authorize company member
create function public.authorize_company_member(
  company_id uuid,
  profile_id uuid,
  role public.company_role
)
returns boolean as
$$
  declare
    bind_permissions int;
  begin
    select
      count(*)
    from public.company_members
    where
      company_members.company_id = authorize_company_member.company_id and
      company_members.profile_id = authorize_company_member.profile_id and
      company_members.role = authorize_company_member.role
    into bind_permissions;

    return bind_permissions > 0;
  end;
$$
language plpgsql security definer;

GRANT execute ON FUNCTION public.authorize_company_member(company_id uuid, profile_id uuid, role public.company_role) TO PUBLIC;

-- authorize company production member
create function public.authorize_company_production_member(
  production_id uuid,
  profile_id uuid,
  role public.company_role
)
returns boolean as
$$
  declare
    bind_permissions int;
  begin
    select
      count(*)
    from public.company_members
    join public.productions on productions.company_id = company_members.company_id
    where
      productions.id = authorize_company_production_member.production_id and
      company_members.profile_id = authorize_company_production_member.profile_id and
      company_members.role = authorize_company_production_member.role
    into bind_permissions;

    return bind_permissions > 0;
  end;
$$
language plpgsql security definer;

GRANT execute ON FUNCTION public.authorize_company_production_member(production_id uuid, profile_id uuid, role public.company_role) TO PUBLIC;

-- authorize company participant member
create function public.authorize_company_participant_member(
  participant_id uuid,
  profile_id uuid,
  role public.company_role
)
returns boolean as
$$
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
$$
language plpgsql security definer;

GRANT execute ON FUNCTION public.authorize_company_participant_member(participant_id uuid, profile_id uuid, role public.company_role) TO PUBLIC;

-- authorize company vacancy member
create function public.authorize_company_vacancy_member(
  vacancy_id uuid,
  profile_id uuid,
  role public.company_role
)
returns boolean as
$$
  declare
    bind_permissions int;
  begin
    select
      count(*)
    from public.company_members
    join public.vacancies on vacancies.company_id = company_members.company_id
    where
      vacancies.id = authorize_company_vacancy_member.vacancy_id and
      company_members.profile_id = authorize_company_vacancy_member.profile_id and
      company_members.role = authorize_company_vacancy_member.role
    into bind_permissions;

    return bind_permissions > 0;
  end;
$$
language plpgsql security definer;

GRANT execute ON FUNCTION public.authorize_company_vacancy_member(vacancy_id uuid, profile_id uuid, role public.company_role) TO PUBLIC;

-- authorize company public
create function public.authorize_company_public(
  company_id uuid
)
returns boolean as
$$
  declare
    bind_permissions int;
  begin
    select
      count(*)
    from public.companies
    where
      companies.id = authorize_company_public.company_id and
      companies.is_public = true
    into bind_permissions;

    return bind_permissions > 0;
  end;
$$
language plpgsql security definer;

GRANT execute ON FUNCTION public.authorize_company_public(company_id uuid) TO PUBLIC;

-- authorize production public
create function public.authorize_production_public(
  production_id uuid
)
returns boolean as
$$
  declare
    bind_permissions int;
  begin
    select
      count(*)
    from public.productions
    join public.companies on companies.id = productions.company_id
    where
      productions.id = authorize_production_public.production_id and
      productions.is_published = true and
      companies.is_public = true
    into bind_permissions;

    return bind_permissions > 0;
  end;
$$
language plpgsql security definer;

GRANT execute ON FUNCTION public.authorize_production_public(production_id uuid) TO PUBLIC;

-- authorize participant public
create function public.authorize_participant_public(
  participant_id uuid
)
returns boolean as
$$
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
$$
language plpgsql security definer;

GRANT execute ON FUNCTION public.authorize_participant_public(participant_id uuid) TO PUBLIC;

-- authorize vacancy public
create function public.authorize_vacancy_public(
  vacancy_id uuid
)
returns boolean as
$$
  -- join on company
  declare
    bind_permissions int;
  begin
    select
      count(*)
    from public.vacancies
    join public.companies on companies.id = vacancies.company_id
    where
      vacancies.id = authorize_vacancy_public.vacancy_id and
      vacancies.is_published = true and
      companies.is_public = true
    into bind_permissions;

    return bind_permissions > 0;
  end;
$$
language plpgsql security definer;

GRANT execute ON FUNCTION public.authorize_vacancy_public(vacancy_id uuid) TO PUBLIC;


alter table productions
  enable row level security;
alter table profiles
  enable row level security;
create policy "Public profiles are viewable by everyone." on profiles
  for select using (is_public);
create policy "Users can view their own profile." on profiles
  for select using (auth.uid() = id);
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

alter table venues
  enable row level security;
create policy "Venues that are published are iewable by everyone." on venues
  for select using (is_published);

alter table roles
  enable row level security;
create policy "Roles that are published are viewable by everyone." on roles
  for select using (is_published);

alter table categories
  enable row level security;
create policy "Categories are viewable by everyone." on categories
  for select using (true);

alter table subscriptions
  enable row level security;
create policy "Users can view their own subscriptions." on subscriptions
  for select using (auth.uid() = profile_id);
create policy "Users can insert their own subscriptions." on subscriptions
  for insert with check (auth.uid() = profile_id);
create policy "Users can update their own subscriptions." on subscriptions
  for update using (auth.uid() = profile_id);
create policy "Users can delete their own subscriptions." on subscriptions
  for delete using (auth.uid() = profile_id);

alter table companies
  enable row level security;
create policy "Public companies are viewable by everyone." on companies
  for select using (is_public);
create policy "Company moderators can view their own company." on companies
  for select using (authorize_company_member(id, auth.uid(), 'moderator'));
create policy "Company admins can view their own company." on companies
  for select using (authorize_company_member(id, auth.uid(), 'admin'));
create policy "Company admins can update their own company." on companies
  for update using (authorize_company_member(id, auth.uid(), 'admin'));

alter table company_members
  enable row level security;
create policy "Public company members are viewable by everyone." on company_members
  for select using (authorize_company_public(company_id));
create policy "Company moderators can view their own company members." on company_members
  for select using (authorize_company_member(company_id, auth.uid(), 'moderator'));
create policy "Company admins can view their own company members." on company_members
  for select using (authorize_company_member(company_id, auth.uid(), 'admin'));
create policy "Company admins can insert their own company members." on company_members
  for insert with check (authorize_company_member(company_id, auth.uid(), 'admin'));
create policy "Company admins can update their own company members." on company_members
  for update using (authorize_company_member(company_id, auth.uid(), 'admin'));
create policy "Company admins can delete their own company members." on company_members
  for delete using (authorize_company_member(company_id, auth.uid(), 'admin'));

create policy "Public productions are viewable by everyone." on productions
  for select using (is_published);
create policy "Company moderators can view their own productions." on productions
  for select using (authorize_company_member(company_id, auth.uid(), 'moderator'));
create policy "Company admins can view their own productions." on productions
  for select using (authorize_company_member(company_id, auth.uid(), 'admin'));
create policy "Company admins can insert their own productions." on productions
  for insert with check (authorize_company_member(company_id, auth.uid(), 'admin'));
create policy "Company admins can update their own productions." on productions
  for update using (authorize_company_member(company_id, auth.uid(), 'admin'));
create policy "Company admins can delete their own productions." on productions
  for delete using (authorize_company_member(company_id, auth.uid(), 'admin'));

alter table events
  enable row level security;
create policy "Public events are viewable by everyone." on events
  for select using (authorize_production_public(production_id));
create policy "Company moderators can view their own events." on events
  for select using (authorize_company_production_member(production_id, auth.uid(), 'moderator'));
create policy "Company admins can view their own events." on events
  for select using (authorize_company_production_member(production_id, auth.uid(), 'admin'));
create policy "Company admins can insert their own events." on events
  for insert with check (authorize_company_production_member(production_id, auth.uid(), 'admin'));
create policy "Company admins can update their own events." on events
  for update using (authorize_company_production_member(production_id, auth.uid(), 'admin'));
create policy "Company admins can delete their own events." on events
  for delete using (authorize_company_production_member(production_id, auth.uid(), 'admin'));

alter table participants
  enable row level security;
create policy "Public participants are viewable by everyone." on participants
  for select using (authorize_production_public(production_id));
create policy "Company moderators can view their own participants." on participants
  for select using (authorize_company_production_member(production_id, auth.uid(), 'moderator'));
create policy "Company admins can view their own participants." on participants
  for select using (authorize_company_production_member(production_id, auth.uid(), 'admin'));
create policy "Company admins can insert their own participants." on participants
  for insert with check (authorize_company_production_member(production_id, auth.uid(), 'admin'));
create policy "Company admins can update their own participants." on participants
  for update using (authorize_company_production_member(production_id, auth.uid(), 'admin'));
create policy "Company admins can delete their own participants." on participants
  for delete using (authorize_company_production_member(production_id, auth.uid(), 'admin'));

alter table participant_roles
  enable row level security;
create policy "Public participant roles are viewable by everyone." on participant_roles
  for select using (authorize_participant_public(participant_id));
create policy "Company moderators can view their own participant roles." on participant_roles
  for select using (authorize_company_participant_member(participant_id, auth.uid(), 'moderator'));
create policy "Company admins can view their own participant roles." on participant_roles
  for select using (authorize_company_participant_member(participant_id, auth.uid(), 'admin'));
create policy "Company admins can insert their own participant roles." on participant_roles
  for insert with check (authorize_company_participant_member(participant_id, auth.uid(), 'admin'));
create policy "Company admins can update their own participant roles." on participant_roles
  for update using (authorize_company_participant_member(participant_id, auth.uid(), 'admin'));
create policy "Company admins can delete their own participant roles." on participant_roles
  for delete using (authorize_company_participant_member(participant_id, auth.uid(), 'admin'));

alter table vacancies
  enable row level security;
create policy "Public vacancies are viewable by everyone." on vacancies
  for select using (is_published and authorize_company_public(company_id));
create policy "Company moderators can view their own vacancies." on vacancies
  for select using (authorize_company_member(company_id, auth.uid(), 'moderator'));
create policy "Company admins can view their own vacancies." on vacancies
  for select using (authorize_company_member(company_id, auth.uid(), 'admin'));
create policy "Company admins can insert their own vacancies." on vacancies
  for insert with check (authorize_company_member(company_id, auth.uid(), 'admin'));
create policy "Company admins can update their own vacancies." on vacancies
  for update using (authorize_company_member(company_id, auth.uid(), 'admin'));
create policy "Company admins can delete their own vacancies." on vacancies
  for delete using (authorize_company_member(company_id, auth.uid(), 'admin'));

alter table vacancy_categories
  enable row level security;
create policy "Public vacancy categories are viewable by everyone." on vacancy_categories
  for select using (authorize_vacancy_public(vacancy_id));
create policy "Company moderators can view their own vacancy categories." on vacancy_categories
  for select using (authorize_company_vacancy_member(vacancy_id, auth.uid(), 'moderator'));
create policy "Company admins can view their own vacancy categories." on vacancy_categories
  for select using (authorize_company_vacancy_member(vacancy_id, auth.uid(), 'admin'));
create policy "Company admins can insert their own vacancy categories." on vacancy_categories
  for insert with check (authorize_company_vacancy_member(vacancy_id, auth.uid(), 'admin'));
create policy "Company admins can update their own vacancy categories." on vacancy_categories
  for update using (authorize_company_vacancy_member(vacancy_id, auth.uid(), 'admin'));
create policy "Company admins can delete their own vacancy categories." on vacancy_categories
  for delete using (authorize_company_vacancy_member(vacancy_id, auth.uid(), 'admin'));

alter table responses
  enable row level security;
create policy "Users can view their own responses." on responses
  for select using (profile_id = auth.uid());
create policy "Users can insert their own responses." on responses
  for insert with check (profile_id = auth.uid() and authorize_vacancy_public(vacancy_id));
create policy "Company moderators can view their own responses." on responses
  for select using (authorize_company_vacancy_member(vacancy_id, auth.uid(), 'moderator'));
create policy "Company admins can view their own responses." on responses
  for select using (authorize_company_vacancy_member(vacancy_id, auth.uid(), 'admin'));

alter table pages
  enable row level security;
create policy "Public pages are viewable by everyone." on pages
  for select using (is_published and authorize_company_public(company_id));
create policy "Company moderators can view their own pages." on pages
  for select using (authorize_company_member(company_id, auth.uid(), 'moderator'));
create policy "Company admins can view their own pages." on pages
  for select using (authorize_company_member(company_id, auth.uid(), 'admin'));
create policy "Company admins can insert their own pages." on pages
  for insert with check (authorize_company_member(company_id, auth.uid(), 'admin'));
create policy "Company admins can update their own pages." on pages
  for update using (authorize_company_member(company_id, auth.uid(), 'admin'));
create policy "Company admins can delete their own pages." on pages
  for delete using (authorize_company_member(company_id, auth.uid(), 'admin'));


-- -- Set up storage -- --

-- create a bucket for profiles
insert into storage.buckets (id, name) values ('profiles', 'profiles');

create policy "Anyone can view a profile" on storage.objects 
  for select using ( bucket_id = 'profiles' );

create policy "Anyone authenticated can insert a profile" on storage.objects
  for insert with check ((bucket_id = 'profiles') AND (auth.role() = 'authenticated'));

-- create a bucket for pictures
insert into storage.buckets (id, name) values ('pictures', 'pictures');

create policy "Anyone can view a picture" on storage.objects 
  for select using ( bucket_id = 'pictures' );
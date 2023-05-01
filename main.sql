-- -- Set up the database -- --

-- create enum for company roles
create type public.company_role as enum ('admin', 'moderator');

-- create enum for responses
create type public.response_type as enum ('platform', 'email', 'phone');

-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text not null,
  email text not null,
  biography text,
  avatar_url text,
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
  name text not null,
  description text not null,
  main_colour text not null default '#000000',
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
  is_published boolean not null default false,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- create table for participants
create table public.participants (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles on delete cascade not null,
  production_id uuid references public.productions on delete cascade not null,
  role_id uuid references public.roles,
  category_id uuid references public.categories,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
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
  is_published boolean not null,
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
create function public.create_company(name text, description text)
returns uuid as
$$
declare
  new_company_id uuid;
begin
  insert into companies (name, description)
  values (create_company.name, create_company.description)
  returning id into new_company_id;

  insert into company_members (company_id, profile_id, role)
  values (new_company_id, auth.uid(), 'admin');

  return new_company_id;
end;
$$ language plpgsql security definer;

GRANT execute ON FUNCTION public.create_company() TO authenticated;

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
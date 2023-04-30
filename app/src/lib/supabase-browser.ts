import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "./supabase-db-types";

export const createBrowserClient = () =>
  createBrowserSupabaseClient<Database>();

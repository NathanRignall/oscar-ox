import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = createServerClient();

  supabase.auth.updateUser({ data: { finished_onboarding: false } });

  return NextResponse.json("RESET ONBOARDING");
}

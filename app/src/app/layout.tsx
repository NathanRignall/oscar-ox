import "server-only";

import "./globals.css";
import { createServerClient } from "@/lib/supabase-server";
import { SupabaseListener, SupabaseProvider } from "@/components/client";
import { Logger } from "./Logger";
import Script from "next/script";

// do not cache this layout
export const revalidate = 0;

// metadata
export const metadata = {
  title: "Oscar Ox",
  description: "The website for amateur theatre in Oxford",
};

// layout
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <head />

      <Script async src="https://analytics.nlr.app/script.js" data-website-id="5f46a410-0a80-4d6d-8bb0-8b5712fa04ee"/>

      <body className="bg-slate-50 dark:bg-slate-900 h-screen flex flex-col">
        <SupabaseProvider session={session}>
          <SupabaseListener serverAccessToken={session?.access_token} />
          {children}
        </SupabaseProvider>
      </body>

      <Logger />
    </html>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { Button } from "@/components/ui";
import { PrivacyPolicy } from "@/containers";

export default function PrivacyModal() {
  const { supabase, session } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async () => {
    // check if user is logged in
    if (!session?.user?.id) return;

    // update user to current privacy version
    const { error: errorUser } = await supabase.auth.updateUser({
      data: { privacy_version: 0.1 },
    });

    if (errorUser) {
      setFormError(errorUser.message);
    } else {
      startTransition(() => {
        router.refresh();
      });
    }
  };

  return (
    <div className="fixed z-30 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-5 px-5 sm:p-0">
        <div className="fixed inset-0 bg-slate-500 opacity-70" />

        <div className="bg-white rounded-lg overflow-hidden z-40 w-full max-w-2xl">
          <div className="px-10 py-8">
            <div className="text-3xl text-slate-900 font-bold mb-1">
              New Privacy Policy
            </div>
            <p className="text-lg text-slate-600 mb-8">
              We&apos;ve updated our privacy policy. Please review the new
              policy to continue using our services.
            </p>

            <div className="mb-8 max-h-[40vh] border-2 border-slate-200 rounded-lg overflow-y-scroll whitespace-normal px-8 py-4">
              <h2 className="font-bold text-xl mt-3 mb-1">Privacy Policy</h2>

              <PrivacyPolicy />
            </div>

            <Button variant="secondary" display="block" onClick={onSubmit}>
              Agree
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

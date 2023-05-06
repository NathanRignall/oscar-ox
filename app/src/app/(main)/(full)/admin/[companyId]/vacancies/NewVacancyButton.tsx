"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui";

type NewVacancyButtonProps = {
  company_id: string;
};

export const NewVacancyButton = ({ company_id }: NewVacancyButtonProps) => {
  const { supabase } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onClick = async () => {
    setIsLoading(true);
    const id = uuidv4();

    const { data, error } = await supabase.from("vacancies").insert({
      id: id,
      company_id: company_id,
      title: "New Vacancy",
    });

    if (error) {
      setFormError(error.message);
      setIsLoading(false);
    } else {
      startTransition(() => {
        router.refresh();
        router.push(`/admin/${company_id}/vacancies/${id}`);
      });
    }
  };
  return (
    <Button onClick={onClick} disabled={isLoading}>New Vacancy</Button>
  );
};

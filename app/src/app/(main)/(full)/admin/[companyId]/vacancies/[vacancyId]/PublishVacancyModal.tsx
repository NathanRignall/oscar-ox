"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { Button } from "@/components/ui";

const MDEditor = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

type PublishVacancyModalProps = {
  vacancyId: string;
};

export const PublishVacancyModal = ({
  vacancyId,
}: PublishVacancyModalProps) => {
  const { supabase, session } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [value, setValue] = useState<string | undefined>("**Hello world!!!**");
  const [isLoading, setIsLoading] = useState(true);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const onSubmit = async () => {
    const { data, error } = await supabase
      .from("vacancies")
      .update({ is_published: true })
      .eq("id", vacancyId);

    if (error) {
      setFormError(error.message);
    } else {
      toggleModal();
      startTransition(() => {
        router.refresh();
      });
    }
  };

  useEffect(() => {
    const loadContent = async () => {
      const { data, error } = await supabase
        .from("vacancies")
        .select("content")
        .eq("id", vacancyId)
        .single();

      if (!data || !data.content) return;

      setValue(data.content);

      setIsLoading(false);
    };

    loadContent();
  }, [supabase, vacancyId, isOpen]);

  return (
    <>
      <Button onClick={toggleModal} className="mt-4">
        Preview
      </Button>

      {isOpen && (
        <div className="fixed z-30 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-5 px-5 sm:p-0">
            <div className="fixed inset-0 bg-slate-500 opacity-70" />

            <div className="bg-white rounded-lg overflow-hidden z-40 w-full max-w-2xl">
              <div className="px-10 py-8">
                <div className="flex items-end justify-between rounded-t mb-4">
                  <button
                    type="button"
                    className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                    data-modal-hide="defaultModal"
                    onClick={toggleModal}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>

                <div className="text-3xl text-slate-900 font-bold mb-8">
                  Publish Vacancy
                </div>

                <div className="mb-4 bg-slate-200">
                  <MDEditor source={value} />
                </div>

                <Button onClick={onSubmit} className="mt-4">
                  Publish
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

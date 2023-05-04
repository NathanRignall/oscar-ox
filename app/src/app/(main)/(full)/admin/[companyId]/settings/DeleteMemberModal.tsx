"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { object, string } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button } from "@/components/ui";
import AutoCompleteEmail from "./AutoCompleteEmail";

type DeleteMemberModalProps = {
  companyId: string;
  profileId: string;
  name: string;
  email: string;
};

export const DeleteMemberModal = ({
  companyId,
  profileId,
  name,
  email,
}: DeleteMemberModalProps) => {
  const { supabase } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  interface FormValues {
    profileId: string;
    role: "admin" | "moderator";
  }

  const initialValues: FormValues = {
    profileId: "",
    role: "admin",
  };

  const validationSchema = object({
    profileId: string().required("Vaid user is required"),
  });

  const onSubmit = async () => {
    const { error } = await supabase
      .from("company_members")
      .delete()
      .match({ company_id: companyId, profile_id: profileId });

    if (error) {
      setFormError(error.message);
    } else {
      toggleModal();

      startTransition(() => {
        router.refresh();
      });
    }
  };
  return (
    <>
      <Button size="sm" onClick={toggleModal}>
        Remove
      </Button>

      {isOpen && (
        <div className="fixed z-30 inset-0 overflow-y-auto text-left whitespace-normal">
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

                <div className="text-3xl text-slate-900 font-bold mb-1">
                  Remove Member
                </div>

                <p className="text-lg text-slate-600 mb-6">
                  You are about to remove a member from your company. Are you
                  sure you would like to continue?
                </p>

                <p className="text-lg text-slate-600 mb-6 italic">
                  {name} - {email}
                </p>

                <div className="mb-6">
                  <Button
                    variant="secondary"
                    display="block"
                    onClick={onSubmit}
                  >
                    Remove
                  </Button>

                  <div className="text-center">
                    {formError ? (
                      <p className="mt-2 text-sm text-slate-600">{formError}</p>
                    ) : (
                      <div className="mt-2 h-5" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

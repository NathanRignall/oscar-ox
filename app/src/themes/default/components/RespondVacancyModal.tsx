"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { object, string } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button, Modal } from "@/components/ui";

export type RespondVacancyModalProps = {
  vacancyId: string;
};

export const RespondVacancyModal = ({
  vacancyId,
}: RespondVacancyModalProps) => {
  const { supabase, session } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  interface FormValues {
    vacancyId: string;
    profileId: string;
    message: string;
  }

  const initialValues: FormValues = {
    vacancyId: vacancyId,
    profileId: session?.user?.id || "",
    message: "",
  };

  const validationSchema = object({
    message: string()
      .min(3, "Must be at least 3 characters")
      .required("Message is Required"),
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.from("responses").insert({
      vacancy_id: values.vacancyId,
      profile_id: values.profileId,
      message: values.message,
      is_accepted: false,
    });

    if (error) {
      setFormError(error.message);
    } else {
      toggleModal();
      setFormError(null);

      startTransition(() => {
        router.refresh();
      });
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} button="Respond">
      <div className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
        Respond to Vacancy
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched }: FormikProps<FormValues>) => (
          <Form>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-600 dark:text-slate-300"
              >
                Response Message
              </label>
              <Field
                component="textarea"
                id="message"
                type="text"
                rows={5}
                name="message"
                placeholder="Message..."
                className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
              />

              {errors.message && touched.message && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <Button
                variant="secondary"
                display="block"
                type="submit"
                disabled={session == null}
              >
                Respond
              </Button>

              <div className="text-center">
                {formError ? (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                    {formError}
                  </p>
                ) : (
                  <div className="mt-2 h-5" />
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

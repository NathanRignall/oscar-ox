"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { object, string } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button, Modal } from "@/components/ui";

type NewVacancyModalProps = {
  company_id: string;
};

export const NewVacancyModal = ({ company_id }: NewVacancyModalProps) => {
  const { supabase } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  interface FormValues {
    title: string;
  }

  const initialValues: FormValues = {
    title: "",
  };

  const validationSchema = object({
    title: string()
      .min(3, "Must be at least 3 characters")
      .required("Title is Required"),
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.from("vacancies").insert({
      company_id: company_id,
      title: values.title,
    });

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
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} button="New Vacancy">
      <div className="text-3xl text-slate-900 font-bold mb-8">New Vacnacy</div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, submitForm }: FormikProps<FormValues>) => (
          <Form>
            <div className="mb-4">
              <Field
                id="title"
                type="text"
                name="title"
                autoComplete="title"
                placeholder="Vacancy title..."
                className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
              />

              {errors.title && touched.title ? (
                <p className="mt-2 text-sm text-slate-600">{errors.title}</p>
              ) : (
                <div className="mt-2 h-5" />
              )}
            </div>

            <div className="mb-6">
              <Button variant="secondary" display="block" type="submit">
                Create
              </Button>

              <div className="text-center">
                {formError ? (
                  <p className="mt-2 text-sm text-slate-600">{formError}</p>
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

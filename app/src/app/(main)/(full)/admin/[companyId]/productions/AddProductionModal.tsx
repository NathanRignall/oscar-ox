"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { object, string } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button } from "@/components/ui";

type AddProductionModalProps = {
  company_id: string;
};

export const AddProductionModal = ({ company_id }: AddProductionModalProps) => {
  const { supabase, session } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  interface FormValues {
    title: string;
    description: string;
  }

  const initialValues: FormValues = {
    title: "",
    description: "",
  };

  const validationSchema = object({
    title: string()
      .min(3, "Must be at least 3 characters")
      .required("Title is Required"),
    description: string()
      .min(3, "Must be at least 3 characters")
      .required("Description is Required"),
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.from("productions").insert({
      company_id: company_id,
      title: values.title,
      description: values.description,
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
    <>
      <Button onClick={toggleModal}>Add Production</Button>

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
                  Add Production
                </div>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({
                    errors,
                    touched,
                  }: FormikProps<FormValues>) => (
                    <Form>
                      <div className="mb-4">
                        <Field
                          id="title"
                          type="text"
                          name="title"
                          autoComplete="title"
                          placeholder="Production title.."
                          className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
                        />

                        {errors.title && touched.title ? (
                          <p className="mt-2 text-sm text-slate-600">
                            {errors.title}
                          </p>
                        ) : (
                          <div className="mt-2 h-5" />
                        )}
                      </div>

                      <div className="mb-4">
                        <Field
                          component="textarea"
                          id="description"
                          type="text"
                          rows={5}
                          name="description"
                          autoComplete="description"
                          placeholder="Production description..."
                          className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
                        />
                        {errors.description && touched.description ? (
                          <p className="mt-2 text-sm text-slate-600">
                            {errors.description}
                          </p>
                        ) : (
                          <div className="mt-2 h-5" />
                        )}
                      </div>

                      <div className="mb-6">
                        <Button
                          variant="secondary"
                          display="block"
                          type="submit"
                        >
                          Create
                        </Button>

                        <div className="text-center">
                          {formError ? (
                            <p className="mt-2 text-sm text-slate-600">
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
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

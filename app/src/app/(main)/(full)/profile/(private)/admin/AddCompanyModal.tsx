"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { object, string } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button } from "@/components/ui";

export const AddCompanyModal = () => {
  const { supabase } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  interface FormValues {
    slug: string;
    name: string;
    description: string;
  }

  const initialValues: FormValues = {
    slug: "",
    name: "",
    description: "",
  };

  const validationSchema = object({
    slug: string()
      .min(3, "Must be at least 3 characters")
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be a valid url")
      .required("Url is Required"),
    name: string()
      .min(3, "Must be at least 3 characters")
      .required("Name is Required"),
    description: string()
      .min(3, "Must be at least 3 characters")
      .required("Description is Required"),
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.rpc("create_company", {
      slug: values.slug,
      name: values.name,
      description: values.description,
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
    <>
      <Button onClick={toggleModal}>Create Company</Button>

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
                  Create production company
                </div>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({
                    errors,
                    touched,
                    submitForm,
                  }: FormikProps<FormValues>) => (
                    <Form>
                      <div className="mb-4">
                        <Field
                          id="name"
                          type="text"
                          name="name"
                          autoComplete="name"
                          placeholder="Company name.."
                          className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
                        />

                        {errors.name && touched.name && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <Field
                          id="slug"
                          type="text"
                          name="slug"
                          placeholder="Company URL.."
                          className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
                        />

                        {errors.slug && touched.slug && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.slug}
                          </p>
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
                          placeholder="Company description..."
                          className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
                        />
                        {errors.description && touched.description && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.description}
                          </p>
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
                            <p className="mt-2 text-sm text-red-600">
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

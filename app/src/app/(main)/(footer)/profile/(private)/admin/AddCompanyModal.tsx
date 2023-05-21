"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { object, string } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button, Modal } from "@/components/ui";

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
    name: string;
    description: string;
  }

  const initialValues: FormValues = {
    name: "",
    description: "",
  };

  const validationSchema = object({
    name: string()
      .min(3, "Must be at least 3 characters")
      .required("Name is Required"),
    description: string()
      .min(3, "Must be at least 3 characters")
      .required("Description is Required"),
  });

  const generateSlug = (name: string) => {
    return name
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
  };

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.rpc("create_company", {
      slug: generateSlug(values.name),
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
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} button="Create Company">
      <div className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
        Create production company
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
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-600 dark:text-slate-300"
              >
                Company Name
              </label>
              <Field
                id="name"
                type="text"
                name="name"
                placeholder="Name.."
                className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
              />

              {errors.name && touched.name && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-600 dark:text-slate-300"
              >
                Company Description
              </label>
              <Field
                component="textarea"
                id="description"
                type="text"
                rows={3}
                name="description"
                placeholder="Description..."
                className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
              />
              {errors.description && touched.description && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="mb-6">
              <Button variant="secondary" display="block" type="submit">
                Create
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

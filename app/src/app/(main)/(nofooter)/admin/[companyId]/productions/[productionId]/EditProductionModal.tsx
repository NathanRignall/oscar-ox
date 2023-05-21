"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { object, string } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button, Modal } from "@/components/ui";

type EditProductionModalProps = {
  productionId: string;
  title: string;
  description: string;
  is_published: boolean;
};

export const EditProductionModal = ({
  productionId,
  title,
  description,
  is_published,
}: EditProductionModalProps) => {
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
    is_published: boolean;
  }

  const initialValues: FormValues = {
    title: title,
    description: description,
    is_published: is_published,
  };

  const validationSchema = object({
    title: string()
      .min(3, "Must be at least 3 characters")
      .required("Title is Required"),
    description: string(),
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase
      .from("productions")
      .update({
        title: values.title,
        description: values.description,
        is_published: values.is_published,
      })
      .match({ id: productionId });

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
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
        Edit production
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
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                Production Title
              </label>
              <Field
                id="title"
                type="text"
                name="title"
                placeholder="Title..."
                className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
              />

              {errors.title && touched.title && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">{errors.title}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                Production Description
              </label>
              <Field
                component="textarea"
                id="description"
                type="text"
                rows={4}
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

            <div className="mb-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <Field
                  id="is_published"
                  type="checkbox"
                  name="is_published"
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800 dark:peer-checked:bg-slate-400"></div>
              <span className="ml-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                  Published
                </span>
              </label>
            </div>

            <div className="mb-6">
              <Button variant="secondary" display="block" type="submit">
                Save
              </Button>

              <div className="text-center">
                {formError ? (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-300">{formError}</p>
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

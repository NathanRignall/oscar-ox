"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { object, string } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button, Modal } from "@/components/ui";

type EditProductionModalProps = {
  productionId: string;
  title?: string | null;
  description?: string | null;
  is_published?: boolean | null;
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
    title: title || "",
    description: description || "",
    is_published: is_published || false,
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
      .update({ title: values.title, description: values.description })
      .match({ id: productionId });

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
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="text-3xl text-slate-900 font-bold mb-8">
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
              <Field
                id="title"
                type="text"
                name="title"
                placeholder="Title..."
                className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
              />

              {errors.title && touched.title ? (
                <p className="mt-2 text-sm text-slate-600">{errors.title}</p>
              ) : (
                <div className="mt-2 h-5" />
              )}
            </div>

            <div className="mb-4">
              <Field
                component="textarea"
                id="description"
                type="text"
                rows={4}
                name="description"
                autoComplete="description"
                placeholder="Description..."
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

            <label className="relative inline-flex items-center mb-10 cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800"></div>
              <span className="ml-3 text-md font-medium text-slate-900">
                Published
              </span>
            </label>

            <div className="mb-6">
              <Button variant="secondary" display="block" type="submit">
                Save
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

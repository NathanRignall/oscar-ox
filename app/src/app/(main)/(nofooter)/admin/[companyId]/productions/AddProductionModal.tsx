"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { object, string } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button, Modal } from "@/components/ui";

type AddProductionModalProps = {
  company_id: string;
};

export const AddProductionModal = ({ company_id }: AddProductionModalProps) => {
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
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} button="Add Production">
      <div className="text-3xl text-slate-900 font-bold mb-6">
        Add Production
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
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                Company Title
              </label>
              <Field
                id="title"
                type="text"
                name="title"
                placeholder="Title.."
                className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
              />

              {errors.title && touched.title && (
                <p className="mt-2 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-600"
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
                className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
              />
              {errors.description && touched.description && (
                <p className="mt-2 text-sm text-red-600">
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
                  <p className="mt-2 text-sm text-red-600">{formError}</p>
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

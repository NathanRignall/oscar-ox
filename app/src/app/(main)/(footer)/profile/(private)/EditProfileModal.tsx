"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { object, string } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button, Modal } from "@/components/ui";

type EditProfileModalProps = {
  name?: string | null;
  biography?: string | null;
};

export const EditProfileModal = ({
  name,
  biography,
}: EditProfileModalProps) => {
  const { supabase, session } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  interface FormValues {
    biography: string;
  }

  const initialValues: FormValues = {
    biography: biography || "",
  };

  const validationSchema = object({
    biography: string(),
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase
      .from("profiles")
      .update({ biography: values.biography })
      .match({ id: session?.user?.id });

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
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="sm" className="ml-2">
      <div className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
        Edit Biography
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
                htmlFor="biography"
                className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                Personal Biography
              </label>
              <Field
                component="textarea"
                id="biography"
                type="text"
                rows={1}
                name="biography"
                placeholder="Biography..."
                className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
              />

              {errors.biography && touched.biography && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                  {errors.biography}
                </p>
              )}
            </div>

            <div>
              <Button
                className="mb-6"
                variant="secondary"
                display="block"
                type="submit"
              >
                Save
              </Button>

              <div className="text-center">
                {formError ? (
                  <p className="mt-2 text-sm text-red-600 darl:text-red-300">
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

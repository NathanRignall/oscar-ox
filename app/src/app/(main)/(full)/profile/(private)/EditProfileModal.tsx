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
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="sm">
      <div className="text-3xl text-slate-900 font-bold mb-6">
        Edit Biography
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
                component="textarea"
                id="biography"
                type="text"
                rows={1}
                name="biography"
                autoComplete="biography"
                placeholder="Your personal biography..."
                className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
              />

              {errors.biography && touched.biography && (
                <p className="mt-2 text-sm text-red-600">
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
    </Modal>
  );
};

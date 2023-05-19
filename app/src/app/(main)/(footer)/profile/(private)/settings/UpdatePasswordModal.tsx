"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { object, string, ref } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button, Modal } from "@/components/ui";

export const UpdatePasswordModal = () => {
  const { supabase } = useSupabase();

  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  interface FormValues {
    newPassword: string;
    confirmPassword: string;
  }

  const initialValues: FormValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = object({
    newPassword: string().required("Password is required"),
    confirmPassword: string()
      .required("Password is required")
      .oneOf([ref("newPassword")], "Passwords must match"),
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.auth.updateUser({
      password: values.newPassword,
    });

    if (error) {
      setFormError(error.message);
    } else {
      toggleModal();
      setFormError(null);
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} button="Update Password">
      <div className="text-3xl text-slate-900 font-bold mb-8">
        Update Password
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
                id="newPassword"
                type="password"
                name="newPassword"
                autoComplete="new-password"
                placeholder="New Password..."
                className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
              />

              {errors.newPassword && touched.newPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div className="mb-4">
              <Field
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Confirm Password..."
                className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
              />

              {errors.confirmPassword && touched.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              className="mb-6"
              variant="secondary"
              display="block"
              type="submit"
            >
              Update Password
            </Button>

            <div className="text-center">
              {formError ? (
                <p className="mt-2 text-sm text-red-600">{formError}</p>
              ) : (
                <div className="mt-2 h-5" />
              )}
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

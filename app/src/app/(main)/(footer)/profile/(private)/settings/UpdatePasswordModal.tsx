"use client";

import { useState } from "react";
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
      <div className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
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
              <label
                htmlFor="newPassword"
                className="block mb-2 text-sm font-medium text-gray-600 dark:text-slate-300"
              >
                New Password
              </label>
              <Field
                id="newPassword"
                type="password"
                name="newPassword"
                autoComplete="new-password"
                placeholder="Password..."
                className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
              />

              {errors.newPassword && touched.newPassword && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-sm font-medium text-gray-600 dark:text-slate-300"
              >
                Confirm Password
              </label>
              <Field
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Password..."
                className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
              />

              {errors.confirmPassword && touched.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
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
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                  {formError}
                </p>
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

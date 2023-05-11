"use client";

import Link from "next/link";
import { useState } from "react";
import { useSupabase } from "@/components/client";
import { object, string, ref } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button } from "@/components/ui";

type EmailLoginFormProps = {
  complete: () => void;
};

const EmailLoginForm = ({ complete }: EmailLoginFormProps) => {
  const { supabase } = useSupabase();

  const [formError, setFormError] = useState<string | null>(null);

  interface FormValues {
    newPassword: string;
    confirmPassword: string
  }

  const initialValues: FormValues = {
    newPassword: "",
    confirmPassword: ""
  };

  const validationSchema = object({
    newPassword: string().required("Password is required"),
    confirmPassword: string().required("Password is required").oneOf([ref('newPassword')], 'Passwords must match')
  });

  const onSubmit = async (
    values: FormValues,
  ) => {
    const { error } = await supabase.auth.updateUser({ password: values.newPassword })

    if (error) {
      setFormError(error.message);
    } else {
      complete();
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, submitForm }: FormikProps<FormValues>) => (
        <Form className="h-64 w-full max-w-lg">
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
              <p className="mt-2 text-sm text-slate-600">{errors.newPassword}</p>
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
              <p className="mt-2 text-sm text-slate-600">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            className="mb-6"
            variant="secondary"
            display="block"
            onClick={submitForm}
          >
            Update Password
          </Button>

          <div className="text-center">
            {formError ? (
              <p className="mt-2 text-sm text-slate-600">{formError}</p>
            ) : (
              <div className="mt-2 h-5" />
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default function Register() {
  const [complete, setComplete] = useState<boolean>(false);

  const finalComplete = (): void => {
    setComplete(true);
  };

  const retryComplete = (): void => {
    setComplete(false);
  };

  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center pt-12 pb-16">
        <div className="mb-2.5 text-5xl font-bold text-slate-900 ">
          <Link href="/">Oscar Ox</Link>
        </div>
        <div className="mb-8 text-lg font-medium text-slate-600 ">
          Authenticate
        </div>

        {!complete ? (
          <EmailLoginForm complete={finalComplete} />
        ) : (
          <div className="h-64 w-full max-w-sm text-center ">
            <div className="text-2xl">Check your email for Magic Link</div>
            <div className="mt-10 text-lg font-medium">
              No email?{" "}
              <div
                className="inline cursor-pointer underline hover:text-slate-700"
                onClick={retryComplete}
              >
                Retry
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center">
        <div className="text-lg font-medium ">
          <Link href="/register" className="underline hover:text-slate-700">
            Privacy Policy
          </Link>
        </div>
      </div>
    </>
  );
}

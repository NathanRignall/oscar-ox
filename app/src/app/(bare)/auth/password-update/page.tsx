"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { object, string, ref } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button } from "@/components/ui";

type EmailLoginFormProps = {
  complete: () => void;
};

const EmailLoginForm = ({ complete }: EmailLoginFormProps) => {
  const router = useRouter();
  const { supabase, session } = useSupabase();

  const [formError, setFormError] = useState<string | null>(null);

  // wait 1 seconds before redirecting to login if no session
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!session) {
        router.push("/auth/login");
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [router, session]);

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
      complete();
      setFormError(null);
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
              className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
              />

            {errors.newPassword && touched.newPassword && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-300">{errors.newPassword}</p>
            )}
          </div>

          <div className="mb-4">
            <Field
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Confirm Password..."
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
            onClick={submitForm}
            disabled={session === null}
          >
            Update Password
          </Button>

          <div className="text-center">
            {formError ? (
              <p className="mt-2 text-sm text-red-600 dark:text-red-300">{formError}</p>
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
        <div className="mb-2.5 text-5xl font-bold text-slate-900 dark:text-white">
          <Link href="/">Oscar Ox</Link>
        </div>
        <div className="mb-8 text-lg font-medium text-slate-600 dark:text-slate-300">
          Authenticate
        </div>

        {!complete ? (
          <EmailLoginForm complete={finalComplete} />
        ) : (
          <div className="h-64 w-full max-w-sm text-center text-slate-900 dark:text-white">
            <div className="text-2xl">Check your email for Magic Link</div>
            <div className="mt-10 text-lg font-medium">
              No email?{" "}
              <div
                className="inline cursor-pointer underline hover:text-slate-700 dark:hover:text-slate-300"
                onClick={retryComplete}
              >
                Retry
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center">
        <div className="text-lg font-medium text-slate-900 dark:text-white">
          No Account?{" "}
          <Link
            href="/auth/register"
            className="underline hover:text-slate-700 dark:hover:text-slate-300"
          >
            Register
          </Link>
        </div>
      </div>
    </>
  );
}

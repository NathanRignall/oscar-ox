"use client";

import Link from "next/link";
import { useState } from "react";

import { useSupabase } from "@/components/client";

import { object, string } from "yup";
import { FormikProps, FormikHelpers, Formik, Field, Form } from "formik";

import { Button } from "@/components/ui";

type EmailLoginFormProps = {
  complete: () => void;
};

const EmailLoginForm = ({ complete }: EmailLoginFormProps) => {
  const { supabase, session } = useSupabase();

  interface FormValues {
    name: string;
    email: string;
    password: string;
  }

  const initialValues: FormValues = {
    name: "",
    email: "",
    password: "",
  };

  const validationSchema = object({
    name: string()
      .min(3, "Must be at least 3 characters")
      .required("Name is Required"),
    email: string().email("Invalid email").required("Email is required"),
    password: string().required("Password is required"),
  });

  const onSubmit = async (
    values: FormValues,
    helpers: FormikHelpers<FormValues>
  ) => {
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { name: values.name } },
    });

    if (error) {
      helpers.setErrors({ email: error.message });
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
        <Form className="h-64 w-full max-w-sm">
          <div className="mb-2">
            <Field
              id="name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Full Name"
              className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-lg text-center text-slate-900 placeholder-slate-600"
            />
          </div>

          <div className="mb-2">
            <Field
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email Address"
              className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-lg text-center text-slate-900 placeholder-slate-600"
            />
          </div>

          <div className="mb-4">
            <Field
              id="password"
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Password"
              className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-lg text-center text-slate-900 placeholder-slate-600"
            />
          </div>

          <Button
            className="mb-6"
            variant="secondary"
            display="block"
            onClick={submitForm}
          >
            Register
          </Button>

          <div className="h-32 text-center">
            {touched.email && errors.email && <div>{errors.email}</div>}

            {touched.password && errors.password && (
              <div>{errors.password}</div>
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
            <div className="text-2xl">Check your email for login link</div>
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

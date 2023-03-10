"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { object, string } from "yup";
import { FormikProps, FormikHelpers, Formik, Field, Form } from "formik";
import { useSupabase } from "@/components/client";
import { Button } from "@/components/ui";

const EmailLoginForm = () => {
  const router = useRouter();
  const { supabase, session } = useSupabase();

  interface FormValues {
    email: string;
    password: string;
  }

  const initialValues: FormValues = {
    email: "",
    password: "",
  };

  const validationSchema = object({
    email: string().email("Invalid email").required("Email is required"),
    password: string().required("Password is required"),
  });

  const onSubmit = async (
    values: FormValues,
    helpers: FormikHelpers<FormValues>
  ) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      helpers.setErrors({ email: error.message });
    } else {
      router.push("/account");
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
              autoComplete="current-password"
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
            Login
          </Button>

          <div className="h-32 text-center text-slate-600">
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

export default function Login() {
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center pt-12 pb-16">
        <div className="mb-2.5 text-5xl font-bold text-slate-900 ">
          Oscar Ox
        </div>
        <div className="mb-8 text-lg font-medium text-slate-600 ">
          Authenticate
        </div>
        <EmailLoginForm />
      </div>

      <div className="flex items-center justify-center">
        <div className="text-lg font-medium ">
          No Account?{" "}
          <Link href="/register" className="underline hover:text-slate-700">
            Register
          </Link>
        </div>
      </div>
    </>
  );
}

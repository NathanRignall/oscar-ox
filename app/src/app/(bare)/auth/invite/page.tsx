"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { object, string } from "yup";
import { FormikProps, FormikHelpers, Formik, Field, Form } from "formik";
import { Button } from "@/components/ui";

const InviteCompleteForm = () => {
  const router = useRouter();
  const { supabase, session } = useSupabase();

  interface FormValues {
    password: string;
  }

  const initialValues: FormValues = {
    password: "",
  };

  const validationSchema = object({
    password: string().required("Password is required"),
  });

  const onSubmit = async (
    values: FormValues,
    helpers: FormikHelpers<FormValues>
  ) => {
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      helpers.setErrors({ password: error.message });
    } else {
      router.push("/");
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
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              value={session?.user.email || ""}
              placeholder="Email Address"
              className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-lg text-center text-slate-900 placeholder-slate-600 disabled:text-slate-300"
              disabled
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
            Complete
          </Button>

          <div className="h-32 text-center">
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
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center pt-12 pb-16">
        <div className="mb-2.5 text-5xl font-bold text-slate-900 ">
          <Link href="/">Oscar Ox</Link>
        </div>
        <div className="mb-8 text-lg font-medium text-slate-600 ">
          Authenticate
        </div>
        <InviteCompleteForm />
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

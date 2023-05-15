"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { object, string } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { useSupabase } from "@/components/client";
import { Button } from "@/components/ui";

type MagicLoginFormProps = {
  setIsMagicLogin: (isMagicLogin: boolean) => void;
  setEmail: (email: string) => void;
  email: string;
  setIsComplete: (isComplete: boolean) => void;
};

const MagicLoginForm = ({ setIsMagicLogin, setEmail, email, setIsComplete }: MagicLoginFormProps) => {
  const { supabase } = useSupabase();

  const [formError, setFormError] = useState<string | null>(null);

  interface FormValues {
    email: string;
  }

  const initialValues: FormValues = {
    email: email,
  };

  const validationSchema = object({
    email: string().email("Invalid email").required("Email is required"),
  });

  const onSubmit = async (
    values: FormValues,
  ) => {
    console.log(values);
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
    });

    if (error) {
      if (error.message.includes("violates not-null constraint")) {
        setFormError("Email is not registered");
      } else {
        setFormError(error.message);
      }
    } else {
      setIsComplete(true);
    }
  };


  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, submitForm, values }: FormikProps<FormValues>) => {
        const onPasswordLogin = () => {
          setEmail(values.email);
          setIsMagicLogin(false);
        }

        return (
          <Form className="h-64 w-full max-w-lg">
            <div className="mb-4">
              <Field
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Email Address"
                className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
              />

              {errors.email && touched.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="flex mb-4 space-x-2">
              <Button
                variant="primary"
                display="block"
                onClick={onPasswordLogin}
              >
                Login with Password
              </Button>

              <Button
                variant="secondary"
                display="block"
                type="submit"
              >
                Send Magic Link
              </Button>
            </div>


            <div className="text-center">
              {formError ? (
                <p className="mt-2 text-sm text-red-600">{formError}</p>
              ) : (
                <div className="mt-2 h-5" />
              )}
            </div>
          </Form>
        )
      }}
    </Formik>
  );
};

type PasswordLoginFormProps = {
  setIsMagicLogin: (isMagicLogin: boolean) => void;
  setEmail: (email: string) => void;
  email: string;
};

const PasswordLoginForm = ({ setIsMagicLogin, setEmail, email }: PasswordLoginFormProps) => {
  const router = useRouter();
  const { supabase } = useSupabase();

  const [formError, setFormError] = useState<string | null>(null);

  interface FormValues {
    email: string;
    password: string;
  }

  const initialValues: FormValues = {
    email: email,
    password: "",
  };

  const validationSchema = object({
    email: string().email("Invalid email").required("Email is required"),
    password: string().required("Password is required"),
  });

  const onSubmit = async (
    values: FormValues,
  ) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setFormError(error.message);
    } else {
      router.push("/profile");
      setFormError(null);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, submitForm, values }: FormikProps<FormValues>) => {
        const onMagicLogin = () => {
          setEmail(values.email);
          setIsMagicLogin(true);
        }

        return (
          <Form className="h-64 w-full max-w-lg relative">
            <div className="absolute top-0 left-0 -translate-y-12">
              <Button onClick={onMagicLogin} variant="primary" size="sm">
                Back
              </Button>
            </div>

            <div className="mb-4">
              <Field
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Email Address"
                className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
              />

              {errors.email && touched.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="mb-4">
              <Field
                id="password"
                type="password"
                name="password"
                autoComplete="password"
                placeholder="Password"
                className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
              />

              {errors.password && touched.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex mb-4">
              <Button
                variant="secondary"
                display="block"
                onClick={submitForm}
              >
                Login with Password
              </Button>
            </div>


            <div className="text-center">
              <div className="text-sm font-medium ">
                Forgot Password?{" "}
                <Link
                  href="/auth/password-reset"
                  className="underline hover:text-slate-700"
                >
                  Reset
                </Link>
              </div>
              {formError && (
                <p className="mt-2 text-sm text-red-600">{formError}</p>
              )}
            </div>
          </Form>
        )
      }}
    </Formik>
  );
};

export default function Login() {
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isMagicLogin, setIsMagicLogin] = useState(true);
  const [email, setEmail] = useState("");

  const retryComplete = (): void => {
    setIsComplete(false);
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
        {!isComplete ? (
          isMagicLogin ? (
            <MagicLoginForm setIsMagicLogin={setIsMagicLogin} setEmail={setEmail} email={email} setIsComplete={setIsComplete} />
          ) : (
            <PasswordLoginForm setIsMagicLogin={setIsMagicLogin} setEmail={setEmail} email={email} />
          )) : (<div className="h-64 w-full max-w-sm text-center ">
            <div className="text-2xl">Check email for Magic Link</div>
            <div className="mt-10 text-lg font-medium">
              No email?{" "}
              <div
                className="inline cursor-pointer underline hover:text-slate-700"
                onClick={retryComplete}
              >
                Retry
              </div>
            </div>
          </div>)}

      </div>

      <div className="flex items-center justify-center">
        <div className="text-lg font-medium ">
          No Account?{" "}
          <Link
            href="/auth/register"
            className="underline hover:text-slate-700"
          >
            Register
          </Link>
        </div>
      </div>
    </>
  );
}

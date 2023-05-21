"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase, AutoCompleteEmail } from "@/components/client";
import { object, string } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button } from "@/components/ui";

type CompanyBranding = {
  id: string;
  name: string;
  description: string;
  slug: string;
  main_colour: string;
  is_public: boolean;
};

export type EditCompanyFormProps = {
  company: CompanyBranding;
};

export const EditCompanyForm = ({ company }: EditCompanyFormProps) => {
  const { supabase } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formError, setFormError] = useState<string | null>(null);

  interface FormValues {
    slug: string;
    name: string;
    description: string;
    main_colour: string;
    is_public: boolean;
  }

  const initialValues: FormValues = {
    slug: company.slug,
    name: company.name,
    description: company.description,
    main_colour: company.main_colour,
    is_public: company.is_public,
  };

  const validationSchema = object({
    // slug must be number or lowercase letters or hyphen
    slug: string()
      .matches(/^[a-z0-9-]+$/, "Must be lowercase letters, numbers, or hyphen")
      .required("Slug is Required"),
    name: string()
      .min(3, "Must be at least 3 characters")
      .required("Name is Required"),
    description: string()
      .min(3, "Must be at least 3 characters")
      .required("Description is Required"),
    main_colour: string().required("Main Colour is Required"),
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.rpc("update_company", {
      id: company.id,
      slug: values.slug,
      name: values.name,
      description: values.description,
      main_colour: values.main_colour,
      is_public: values.is_public,
    });

    if (error) {
      setFormError(error.message);
    } else {
      setFormError(null);

      startTransition(() => {
        router.refresh();
      });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }: FormikProps<FormValues>) => (
        <Form>
          <div className="sm:flex sm:space-x-2 w-full mb-4">
            <div className="grow">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-600 dark:text-slate-300"
              >
                Company Name
              </label>
              <Field
                id="name"
                type="text"
                name="name"
                placeholder="Company Name..."
                className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
              />

              {errors.name && touched.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div className="grow">
              <label
                htmlFor="slug"
                className="block mb-2 text-sm font-medium text-gray-600 dark:text-slate-300"
              >
                Slug
              </label>
              <Field
                id="slug"
                type="text"
                name="slug"
                placeholder="Slug..."
                className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
              />
              {errors.slug && touched.slug && (
                <p className="mt-2 text-sm text-red-600">{errors.slug}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-slate-300"
            >
              Description
            </label>
            <Field
              component="textarea"
              id="description"
              type="text"
              rows={2}
              name="description"
              placeholder="Description..."
              className="relative block w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
            />
            {errors.description && touched.description && (
              <p className="mt-2 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="main_colour"
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-slate-300"
            >
              Main Colour
            </label>
            <Field
              id="main_colour"
              type="text"
              name="main_colour"
              placeholder="Company main_colour..."
              className="relative block rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
            />
            {errors.main_colour && touched.main_colour && (
              <p className="mt-2 text-sm text-red-600">{errors.main_colour}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <Field
                id="is_public"
                type="checkbox"
                name="is_public"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800 dark:peer-checked:bg-slate-400"></div>
              <span className="ml-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                Public
              </span>
            </label>
          </div>

          <div className="mb-6">
            <Button variant="secondary" type="submit">
              Save
            </Button>

            <div className="text-center">
              {formError ? (
                <p className="mt-2 text-sm text-red-600">{formError}</p>
              ) : (
                <div className="mt-2 h-5" />
              )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

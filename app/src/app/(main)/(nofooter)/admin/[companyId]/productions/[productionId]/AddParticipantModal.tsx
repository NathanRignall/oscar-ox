"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase, AutoCompleteEmail } from "@/components/client";
import { getArray } from "@/lib/supabase-type-convert";
import { object, string, boolean } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button, Modal } from "@/components/ui";

type Category = {
  id: string;
  title: string;
};

type AddParticipantModalProps = {
  productionId: string;
};

export const AddParticipantModal = ({
  productionId,
}: AddParticipantModalProps) => {
  const { supabase } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  // load the list of categories from the database
  useEffect(() => {
    const getCategories = async () => {
      const { data: _categories } = await supabase
        .from("categories")
        .select(`id, title`);

      const categories = getArray(_categories);

      setCategories(categories);
    };

    getCategories();
  }, [supabase]);

  interface FormValues {
    isInvite: boolean;
    title: string;
    profileId: string;
    categoryId: string;
    givenName: string;
    familyName: string;
    email: string;
  }

  const initialValues: FormValues = {
    isInvite: false,
    title: "",
    profileId: "",
    categoryId: "",
    givenName: "",
    familyName: "",
    email: "",
  };

  const validationSchema = object({
    isInvite: boolean(),
    title: string().required("Title is required"),
    categoryId: string().required("Category is required"),
    profileId: string().when("isInvite", {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("Valid person is required"),
    }),
    givenName: string().when("isInvite", {
      is: true,
      then: (schema) => schema.required("Given name is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    familyName: string().when("isInvite", {
      is: true,
      then: (schema) => schema.required("Family name is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    email: string().when("isInvite", {
      is: true,
      then: (schema) => schema.required("Email is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const onSubmit = async (values: FormValues) => {
    if (values.isInvite) {
      const { error } = await supabase.functions.invoke("invite-add-user", {
        body: JSON.stringify({
          user: {
            email: values.email,
            given_name: values.givenName,
            family_name: values.familyName,
          },
          participant: {
            production_id: productionId,
            category_id: values.categoryId,
            title: values.title,
          },
        }),
      });

      if (error) {
        setFormError(error.message);
      } else {
        toggleModal();
        setFormError(null);

        startTransition(() => {
          router.refresh();
        });
      }
    } else {
      const { error } = await supabase.from("participants").insert({
        profile_id: values.profileId,
        production_id: productionId,
        category_id: values.categoryId,
        title: values.title,
      });

      if (error) {
        setFormError(error.message);
      } else {
        toggleModal();
        setFormError(null);

        startTransition(() => {
          router.refresh();
        });
      }
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} button="Add Participant">
      <div className="text-3xl text-slate-900 font-bold mb-6">
        Add Participant
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, values }: FormikProps<FormValues>) => (
          <Form>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                Role Title
              </label>
              <Field
                id="title"
                type="text"
                name="title"
                placeholder="Title.."
                className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
              />

              {errors.title && touched.title && (
                <p className="mt-2 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {values.isInvite ? (
              <>
                <div className="flex space-x-2 w-full mb-4">
                  <div className="grow">
                    <label
                      htmlFor="givenName"
                      className="block mb-2 text-sm font-medium text-gray-600"
                    >
                      First Name
                    </label>
                    <Field
                      id="givenName"
                      type="text"
                      name="givenName"
                      placeholder="First Name..."
                      className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
                    />

                    {errors.givenName && touched.givenName && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.givenName}
                      </p>
                    )}
                  </div>

                  <div className="grow">
                    <label
                      htmlFor="familyName"
                      className="block mb-2 text-sm font-medium text-gray-600"
                    >
                      Last Name
                    </label>
                    <Field
                      id="familyName"
                      type="text"
                      name="familyName"
                      placeholder="Last Name..."
                      className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
                    />

                    {errors.familyName && touched.familyName && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.familyName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-600"
                  >
                    Email
                  </label>
                  <Field
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Email Address..."
                    className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
                  />

                  {errors.email && touched.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </>
            ) : (
              <div className="mb-4">
                <AutoCompleteEmail />

                {errors.profileId && touched.profileId && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.profileId}
                  </p>
                )}
              </div>
            )}

            <div className="mb-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <Field
                  id="isInvite"
                  type="checkbox"
                  name="isInvite"
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800"></div>
                <span className="ml-3 text-sm font-medium text-slate-600">
                  Invite
                </span>
              </label>
            </div>

            <div className="mb-4">
              <Field as="select" name="categoryId">
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </Field>

              {errors.categoryId && touched.categoryId && (
                <p className="mt-2 text-sm text-red-600">{errors.categoryId}</p>
              )}
            </div>

            <div className="mb-6">
              <Button variant="secondary" display="block" type="submit">
                {values.isInvite ? "Invite + Add" : "Add"}
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
    </Modal>
  );
};

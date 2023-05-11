"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase, AutoCompleteEmail } from "@/components/client";
import { getArray } from "@/lib/supabase-type-convert";
import { object, string } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button, Modal } from "@/components/ui";

type Category = {
  id: string;
  title: string;
};

type Participant = {
  id: string;
  profile: {
    id: string;
    given_name: string;
    family_name: string;
    email: string;
  },
  category: {
    id: string;
    title: string;
  },
  title: string;
};

type EditParticipantModalProps = {
  participant: Participant;
};

export const EditParticipantModal = ({
  participant,
}: EditParticipantModalProps) => {
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
    title: string;
    profileId: string;
    categoryId: string;
  }

  const initialValues: FormValues = {
    title: participant.title,
    profileId: participant.profile.id,
    categoryId: participant.category.id,
  };

  const validationSchema = object({
    title: string().required("Title is required"),
    profileId: string().required("Valid venue is required"),
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.from("participants").update({
      title: values.title,
      profile_id: values.profileId,
      category_id: values.categoryId,
    }).match({ id: participant.id });

    if (error) {
      setFormError(error.message);
    } else {
      toggleModal();

      startTransition(() => {
        router.refresh();
      });
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} button="Edit" buttonSize="sm">
      <div className="text-3xl text-slate-900 font-bold mb-8">
        Edit Participant
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          errors,
          touched,
          values,
          setFieldValue,
        }: FormikProps<FormValues>) => (
          <Form>
            <div className="mb-4">
              <AutoCompleteEmail initialSearch={`${participant.profile.given_name} ${participant.profile.family_name}`} />

              {errors.profileId && touched.profileId ? (
                <p className="mt-2 text-sm text-slate-600">
                  {errors.profileId}
                </p>
              ) : (
                <div className="mt-2 h-5" />
              )}
            </div>

            <div className="mb-4">
              <Field
                id="title"
                type="text"
                name="title"
                autoComplete="title"
                placeholder="Title.."
                className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
              />

              {errors.title && touched.title ? (
                <p className="mt-2 text-sm text-slate-600">{errors.title}</p>
              ) : (
                <div className="mt-2 h-5" />
              )}
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

              {errors.categoryId && touched.categoryId ? (
                <p className="mt-2 text-sm text-slate-600">
                  {errors.categoryId}
                </p>
              ) : (
                <div className="mt-2 h-5" />
              )}
            </div>

            <div className="mb-6">
              <Button variant="secondary" display="block" type="submit">
                Save
              </Button>

              <div className="text-center">
                {formError ? (
                  <p className="mt-2 text-sm text-slate-600">{formError}</p>
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

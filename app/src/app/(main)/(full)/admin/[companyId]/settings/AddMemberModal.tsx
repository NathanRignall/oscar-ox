"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase, AutoCompleteEmail } from "@/components/client";
import { object, string } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button, Modal } from "@/components/ui";

type AddMemberModalProps = {
  companyId: string;
};

export const AddMemberModal = ({ companyId }: AddMemberModalProps) => {
  const { supabase } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  interface FormValues {
    profileId: string;
    role: "admin" | "moderator";
  }

  const initialValues: FormValues = {
    profileId: "",
    role: "admin",
  };

  const validationSchema = object({
    profileId: string().required("Vaid user is required"),
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.from("company_members").insert({
      company_id: companyId,
      profile_id: values.profileId,
      role: values.role,
    });

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
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} button="Add Member">
      <div className="text-3xl text-slate-900 font-bold mb-8">Add Member</div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched }: FormikProps<FormValues>) => (
          <Form>
            <div className="mb-4">
              <AutoCompleteEmail />

              {errors.profileId && touched.profileId ? (
                <p className="mt-2 text-sm text-slate-600">
                  {errors.profileId}
                </p>
              ) : (
                <div className="mt-2 h-5" />
              )}
            </div>

            <div className="mb-6">
              <Field as="select" name="role">
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </Field>
            </div>

            <div className="mb-6">
              <Button variant="secondary" display="block" type="submit">
                Create
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

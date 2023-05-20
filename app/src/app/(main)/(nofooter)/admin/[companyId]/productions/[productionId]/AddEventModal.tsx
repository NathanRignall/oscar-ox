"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { object, string, date } from "yup";
import { FormikProps, Formik, Form } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Modal } from "@/components/ui";
import AutoCompleteVenue from "./AutoCompleteVenue";

type AddEventModalProps = {
  productionId: string;
};

export const AddEventModal = ({ productionId }: AddEventModalProps) => {
  const { supabase, session } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  interface FormValues {
    venueId: string;
    datetime: Date;
  }

  const initialValues: FormValues = {
    venueId: "",
    datetime: new Date(),
  };

  const validationSchema = object({
    venueId: string().required("Valid venue is required"),
    datetime: date(),
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.from("events").insert({
      production_id: productionId,
      venue_id: values.venueId,
      start_time: values.datetime.toISOString(),
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
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} button="Add Event">
      <div className="text-3xl text-slate-900 font-bold mb-6">Add Event</div>

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
              <AutoCompleteVenue />

              {errors.venueId && touched.venueId && (
                <p className="mt-2 text-sm text-red-600">{errors.venueId}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="datetime"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                Start Time
              </label>
              <DatePicker
                id="datetime"
                name="datetime"
                selected={values.datetime}
                onChange={(datetime) => setFieldValue("datetime", datetime)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MM/dd/yyyy HH:mm"
                className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
              />

              {errors.datetime && touched.datetime && (
                <p className="mt-2 text-sm text-red-600">null</p>
              )}
            </div>

            <div className="mb-6">
              <Button variant="secondary" display="block" type="submit">
                Create
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

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { object, string, date } from "yup";
import { FormikProps, Formik, Form } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui";
import Autocomplete from "./Auto";

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

      startTransition(() => {
        router.refresh();
      });
    }
  };

  return (
    <>
      <Button onClick={toggleModal}>Add Event</Button>

      {isOpen && (
        <div className="fixed z-30 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-5 px-5 sm:p-0">
            <div className="fixed inset-0 bg-slate-500 opacity-70" />

            <div className="bg-white rounded-lg overflow-hidden z-40 w-full max-w-2xl">
              <div className="px-10 py-8">
                <div className="flex items-end justify-between rounded-t mb-4">
                  <button
                    type="button"
                    className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                    data-modal-hide="defaultModal"
                    onClick={toggleModal}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>

                <div className="text-3xl text-slate-900 font-bold mb-8">
                  Add Event
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
                        <Autocomplete />

                        {errors.venueId && touched.venueId ? (
                          <p className="mt-2 text-sm text-slate-600">
                            {errors.venueId}
                          </p>
                        ) : (
                          <div className="mt-2 h-5" />
                        )}
                      </div>

                      <div className="mb-4">
                        <DatePicker
                          id="datetime"
                          name="datetime"
                          selected={values.datetime}
                          onChange={(datetime) =>
                            setFieldValue("datetime", datetime)
                          }
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="MM/dd/yyyy HH:mm"
                          className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
                        />

                        {errors.datetime && touched.datetime ? (
                          <p className="mt-2 text-sm text-slate-600">
                            null
                          </p>
                        ) : (
                          <div className="mt-2 h-5" />
                        )}
                      </div>

                      <div className="mb-6">
                        <Button
                          variant="secondary"
                          display="block"
                          type="submit"
                        >
                          Create
                        </Button>

                        <div className="text-center">
                          {formError ? (
                            <p className="mt-2 text-sm text-slate-600">
                              {formError}
                            </p>
                          ) : (
                            <div className="mt-2 h-5" />
                          )}
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

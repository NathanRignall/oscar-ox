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

type Event = {
  id: string;
  venue: {
    id: string;
    title: string;
  },
  start_time: string;
  end_time: string | null;
  ticket_link: string | null;
};

type EditEventModalProps = {
  event: Event;
};

export const EditEventModal = ({ event }: EditEventModalProps) => {
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
    start_time: Date;
    end_time: Date;
    ticket_link: string;
  }

  const initialValues: FormValues = {
    venueId: event.venue.id,
    start_time: new Date(event.start_time),
    end_time: new Date(event.end_time || ""),
    ticket_link: event.ticket_link || "",
  };

  const validationSchema = object({
    venueId: string().required("Valid venue is required"),
    start_time: date().required("Valid start time is required"),
    end_time: date(),
    ticket_link: string(),
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.from("events").update({
      venue_id: values.venueId,
      start_time: values.start_time.toISOString(),
      end_time: values.end_time.toISOString(),
    })
      .match({ id: event.id });

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
      <div className="text-3xl text-slate-900 font-bold mb-8">Edit Event</div>

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
              <AutoCompleteVenue initialSearch={event.venue.title}/>

              {errors.venueId && touched.venueId && (
                <p className="mt-2 text-sm text-red-600">{errors.venueId}</p>
              )}
            </div>

            <div className="mb-4">
              <DatePicker
                id="datetime"
                name="datetime"
                selected={values.start_time}
                onChange={(start_time) => setFieldValue("start_time", start_time)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MM/dd/yyyy HH:mm"
                className="relative block w-full rounded-md border-2 border-slate-200 px-4 py-3 text-md text-slate-900 placeholder-slate-400"
              />

              {errors.start_time && touched.start_time && (
                <p className="mt-2 text-sm text-red-600">null</p>
              )}
            </div>

            <div className="mb-6">
              <Button variant="secondary" display="block" type="submit">
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
    </Modal>
  );
};

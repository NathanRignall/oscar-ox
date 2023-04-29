"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { object, string } from "yup";
import { FormikProps, Formik, Field, Form } from "formik";
import { Button } from "@/components/ui";
import { getArray } from "@/lib/supabase-type-convert";

type Category = {
  id: string;
  title: string;
};

type Subscription = {
  profile_id: string;
  category_id: string;
};

export default function OnboardModal() {
  const { supabase, session } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formError, setFormError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

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
    categories: string[];
  }

  const initialValues: FormValues = {
    categories: [],
  };

  const onSubmit = async (values: FormValues) => {

    // check if user is logged in
    if (!session?.user?.id) return;

    // add subscriptions
    const subscriptionsPayload : Subscription[] = [];
    
    values.categories.map((category) => {
      if (category && category.length > 0) {
        subscriptionsPayload.push({
          profile_id: session.user.id,
          category_id: category[0],
        });
      }
    });

    const { error: errorSubscriptions } = await supabase.from("subscriptions").insert(subscriptionsPayload);

    if (errorSubscriptions) {
      setFormError(errorSubscriptions.message);
      return;
    }

    // update user to finished onboarding
    const { error: errorUser } = await supabase.auth.updateUser({
      data: { finished_onboarding: true },
    });

    if (errorUser) {
      setFormError(errorUser.message);
    } else {
      startTransition(() => {
        router.refresh();
      });
    }
  };

  return (
    <div className="fixed z-30 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-5 px-5 sm:p-0">
        <div className="fixed inset-0 bg-slate-500 opacity-70" />

        <div className="bg-white rounded-lg overflow-hidden z-40 w-full max-w-2xl">
          <div className="px-10 py-8">
            <div className="text-3xl text-slate-900 font-bold mb-1">
              Welcome to Oscar Ox!
            </div>
            <p className="text-lg text-slate-600 mb-8">
              Subscribe to vacancy notifications to get emails.
            </p>

            <Formik initialValues={initialValues} onSubmit={onSubmit}>
              {({ errors, touched, submitForm }: FormikProps<FormValues>) => (
                <Form>
                  <div className="grid sm:grid-cols-3 grid-cols-2 gap-x-4 mb-8">
                    {categories.map((category, index) => (
                      <div key={category.id}>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <Field
                            type="checkbox"
                            name={`categories.${index}`}
                            value={category.id}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800"></div>
                          <span className="ml-3 text-md font-medium text-slate-900">
                            {category.title}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Button variant="secondary" display="block" type="submit">
                      Save
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
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui";

type EditProfilePictureModalProps = {
  name?: string | null;
  biography?: string | null;
};

export const EditProfilePictureModal = ({
  name,
  biography,
}: EditProfilePictureModalProps) => {
  const { supabase, session } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [file, setfile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      setfile(null);
    } else {
      setfile(event.target.files[0]);
    }
  };

  const onSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (!file) {
      setError("No file selected");
      return;
    }

    console.log(file.name);

    const filename = `${uuidv4()}-${file.name}`;

    const { data: data1, error: error1 } = await supabase.storage
      .from("profiles")
      .upload(`public/${filename}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    const { data: data2, error: error2 } = await supabase
      .from("profiles")
      .update({ avatar_url: filename })
      .match({ id: session?.user?.id });

    if (error1 || error2) {
      setError(error1?.message || error2?.message || "Error uploading file");
    } else {
      toggleModal();

      // Refresh the page to get the new data
      startTransition(() => {
        router.refresh();
      });
    }
  };
  return (
    <>
      <div className="w-full h-full">
        <button
          type="button"
          className="text-slate-900 bg-white  border-2 border-slate-200 hover:bg-slate-200 hover:border-slate-400 rounded-lg text-sm p-1.5 absolute bottom-2 right-2"
          data-modal-hide="defaultModal"
          onClick={toggleModal}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="fixed z-30 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-5 px-5 sm:p-0">
            <div className="fixed inset-0 bg-slate-500 opacity-70" />

            <div className="bg-white rounded-lg overflow-hidden z-40 w-full max-w-lg">
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
                  Edit profile picture
                </div>
                <form>
                  <div className="mb-8">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          aria-hidden="true"
                          className="w-10 h-10 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={handleFileSelected}
                      />
                    </label>
                  </div>

                  <div className="mb-6">
                    <Button
                      variant="secondary"
                      display="block"
                      // @ts-ignore
                      onClick={onSubmit}
                      type="submit"
                    >
                      Save
                    </Button>

                    <div className="text-center">
                      {error ? (
                        <p className="mt-2 text-sm text-slate-600">{error}</p>
                      ) : (
                        <div className="mt-2 h-5" />
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

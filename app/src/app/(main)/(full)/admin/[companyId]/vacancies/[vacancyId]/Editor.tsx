"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSupabase } from "@/components/client";
import { PublishVacancyModal } from "./PublishVacancyModal";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const MDPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

export type EditorProps = {
  vacancyId: string;
  preview?: boolean;
};

export const Editor = ({ vacancyId, preview = false }: EditorProps) => {
  const [value, setValue] = useState<string | undefined>("**Hello world!!!**");

  const { supabase } = useSupabase();

  useEffect(() => {
    const saveContent = async () => {
      const { data, error } = await supabase
        .from("vacancies")
        .update({ content: value })
        .eq("id", vacancyId);
    };

    saveContent();
  }, [supabase, vacancyId, value]);

  return (
    <>
      {preview ? (
        <div className="px-6 py-4 bg-white rounded-md">
          <MDPreview source={value} />
        </div>
      ) : (
        <div>
          <MDEditor value={value} onChange={setValue} />
          <PublishVacancyModal vacancyId={vacancyId} />
        </div>
      )}
    </>
  );
};

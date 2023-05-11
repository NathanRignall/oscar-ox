"use client";

import { useEffect, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/client";
import { getArray } from "@/lib/supabase-type-convert";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Button, Modal, Tag } from "@/components/ui";

const MDEditor = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

type PublishVacancyModalProps = {
  vacancyId: string;
};

export const PublishVacancyModal = ({
  vacancyId,
}: PublishVacancyModalProps) => {
  const { supabase, session } = useSupabase();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string | null>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const onSubmit = async () => {
    const { data, error } = await supabase
      .from("vacancies")
      .update({ is_published: true })
      .eq("id", vacancyId);

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

  useEffect(() => {
    const loadContent = async () => {
      const { data: _vacancy, error } = await supabase
        .from("vacancies")
        .select(
          `
          title,
          content,
          categories(
            id,
            title
          )
          `
        )
        .eq("id", vacancyId)
        .single();

      if (!_vacancy) return;

      const vacancy = {
        title: _vacancy.title,
        content: _vacancy.content,
        categories: getArray(_vacancy.categories),
      };

      setTitle(vacancy.title);
      setContent(vacancy.content);
      setCategories(vacancy.categories);
      setIsLoading(false);
    };

    loadContent();
  }, [supabase, vacancyId, isOpen]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} button="Publish">
      <div className="text-3xl text-slate-900 font-bold mb-1">
        Publish Vacancy
      </div>

      <p className="text-lg text-slate-600 mb-6">
        You are about to publish this vacancy. Are you sure you want to proceed?
      </p>

      <p className="text-2xl text-slate-900 font-semibold mb-1">{title}</p>

      {categories.length != 0 ? (
        <ul className="flex flex-wrap gap-2 mb-3">
          {categories.map((category) => (
            <li key={category.id}>
              <Tag
                text={category.title}
                href={`/search?category=${encodeURIComponent(category.id)}`}
                variant="secondary"
                size="sm"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-600">No categories</p>
      )}

      <div className="mb-4 px-6 py-4 bg-white rounded-md border-slate-200 border-2">
        <MDEditor source={content || ""} />
      </div>

      <Button
        onClick={onSubmit}
        className="mt-4 mb-6"
        display="block"
        variant="secondary"
        disabled={isLoading || categories.length === 0}
      >
        Publish
      </Button>
    </Modal>
  );
};

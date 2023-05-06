"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSupabase } from "@/components/client";
import { getArray } from "@/lib/supabase-type-convert";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { PublishVacancyModal } from "./PublishVacancyModal";
import { Tag } from "@/components/ui";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const MDPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

type Category = {
  id: string;
  title: string;
};

type Vacancy = {
  id: string;
  title: string;
  content: string | null;
  is_published: boolean;
  categories: Category[];
};

export type EditorProps = {
  vacancy: Vacancy;
};

export const Editor = ({ vacancy }: EditorProps) => {
  const { supabase } = useSupabase();

  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState<string>(vacancy.title);
  const [content, setContent] = useState<string | undefined>(vacancy.content || "");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  useEffect(() => {
    const saveContent = async () => {
      const { data, error } = await supabase
        .from("vacancies")
        .update({ title, content })
        .eq("id", vacancy.id);
    };

    saveContent();
  }, [supabase, vacancy, title, content]);

  // load the list of categories from the database
  useEffect(() => {
    const getCategories = async () => {
      const { data: _categories } = await supabase
        .from("categories")
        .select(`id, title`);

      const categories = getArray(_categories);

      setCategories(categories);
      setActiveCategories(vacancy.categories.map((category) => category.id));
    };

    getCategories();
  }, [supabase, vacancy]);

  // when a category is added or removed from the list of active categories update the database to reflect the change
  useEffect(() => {
    const updateCategories = async () => {
      const { error } = await supabase
        .from("vacancy_categories")
        .delete()
        .eq("vacancy_id", vacancy.id);

      if (error) {
        console.error(error);
      } else {
        const { error } = await supabase
          .from("vacancy_categories")
          .insert(
            activeCategories.map((category_id) => ({
              vacancy_id: vacancy.id,
              category_id,
            }))
          );

        if (error) {
          console.error(error);
        }
      }
    };

    updateCategories();
  }, [supabase, vacancy, activeCategories]);

  return (
    <>
      {vacancy.is_published ? (
        <>
          <div className="mb-4 flex space-x-2">
            <Tag variant="green" text="Published" />

            {vacancy.categories.map((category) => (
              <Tag key={category.id} text={category.title} variant="secondary" />
            ))}
          </div>

          <div className="mb-4">
            <div className="px-6 py-4 bg-white rounded-md">
              <h2 className="text-xl font-semibold">{vacancy.title}</h2>
            </div>
          </div>

          <div className="mb-4">
            <div className="px-6 py-4 bg-white rounded-md">
              <MDPreview source={content} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full rounded-md border-2 border-slate-200 px-5 py-3 text-sm text-slate-900 placeholder-slate-400"
            />
          </div>


          <div className="mb-4">
            <MDEditor value={content} onChange={setContent} />
          </div>

          <div className="flex space-x-4 mb-4">
            {categories.map((category, index) => (
              <div key={category.id}>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name={`categories.${index}`}
                    className="sr-only peer"
                    checked={activeCategories.includes(category.id)}
                    onChange={(e) => {
                      if (e.target.checked) setActiveCategories([...activeCategories, category.id]);
                      else setActiveCategories(activeCategories.filter((id) => id !== category.id));
                    }}
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800"></div>
                  <span className="ml-3 text-md font-medium text-slate-900">
                    {category.title}
                  </span>
                </label>
              </div>
            ))}
          </div>

          <PublishVacancyModal vacancyId={vacancy.id} />
        </>
      )}
    </>
  );
};

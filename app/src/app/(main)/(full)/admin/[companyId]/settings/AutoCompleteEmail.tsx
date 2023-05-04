import React, { useEffect, useRef, useState } from "react";
import { useSupabase } from "@/components/client";
import clsx from "clsx";
import { useField } from "formik";

type Option = {
  id: string;
  name: string;
  email: string;
};

export default function AutoCompleteEmail() {
  const { supabase } = useSupabase();
  const [field, meta, helpers] = useField("profileId");

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [optionsList, setOptionsList] = useState<Option[]>([]);
  const [search, setSearch] = useState<string>("");
  const [cursor, setCursor] = useState(-1);
  const ref = useRef();

  const select = (index: number) => {
    setSearch(optionsList[index].name);
    helpers.setValue(optionsList[index].id);
    setShowOptions(false);
  };

  const handleChange = (text: string) => {
    const getOptions = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email")
        .ilike("email", `%${text}%`)
        .limit(10);

      if (error) {
        console.log(error);
      } else {
        setOptionsList(data);
      }
    };

    setSearch(text);
    getOptions();
    helpers.setValue(null);

    setCursor(-1);
    if (!showOptions) {
      setShowOptions(true);
    }
  };

  const moveCursorDown = () => {
    if (cursor < optionsList.length - 1) {
      setCursor((c) => c + 1);
    }
  };

  const moveCursorUp = () => {
    if (cursor > 0) {
      setCursor((c) => c - 1);
    }
  };

  // @ts-ignore
  const handleNav = (e) => {
    switch (e.key) {
      case "ArrowUp":
        moveCursorUp();
        break;
      case "ArrowDown":
        moveCursorDown();
        break;
      case "Enter":
        if (cursor >= 0 && cursor < optionsList.length) {
          select(cursor);
        }
        break;
    }
  };

  useEffect(() => {
    // @ts-ignore
    const listener = (e) => {
      // @ts-ignore
      if (!ref.current.contains(e.target)) {
        setShowOptions(false);
        setCursor(-1);
      }
    };

    document.addEventListener("click", listener);
    document.addEventListener("focusin", listener);
    return () => {
      document.removeEventListener("click", listener);
      document.removeEventListener("focusin", listener);
    };
  }, []);

  return (
    // @ts-ignore
    <div className="relative w-full " ref={ref}>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-slate-900"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          className="w-full rounded-md border-2 border-slate-200 pl-10 pr-4 py-3 text-md text-slate-900 placeholder-slate-400"
          placeholder="Search..."
          value={search}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setShowOptions(true)}
          onKeyDown={handleNav}
        />
      </div>

      <ul
        className={clsx(
          !showOptions && "hidden",
          "absolute rounded-md border-2 border-slate-200 bg-white select-none mt-1 z-50 shadow-lg"
        )}
      >
        {optionsList.length > 0 ? (
          optionsList.map((option, index, array) => {
            let className = "px-4 hover:bg-gray-100 ";

            if (index === 0) className += "pt-3 pb-3 rounded-t-md";
            else if (index === array.length)
              className += "pt-3 pb-3 rounded-b-md";
            else if (index === 0 && array.length === 1)
              className += "py-3 rounded-md";
            else className += "py-3";

            if (cursor === index) {
              className += " bg-gray-100";
            }

            return (
              <li
                className={className}
                key={option.id}
                onClick={() => select(index)}
              >
                {option.name} - {option.email}
              </li>
            );
          })
        ) : (
          <li className="px-4 py-3 text-gray-500">No results</li>
        )}
      </ul>
    </div>
  );
}

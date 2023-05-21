import React, { useEffect, useRef, useState } from "react";
import { useSupabase } from "@/components/client";
import clsx from "clsx";
import { useField } from "formik";

type Option = {
  id: string;
  title: string;
};

export type AutoCompleteVenueProps = {
  initialSearch?: string;
};

export default function AutoCompleteVenue({
  initialSearch,
}: AutoCompleteVenueProps) {
  const { supabase } = useSupabase();
  const [field, meta, helpers] = useField("venueId");

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [optionsList, setOptionsList] = useState<Option[]>([]);
  const [search, setSearch] = useState<string>(initialSearch || "");
  const [cursor, setCursor] = useState(-1);
  const ref = useRef();

  const select = (index: number) => {
    setSearch(optionsList[index].title);
    helpers.setValue(optionsList[index].id);
    setShowOptions(false);
  };

  const handleChange = (text: string) => {
    const getOptions = async () => {
      const { data, error } = await supabase
        .from("venues")
        .select("id, title")
        .ilike("title", `%${text}%`)
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
    helpers.setTouched(true);

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
      <div className="w-full">
        <label
          htmlFor="venue"
          className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          Existing Venue
        </label>
        <input
          id="venue"
          type="text"
          className="w-full rounded-md border-2 px-4 py-3 text-md text-slate-900 placeholder-slate-400 border-slate-200 dark:text-white dark:bg-slate-800 dark:placeholder-slate-300 dark:border-slate-600"
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
          "absolute rounded-md border-2 select-none mt-1 z-50 shadow-lg bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-600"
        )}
      >
        {optionsList.length > 0 ? (
          optionsList.map((option, index, array) => {
            let className =
              "px-4 text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 hover:cursor-pointer ";

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
                {option.title}
              </li>
            );
          })
        ) : (
          <li className="px-4 py-3 text-slate-500 dark:text-slate-300">
            No results
          </li>
        )}
      </ul>
    </div>
  );
}

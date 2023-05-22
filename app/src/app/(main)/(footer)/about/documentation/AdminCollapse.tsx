"use client";

import clsx from "clsx";
import { useState } from "react";

const Collapse = ({
  id,
  title,
  active,
  setActive,
  first = false,
  last = false,
  children,
}: {
  id: string;
  title: string;
  active: string;
  setActive: (id: string) => void;
  first?: boolean;
  last?: boolean;
  children: React.ReactNode;
}) => {
  const onClick = () => {
    if (active == id) {
      setActive("");
    } else {
      setActive(id);
    }
  };

  return (
    <>
      <h2 id={`collapse-heading-${id}`}>
        <button
          type="button"
          className={clsx(
            first && "rounded-t-xl",
            !(active == id) && last && "rounded-b-xl border-b-2",
            "flex items-center justify-between w-full p-5 font-medium text-left border-2 border-b-0 text-slate-900 bg-white border-slate-200 hover:bg-slate-100 dark:text-white dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700"
          )}
          aria-expanded="false"
          aria-controls={`collapse-body-${id}`}
          onClick={onClick}
        >
          <span>{title}</span>
          <svg
            className="w-6 h-6 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </h2>
      <div
        id={`collapse-body-${id}`}
        className={clsx(!(active == id) && "hidden")}
        aria-labelledby={`collapse-heading-${id}`}
      >
        <div
          className={clsx(
            last && "rounded-b-xl border-b-2",
            "p-5 border-2 border-b-0 border-slate-200 dark:border-slate-600"
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export const AdminCollapse = () => {
  const [active, setActive] = useState<string>("companies");

  return (
    <div>
      <Collapse
        id="companies"
        title="Companies"
        active={active}
        setActive={setActive}
        first
      >
        <p className="text-slate-600 dark:text-slate-300">
          Any user can create a proudction company. This can be done in the user
          profile admin panel by clicking the &quot;Create Company&quot; button,
          this will create a production company with the user as an admin
          member. The user can then add other users to the production company.
        </p>

        <br />

        <p className="text-slate-600 dark:text-slate-300">
          The production company can then be used to create productions with
          events/participants and vacancies.
        </p>

        <br />

        <p className="text-slate-600 dark:text-slate-300">
          To publish any production, event, participant or vacancy the
          production company must first be varified. This can be done by
          clicking the &quot;Verify Company&quot; button in the company settings
          panel. This will send a request to the admin team to varify the
          company. Production companies will be automatically verified if they
          contain a user with an ox.ac.uk email address.
        </p>
      </Collapse>

      <Collapse
        id="productions"
        title="Productions"
        active={active}
        setActive={setActive}
      >
        <p className="text-slate-600 dark:text-slate-300">
          Admin members of a production company can create productions.
          Productions can be created by clicking the &quot;Create
          Production&quot; button in the company&apos;s production page.
        </p>

        <br />

        <p className="text-slate-600 dark:text-slate-300">
          For a production to be public it must be published, once you are happy
          with the production you can publish by toggling the
          &quot;Published&quot; switch in the specific production&apos;s
          settings panel.
        </p>
      </Collapse>

      <Collapse
        id="events"
        title="Events"
        active={active}
        setActive={setActive}
      >
        <p className="text-slate-600 dark:text-slate-300">
          A production can contain multiple events. Events can be created by
          clicking the &quot;Add Event&quot; button in the specific
          production&apos;s page. Events must have a start date/time and
          optionally an end date/time along with a venue. Currently the platform
          has a list of venues that can be selected from, if the venue you
          require is not in the list please contact the admin team.
        </p>

        <br />

        <p className="text-slate-600 dark:text-slate-300">
          The events created are visible on the main Oscar Ox calendar page only
          when the production is published and company is verified.
        </p>
      </Collapse>

      <Collapse
        id="participants"
        title="Participants"
        active={active}
        setActive={setActive}
      >
        <p className="text-slate-600 dark:text-slate-300">
          A production can contain multiple participants. Participants can be
          created by clicking the &quot;Add Participant&quot; button in the
          specific production&apos;s page. Participants must link to a
          registered user, contain a role title and belong to a category e.g.
          Crew.
        </p>
      </Collapse>

      <Collapse
        id="vacancies"
        title="Vacancies"
        active={active}
        setActive={setActive}
      >
        <p className="text-slate-600 dark:text-slate-300">
          A production can contain multiple vacancies. Vacancies can be created
          by clicking the &quot;Add Vacancy&quot; button in the specific
          production&apos;s page. Vacancies must contain a title, description
          and belong to a category e.g. Crew.
        </p>

        <br />

        <p className="text-slate-600 dark:text-slate-300">
          Upon creation of a vacancy an email will be sent to all users who have
          subscribed to the category of the vacancy. Users can subscribe to
          when creating/editing their profile.
        </p>

        <br />

        <p className="text-slate-600 dark:text-slate-300">
          To publish a vacancy the production compnany must be verified. This
          can be done by clicking the &quot;Verify Company&quot; button in the
          company settings panel. This will send a request to the admin team to
          varify the company. Production companies will be automatically
          verified if they contain a user with an ox.ac.uk email address.
        </p>
      </Collapse>

      <Collapse
        id="pages"
        title="Pages"
        active={active}
        setActive={setActive}
        last
      >
        <p className="text-slate-600 dark:text-slate-300">
          Feature coming soon...
        </p>
      </Collapse>
    </div>
  );
};

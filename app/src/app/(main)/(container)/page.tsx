import clsx from "clsx";

// event component props
type CalenderEventProps = {
  title: string;
  time: string;
  location: string;
  variant: "red" | "orange" | "yellow" | "green" | "blue" | "pink" | "purple";
};

// event component
const CalenderEvent = ({
  title,
  time,
  location,
  variant,
}: CalenderEventProps) => {
  return (
    <div
      className={clsx(
        variant == "red" && "bg-red-100 border-red-900",
        variant == "orange" && "bg-orange-100 border-orange-900",
        variant == "yellow" && "bg-yellow-100 border-yellow-900",
        variant == "green" && "bg-green-100 border-green-900",
        variant == "blue" && "bg-blue-100 border-blue-900",
        variant == "pink" && "bg-pink-100 border-pink-900",
        variant == "purple" && "bg-purple-100 border-purple-900",
        "rounded-lg border-l-[3px]  px-3 py-1 mb-3"
      )}
    >
      <p
        className={clsx(
          variant == "red" && "text-red-900",
          variant == "orange" && "text-orange-900",
          variant == "yellow" && "text-yellow-900",
          variant == "green" && "text-green-900",
          variant == "blue" && "text-blue-900",
          variant == "pink" && "text-pink-900",
          variant == "purple" && "text-purple-900",
          "text-xs font-bold"
        )}
      >
        {time}
      </p>
      <p
        className={clsx(
          variant == "red" && "text-red-900",
          variant == "orange" && "text-orange-900",
          variant == "yellow" && "text-yellow-900",
          variant == "green" && "text-green-900",
          variant == "blue" && "text-blue-900",
          variant == "pink" && "text-pink-900",
          variant == "purple" && "text-purple-900",
          " text-sm font-medium"
        )}
      >
        {title}
      </p>
      <p
        className={clsx(
          variant == "red" && "text-red-800",
          variant == "orange" && "text-orange-800",
          variant == "yellow" && "text-yellow-800",
          variant == "green" && "text-green-800",
          variant == "blue" && "text-blue-800",
          variant == "pink" && "text-pink-800",
          variant == "purple" && "text-purple-800",
          "text-xs font-base"
        )}
      >
        {location}
      </p>
    </div>
  );
};

// Page
export default function Home() {
  return (
    <>
      <header className="mb-8">
        <h1 className="mb-3 text-5xl font-extrabold text-slate-900">
          Welcome to Oscar Ox
        </h1>
        <p className="text-xl text-slate-600">
          The website for amateur theatre in Oxford
        </p>
      </header>

      <main>
        <div className="sm:flex justify-between  w-full mb-4">
          <nav className="flex px-5 py-3 text-gray-700 border-2 border-slate-200 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li>
                <div className="flex items-center">
                  <span className="mr-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                    Back
                  </span>
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <a
                    href="#"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                  >
                    10/5/2021
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                    Next
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <form>
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>

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
                id="simple-search"
                className="w-full rounded-lg border-2 border-slate-200 pl-10 pr-4 py-3 text-md text-slate-900 placeholder-slate-400"
                placeholder="Search Events"
                required
              />
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg border-2 border-slate-200 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-7">
            <div>
              <div className="bg-slate-50 border-b-2 border-slate-200 px-4 py-4">
                <p className="text-slate-500 text-xs font-semibold">SUN</p>
                <p className="text-slate-900 text-sm font-semibold">JAN 22</p>
              </div>
              <div className="px-4 py-4">
                <CalenderEvent
                  title="Mary Poppins"
                  time="17:00"
                  location="The Playhouse"
                  variant="red"
                />
                <CalenderEvent
                  title="American in Paris"
                  time="19:30"
                  location="Oxford Theatre"
                  variant="green"
                />
                <CalenderEvent
                  title="The thwarting of Baron Bolligrew"
                  time="19:30"
                  location="The Auditorium"
                  variant="orange"
                />
              </div>
            </div>
            <div>
              <div className="bg-slate-50 border-b-2 border-slate-200 px-4 py-4">
                <p className="text-slate-500 text-xs font-semibold">SUN</p>
                <p className="text-slate-900 text-sm font-semibold">JAN 22</p>
              </div>
              <div className="px-4 py-4">
                <CalenderEvent
                  title="Matilda"
                  time="18:00"
                  location="The Playhouse"
                  variant="purple"
                />
                <CalenderEvent
                  title="American in Paris"
                  time="19:30"
                  location="Oxford Theatre"
                  variant="green"
                />
              </div>
            </div>
            <div>
              <div className="bg-slate-50 border-b-2 border-slate-200 px-4 py-4">
                <p className="text-slate-500 text-xs font-semibold">SUN</p>
                <p className="text-slate-900 text-sm font-semibold">JAN 22</p>
              </div>
              <div className="px-4 py-4">
                <CalenderEvent
                  title="Matilda"
                  time="18:00"
                  location="The Playhouse"
                  variant="purple"
                />
                <CalenderEvent
                  title="The thwarting of Baron Bolligrew"
                  time="19:30"
                  location="The Auditorium"
                  variant="orange"
                />
              </div>
            </div>
            <div>
              <div className="bg-slate-50 border-b-2 border-slate-200 px-4 py-4">
                <p className="text-slate-500 text-xs font-semibold">SUN</p>
                <p className="text-slate-900 text-sm font-semibold">JAN 22</p>
              </div>
              <div className="px-4 py-4"></div>
            </div>
            <div>
              <div className="bg-slate-50 border-b-2 border-slate-200 px-4 py-4">
                <p className="text-slate-500 text-xs font-semibold">SUN</p>
                <p className="text-slate-900 text-sm font-semibold">JAN 22</p>
              </div>
              <div className="px-4 py-4">
                <CalenderEvent
                  title="Mary Poppins"
                  time="17:00"
                  location="The Playhouse"
                  variant="red"
                />
              </div>
            </div>
            <div>
              <div className="bg-slate-50 border-b-2 border-slate-200 px-4 py-4">
                <p className="text-slate-500 text-xs font-semibold">SUN</p>
                <p className="text-slate-900 text-sm font-semibold">JAN 22</p>
              </div>
              <div className="px-4 py-4">
                <CalenderEvent
                  title="Mary Poppins"
                  time="17:00"
                  location="The Playhouse"
                  variant="red"
                />
                <CalenderEvent
                  title="American in Paris"
                  time="19:30"
                  location="Oxford Theatre"
                  variant="green"
                />
                <CalenderEvent
                  title="Joseph and the Amazing Technicolor Dreamcoat"
                  time="19:30"
                  location="The Auditorium"
                  variant="pink"
                />
              </div>
            </div>
            <div>
              <div className="bg-slate-50 border-b-2 border-slate-200 px-4 py-4">
                <p className="text-slate-500 text-xs font-semibold">SUN</p>
                <p className="text-slate-900 text-sm font-semibold">JAN 22</p>
              </div>
              <div className="px-4 py-4">
                <CalenderEvent
                  title="Mary Poppins"
                  time="17:00"
                  location="The Playhouse"
                  variant="red"
                />
                <CalenderEvent
                  title="American in Paris"
                  time="19:30"
                  location="Oxford Theatre"
                  variant="green"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
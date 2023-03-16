// event component props
type CalenderEventProps = {
  title: string;
  time: string;
  location: string;
  color: string;
};

// event component
const CalenderEvent = ({
  title,
  time,
  location,
  color,
}: CalenderEventProps) => {
  return (
    <div className="bg-red-100 rounded-lg border-l-[3px] border-red-900 px-3 py-1 mb-3">
      <p className="text-red-900 text-xs font-bold">{time}</p>
      <p className="text-red-900 text-sm font-medium">{title}</p>
      <p className="text-red-800 text-xs font-base">{location}</p>
    </div>
  );
};

// Page
export default function Home() {
  return (
    <main>
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
                color="red"
              />
              <CalenderEvent
                title="American in Paris"
                time="19:30"
                location="Oxford Theatre"
                color="green"
              />
              <CalenderEvent
                title="The thwarting of Baron Bolligrew"
                time="19:30"
                location="The Auditorium"
                color="amber"
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
                color="purple"
              />
              <CalenderEvent
                title="American in Paris"
                time="19:30"
                location="Oxford Theatre"
                color="green"
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
                color="purple"
              />
              <CalenderEvent
                title="The thwarting of Baron Bolligrew"
                time="19:30"
                location="The Auditorium"
                color="amber"
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
                color="red"
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
                color="red"
              />
              <CalenderEvent
                title="American in Paris"
                time="19:30"
                location="Oxford Theatre"
                color="green"
              />
              <CalenderEvent
                title="Joseph and the Amazing Technicolor Dreamcoat"
                time="19:30"
                location="The Auditorium"
                color="pink"
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
                color="red"
              />
              <CalenderEvent
                title="American in Paris"
                time="19:30"
                location="Oxford Theatre"
                color="green"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

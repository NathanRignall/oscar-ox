import clsx from "clsx";
import Image from "next/image";

export default function Loading() {
  return (
    <>
      <header className="flex max-w-3xl mx-auto mb-8">
        <div className="flex-1">
          <div className="mb-3 bg-slate-400 rounded-lg h-16 animate-pulse max-w-[350px]"></div>
          <div className="mb-3 bg-slate-300 rounded-lg h-7 animate-pulse max-w-[350px]"></div>
          <div className="bg-slate-300 rounded-lg h-7 animate-pulse max-w-[150px]"></div>
        </div>

        <div className="flex-initial">
          <Image
            src={"/IMG_0447.jpeg"}
            alt="Picture of the author"
            width={150}
            height={150}
            className="rounded-lg object-cover aspect-square"
          ></Image>
        </div>
      </header>

      <main className="max-w-3xl mx-auto">
        <section>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900">Productions</h2>
            </div>
            <div>
              <p className="text-2xl font-normal text-slate-600">
                Involvements
              </p>
            </div>
          </div>

          <ul className="mt-4 grid sm:grid-cols-2 gap-4">
            <li className="bg-slate-300 rounded-lg h-32 animate-pulse"></li>
            <li className="bg-slate-300 rounded-lg h-32 animate-pulse"></li>
            <li className="bg-slate-300 rounded-lg h-32 animate-pulse"></li>
          </ul>
        </section>
      </main>
    </>
  );
}

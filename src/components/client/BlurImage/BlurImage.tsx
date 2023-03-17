import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

export type BlurImage = {
  imageSrc: string;
};

export function BlurImage({ image }: { image: BlurImage }) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="w-full aspect-w-1 aspect-h-1 bg-slate-300 rounded-lg overflow-hidden">
      <Image
        alt=""
        src={image.imageSrc}
        className={clsx(
          "duration-200 ease-in-out rounded-lg",
          isLoading
            ? "grayscale blur-2xl"
            : "grayscale-0 blur-0"
        )}
        width={150}
        height={150}
        onLoadingComplete={() => setLoading(false)}
        priority
      />
    </div>
  );
}

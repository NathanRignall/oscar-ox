import Image from "next/image";
import clsx from "clsx";

export type BlurImage = {
  imageSrc: string;
};

export function BlurImage({ image }: { image: BlurImage }) {
  return (
    <div className="w-full aspect-w-1 aspect-h-1 bg-slate-300 rounded-lg overflow-hidden">
      <Image
        alt=""
        src={image.imageSrc}
        className={clsx("duration-200 ease-in-out rounded-lg")}
        width={150}
        height={150}
        priority
      />
    </div>
  );
}

import Image from "next/image";
import clsx from "clsx";
import { EditProfilePictureModal } from "./EditProfilePictureModal";

export type ProfilePicture = {
  src: string;
  edit?: boolean;
  onClick?: () => void;
};

export function ProfilePicture({ src, edit = false, onClick }: ProfilePicture) {
  return (
    <div className="w-full aspect-w-1 aspect-h-1 bg-slate-300 rounded-lg overflow-hidden">
      <Image
        alt=""
        src={src}
        className={clsx("duration-200 ease-in-out rounded-lg")}
        width={150}
        height={150}
        priority
      />
      {edit && (
        <div className="w-full h-full">
          <EditProfilePictureModal />
        </div>
      )}
    </div>
  );
}

import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { PageProps } from "@/themes";
import OpenVacancies from "../default/components/OpenVacancies";

const Hero = ({
  companyId,
  src,
  text,
}: {
  companyId: string;
  src: string;
  text: string;
}) => {
  return (
    <div className="w-screen h-[60vh] bg-slate-500 relative left-[50%] right-[50%] mx-[-50vw] -translate-y-6">
      <Image
        src={`media/companies/${companyId}/images/${src}`}
        fill
        priority
        alt={text}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent h-1/2" />
      <div className="absolute bottom-0 left-0 right-0 text-white text-7xl font-bold p-4 text-center">
        {text}
      </div>
    </div>
  );
};
const components = (companyId: string) => {
  return {
    // @ts-expect-error
    Hero: (props) => <Hero {...props} companyId={companyId} />,
    // @ts-expect-error
    OpenVacancies: (props) => <OpenVacancies {...props} companyId={companyId} />,
  };
};

export default function Page({ companyId, source }: PageProps) {
  return (
    <div>
      {/* @ts-expect-error */}
      <MDXRemote source={source} components={components(companyId)} />
    </div>
  );
}

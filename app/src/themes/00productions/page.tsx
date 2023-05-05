import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { PageProps } from "@/themes";

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
    <div className="w-screen h-[60vh] bg-slate-500 relative left-[50%] right-[50%] mx-[-50vw] mb-8">
      <Image
        src={`media/companies/${companyId}/images/${src}`}
        fill
        alt={text}
      />
      <div className="text-6xl text-white z-10">{text}</div>
    </div>
  );
};
const components = (companyId: string) => {
  return {
    // @ts-expect-error
    Hero: (props) => <Hero {...props} companyId={companyId} />,
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

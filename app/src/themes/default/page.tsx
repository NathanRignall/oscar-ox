import { MDXRemote } from "next-mdx-remote/rsc";
import { PageProps } from "@/themes";
import OpenVacancies from "./components/OpenVacancies";

const components = (companyId: string) => {
  return {
    // @ts-expect-error
    OpenVacancies: (props) => ( <OpenVacancies {...props} companyId={companyId} /> ),
  };
};

export default function Page({ companyId, source }: PageProps) {
  console.log(source);
  return (
    <div>
      {/* @ts-expect-error */}
      <MDXRemote source={source} components={components(companyId)} />
    </div>
  );
}

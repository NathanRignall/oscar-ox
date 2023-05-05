import { MDXRemote } from "next-mdx-remote/rsc";
import { PageProps } from "@/themes";

export default function Page({ source }: PageProps) {
  return (
    <div>
      {/* @ts-expect-error */}
      <MDXRemote source={source} />
    </div>
  );
}

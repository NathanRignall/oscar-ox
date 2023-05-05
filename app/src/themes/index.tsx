export type LayoutProps = {
  children: React.ReactNode;
  company: {
    id: string;
    name: string;
    description: string;
    main_colour: string;
    pages: {
      id: string;
      title: string;
      slug: string;
    }[];
  };
};

export type PageProps = {
  companyId: string;
  source: string;
};

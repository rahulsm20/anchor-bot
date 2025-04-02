import { PageMeta } from "@/types";
import { Metadata } from "next";
import React from "react";

type LayoutProps = {
  page: PageMeta;
  children: React.ReactNode;
};

export async function generateMetadata({
  page,
}: LayoutProps): Promise<Metadata> {
  return page.metadata;
}

const DataLayout = ({ children }: LayoutProps) => {
  return <>{children}</>;
};

export default DataLayout;

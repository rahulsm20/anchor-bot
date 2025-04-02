import { CommandsPage, FAQPage, HomePage, SongRequestPage } from "@/utils/page";
import { ArrowUpRight } from "lucide-react";

type CustomTabType = {
  metadata: {
    type?: string;
    label: string | React.ReactNode;
    description?: string;
    href: string;
  };
};
export const Tabs = (isAuthenticated: boolean) => {
  const commonTabs: CustomTabType[] = [HomePage()];

  if (isAuthenticated) {
    commonTabs.push(...[SongRequestPage(), CommandsPage(), FAQPage()]);
  }
  commonTabs.push({
    metadata: {
      type: "external",
      label: (
        <div className="flex align-top">
          <span>Github</span>
          <ArrowUpRight className="h-4 w-4" />
        </div>
      ),
      href: "https://github.com/rahulsm20/broccoli-bot-v2/",
    },
  });

  return commonTabs;
};

import CommandBody from "@/components/custom/CommandBody";
import { AddCommandForm } from "@/components/custom/commands";
import { CommandsPage } from "@/utils/page";

const Commands = () => {
  return (
    <div className="flex flex-col gap-5 items-start text-start justify-start md:w-1/2">
      <div className="flex gap-2 items-center justify-between w-full">
        <p className="text-start flex underline underline-offset-4">Commands</p>
        <AddCommandForm />
      </div>
      <CommandBody />
    </div>
  );
};

export async function generateMetadata() {
  return CommandsPage().metadata;
}

export default Commands;

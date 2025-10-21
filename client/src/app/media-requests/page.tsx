import SongRequestBody from "@/components/custom/SongRequestBody";
import { QueueProvider } from "@/hooks/QueueProvider";
import { SongRequestPage } from "@/utils/page";

function Page() {
  return (
    <div className="flex flex-col gap-2 md:px-20 w-full xl:w-2/3">
      <QueueProvider>
        <SongRequestBody />
      </QueueProvider>
    </div>
  );
}

export async function generateMetadata() {
  return SongRequestPage().metadata;
}
export default Page;

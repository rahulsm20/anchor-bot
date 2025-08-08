import { TwitchUserLink } from "@/lib/constants";
import { VideoQueueItem } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpRight, ChevronsUp, ChevronUp, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table";

const QueueTable = ({
  queue = [],
  loading = false,
  removeFromQueue,
  moveToTop,
  moveUpInQueue,
}: {
  queue: VideoQueueItem[];
  loading: boolean;
  removeFromQueue?: (index: number, currentlyPlaying: boolean) => Promise<void>;
  moveUpInQueue?: (index: number) => void;
  moveToTop?: (index: number) => void;
}) => {
  return (
    <>
      {/* <LegacyQueueTable loading={loading} /> */}
      <DataTable
        columns={columns({ removeFromQueue, moveToTop, moveUpInQueue })}
        data={queue}
        loading={loading}
      />
    </>
  );
};

type ColumnArgs = {
  removeFromQueue?: (index: number, currentlyPlaying: boolean) => void;
  moveToTop?: (index: number) => void;
  moveUpInQueue?: (index: number) => void;
};

const columns: ({
  removeFromQueue,
  moveToTop,
  moveUpInQueue,
}: ColumnArgs) => ColumnDef<VideoQueueItem>[] = ({
  removeFromQueue,
  moveToTop,
  moveUpInQueue,
}) => {
  const columns: ColumnDef<VideoQueueItem>[] = [
    {
      id: "index",
      header: "#",
      accessorKey: "index",
      cell: ({ row }) => {
        return <span>{row.getValue("index")}</span>;
      },
    },
    {
      id: "title",
      header: "Title",
      accessorKey: "title",
      cell: ({ row }) => {
        return <span>{row.getValue("title")}</span>;
      },
    },
    {
      id: "requested_by",
      header: "Requested By",
      accessorKey: "requested_by",
      cell: ({ row }) => {
        return (
          <a
            href={TwitchUserLink(row.getValue("requested_by"))}
            target="_blank"
            className="flex items-center"
          >
            <span>
              {row.getValue("requested_by") === "system"
                ? "You"
                : row.getValue("requested_by")}
            </span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        );
      },
    },
  ];
  if (removeFromQueue && moveUpInQueue && moveToTop) {
    columns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center space-x-2">
            <Button
              onClick={() => removeFromQueue(row.index, false)}
              className="bg-red-600 p-2 hover:bg-red-700 border-none"
            >
              <Trash />
            </Button>
            <Button
              onClick={() => moveUpInQueue(row.index)}
              className="p-2"
              disabled={row.index === 0}
            >
              <ChevronUp />
            </Button>
            <Button
              onClick={() => moveToTop(row.index)}
              className="p-2"
              disabled={row.index === 0}
            >
              <ChevronsUp />
            </Button>
          </div>
        );
      },
    });
  }
  return columns;
};
// const _LegacyQueueTable = ({
//   queue = [],
//   loading = false,
//   removeFromQueue,
//   moveToTop,
//   moveUpInQueue,
// }: {
//   queue: VideoQueueItem[];
//   loading: boolean;
//   removeFromQueue: (index: number, currentlyPlaying: boolean) => Promise<void>;
//   moveUpInQueue: (index: number) => void;
//   moveToTop: (index: number) => void;
// }) => {
//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>Title</TableHead>
//           <TableHead>Requested By</TableHead>
//           <TableHead>Actions</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {queue.map((item, index) => (
//           <TableRow key={item.id}>
//             <TableCell>{item.title}</TableCell>
//             <TableCell>
//               {/* <TwitchUserLink user={item.requested_by} /> */}
//               <Link href={TwitchUserLink(item.requested_by)}>
//                 {item.requested_by}
//               </Link>
//             </TableCell>
//             <TableCell>
//               <Button
//                 onClick={() => removeFromQueue(index, false)}
//                 className="bg-red-600 p-2 hover:bg-red-700 border-none"
//               >
//                 <Trash />
//               </Button>
//               <Button
//                 onClick={() => moveUpInQueue(index)}
//                 className="p-2"
//                 disabled={index === 0}
//               >
//                 <ChevronUp />
//               </Button>
//               <Button
//                 onClick={() => moveToTop(index)}
//                 className="p-2"
//                 disabled={index === 0}
//               >
//                 <ChevronsUp />
//               </Button>
//             </TableCell>
//           </TableRow>
//         ))}
//         {loading && (
//           <TableRow>
//             <TableCell colSpan={3} className="h-24 text-center">
//               <LoaderEllipsis loading={loading} />
//             </TableCell>
//           </TableRow>
//         )}
//       </TableBody>
//     </Table>
//   );
// };

export default QueueTable;

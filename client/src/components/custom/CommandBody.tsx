"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCommandsByChannel, serverHandlers } from "@/lib/services";
import { QUEUE_EVENTS, queueEvents } from "@/lib/services/eventBus";
import { Edit, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import LoaderSpin from "./Loader-Spin";

// --------------------------------------------

const defaultCommands = [
  {
    id: "1",
    command: "!sr",
    response: "Added {song} to the queue requested by @{user}",
    description: "Add a song to the queue",
    default: true,
  },
  {
    id: "2",
    command: "!song",
    response: "Currently playing: {song} or No song currently playing",
    description: "Get current song",
    default: true,
  },
  {
    id: "3",
    command: "!remove",
    response: "Removed {song} from the queue @{user}",
    description: "Remove last song request",
    default: true,
  },
  {
    id: "4",
    command: "!queue",
    response: "Here's where you can find the queue: {link_to_queue}",
    description: "Get the link to the queue",
    default: true,
  },
];

// --------------------------------------------

const CommandBody = () => {
  const [commands, setCommands] = useState(defaultCommands);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const channel = session?.user?.name;

  const fetchCommands = async () => {
    if (channel) {
      try {
        setLoading(true);
        const customCommands = await getCommandsByChannel();
        setCommands([...defaultCommands, ...customCommands]);
        return commands;
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCommands();
  }, [channel]);

  useEffect(() => {
    const handleRefetchCommands = () => {
      fetchCommands();
    };
    queueEvents.on(QUEUE_EVENTS.REFETCH_COMMANDS, handleRefetchCommands);
    return () => {
      queueEvents.off(QUEUE_EVENTS.REFETCH_COMMANDS, handleRefetchCommands);
    };
  }, []);

  return (
    <>
      <p>
        List of commands you can use to interact with the bot from your chat.
      </p>
      {loading ? (
        <LoaderSpin loading={loading} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Command</TableHead>
              <TableHead>Response</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commands.map((cmd) => (
              <Command key={cmd.id} {...cmd} refetch={fetchCommands} />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

// --------------------------------------------

const Command = ({
  id,
  command,
  response,
  default: isDefault,
  description,
  refetch = () => {},
}: {
  id: string;
  command: string;
  response: string;
  description: string;
  default: boolean;
  refetch: () => void;
}) => {
  const onDelete = async (id: string) => {
    await serverHandlers.deleteCommand(id);
    refetch();
  };
  return (
    <TableRow key={id}>
      <TableCell>{command}</TableCell>
      <TableCell>{response}</TableCell>
      <TableCell>{description || "-"}</TableCell>
      <TableCell className="flex justify-center">
        {!isDefault ? (
          <div className="flex gap-2">
            <Button
              className="bg-red-600 hover:bg-red-700 p-2"
              onClick={() => onDelete(id)}
            >
              <Trash />
            </Button>
            <Button className="p-2">
              <Edit />
            </Button>
          </div>
        ) : (
          "-"
        )}
      </TableCell>
    </TableRow>
  );
};

export default CommandBody;

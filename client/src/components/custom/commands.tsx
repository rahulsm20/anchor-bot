/*
Commands Page
--------------------------------------------
* Commands are a way to interact with the bot in the chat.
* All commands should start with "!"
* Custom commands are stored in the database and can be used in the chat.
* Default commands are hardcoded in the code and are always available.
*/

"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { serverHandlers } from "@/lib/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

// --------------------------------------------
export const AddCommandForm = () => {
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { data: session } = useSession();
  const channel = session?.user?.name;
  const formSchema = z.object({
    command: z.string().min(1, "Command is required"),
    response: z.string().min(1, "Response is required"),
    description: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      command: "",
      response: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setAdding(true);
    if (channel) {
      await serverHandlers.addCommand({ ...values, channel });
    }
    setAdding(false);
    setLoading(false);
    setModalOpen(false);
  }

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button title="Add Command">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Command</DialogTitle>
        </DialogHeader>
        <DialogDescription>Add a new command</DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="command"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Command</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Button className="rounded-r-none" disabled>
                        !
                      </Button>
                      <Input
                        type="text"
                        className="rounded-l-none"
                        placeholder="Enter command"
                        disabled={loading || adding}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="response"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Response</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Response to command"
                      disabled={loading || adding}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Description of command"
                      disabled={loading || adding}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading || adding}>
              {loading || adding ? <Loader className="animate-spin" /> : "Add"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

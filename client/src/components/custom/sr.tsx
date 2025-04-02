import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VideoQueueItem } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus } from "lucide-react";
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

export const AddVideoForm = ({
  onAdd,
  loading,
}: {
  onAdd: (videoId: string) => Promise<VideoQueueItem | undefined>;
  loading: boolean;
}) => {
  const [adding, setAdding] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const formSchema = z.object({
    videoLink: z
      .string()
      .min(11)
      .refine(
        (link) =>
          /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]+)/.test(
            link
          ) ||
          /(?:https:\/\/open.spotify.com\/track\/)([a-zA-Z0-9]+)/.test(link),
        "Invalid YouTube/Spotify link"
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoLink: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setAdding(true);
    const classicYoutubeLink = values.videoLink.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]+)/
    );
    const spotifyTrackId = values.videoLink.match(
      /(?:https:\/\/open.spotify.com\/track\/)([a-zA-Z0-9]+)/
    );
    const videoId = classicYoutubeLink?.[1] || spotifyTrackId?.[1];
    if (videoId) {
      await onAdd(values.videoLink);
    }
    setAdding(false);
    setModalOpen(false);
    form.reset();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button title="Add Video">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Song</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="videoLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link to song</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Link"
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

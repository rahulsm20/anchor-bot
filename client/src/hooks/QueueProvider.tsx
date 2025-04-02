"use client";
import { getQueueByChannel, serverHandlers } from "@/lib/services";
import { getSpotifyTrack } from "@/lib/services/spotify";
import { getYoutubeVideoTitle } from "@/lib/utils";
import { SpotifyEmbedController, VideoQueueItem, YTPlayer } from "@/types";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useRef } from "react";
import { create } from "zustand";

type QueueState = {
  queue: VideoQueueItem[];
  currentVideo: VideoQueueItem | null;
  setQueue: (queue: VideoQueueItem[]) => void;
  loading: boolean;
  queueId?: string;
  channel: string;
  youtubePlayerRef: React.RefObject<YTPlayer | null> | null;
  spotifyPlayerRef: React.RefObject<SpotifyEmbedController | null> | null;
  updateQueue: () => Promise<void>;
  setCurrentVideo: (video: VideoQueueItem | null) => void;
  addToQueue: (
    link: string,
    requested_by?: string
  ) => Promise<VideoQueueItem | undefined>;
  setRefs: (
    youtubeRef: React.RefObject<YTPlayer>,
    spotifyRef: React.RefObject<SpotifyEmbedController>
  ) => void;
  removeFromQueue: (index: number) => Promise<void>;
  moveUpInQueue: (index: number) => void;
  moveToTop: (index: number) => void;
};

export const useQueueStore = create<QueueState>((set, get) => {
  return {
    queue: [],
    currentVideo: null,
    loading: false,
    queueId: undefined,
    channel: "",
    youtubePlayerRef: null,
    spotifyPlayerRef: null,

    setRefs: (youtubeRef, spotifyRef) =>
      set({ youtubePlayerRef: youtubeRef, spotifyPlayerRef: spotifyRef }),

    setQueue: (queue: VideoQueueItem[]) => set({ queue }),

    updateQueue: async () => {
      try {
        set({ loading: true });
        const state = get();
        if (!state.channel) return;
        const { items, id } = await getQueueByChannel();
        set({
          queueId: id,
          queue: items.map((item: VideoQueueItem) => ({
            ...item,
            id: item.url,
            song_id: item.id,
          })),
        });
      } catch (err) {
        console.error("Failed to fetch queue:", err);
      } finally {
        set({ loading: false });
      }
    },

    setCurrentVideo: (video) => set({ currentVideo: video }),

    addToQueue: async (link, requested_by = "system") => {
      const state = get();
      const youtubeVideoId = link.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]+)/
      )?.[1];
      const spotifyTrackId = link.match(
        /(?:https:\/\/open\.spotify\.com\/track\/)([a-zA-Z0-9]+)/
      )?.[1];

      let title = "";
      let newVideo: VideoQueueItem;

      if (youtubeVideoId) {
        title = await getYoutubeVideoTitle(youtubeVideoId);
        newVideo = {
          id: youtubeVideoId,
          title,
          song_id: "",
          requested_by,
          provider: "youtube",
        };
      } else if (spotifyTrackId) {
        title = await getSpotifyTrack(spotifyTrackId);
        newVideo = {
          id: spotifyTrackId,
          title,
          song_id: "",
          requested_by,
          provider: "spotify",
        };
      } else {
        return;
      }

      const added = await serverHandlers.addToQueue({
        video: newVideo,
        channel: state.channel,
      });
      if (added) {
        newVideo.song_id = added.id;
        set((prev) => ({ queue: [...prev.queue, newVideo] }));
      }
      return newVideo;
    },

    removeFromQueue: async (index) => {
      const state = get();
      const item = state.queue[index];
      set({ queue: state.queue.filter((_, i) => i !== index) });
      if (item) {
        await serverHandlers.removeFromQueue(item.song_id, state.channel);
      }
    },

    moveUpInQueue: (index) => {
      if (index > 0) {
        set((state) => {
          const newQueue = [...state.queue];
          [newQueue[index], newQueue[index - 1]] = [
            newQueue[index - 1],
            newQueue[index],
          ];
          return { queue: newQueue };
        });
      }
    },

    moveToTop: (index) => {
      if (index > 0) {
        set((state) => {
          const newQueue = [...state.queue];
          [newQueue[index], newQueue[0]] = [newQueue[0], newQueue[index]];
          return { queue: newQueue };
        });
      }
    },
  };
});

export const QueueProvider = ({ children }: { children: React.ReactNode }) => {
  const { updateQueue, setRefs } = useQueueStore();
  const { data: session } = useSession();
  // const { session:spotifySession } = useSpotifySession();
  const youtubePlayerRef = useRef<YTPlayer | null>(null);
  const spotifyPlayerRef = useRef<SpotifyEmbedController | null>(null);

  useEffect(() => {
    if (session?.user?.name) {
      useQueueStore.setState({ channel: session.user.name.toLowerCase() });
      updateQueue();
    }
    // if(!spotifySession?.id){
    //   alert("Please login to spotify allow spotify links")
    // }
    setRefs(youtubePlayerRef, spotifyPlayerRef);
  }, [session?.user?.name]);

  return (
    <QueueContext.Provider value={{ youtubePlayerRef, spotifyPlayerRef }}>
      {children}
    </QueueContext.Provider>
  );
};

const QueueContext = createContext<{
  youtubePlayerRef: React.MutableRefObject<YTPlayer | null>;
  spotifyPlayerRef: React.MutableRefObject<SpotifyEmbedController | null>;
} | null>(null);

export const useQueueRefs = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueueRefs must be used within QueueProvider");
  }
  return context;
};

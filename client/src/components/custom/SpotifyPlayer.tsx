"use client";
import { useQueueStore } from "@/hooks/QueueProvider";
import { VideoQueueItem } from "@/types";
import { RefObject } from "react";

const SpotifyPlayer = ({
  containerRef,
}: // currentVideo,
{
  containerRef: RefObject<HTMLDivElement>;
  currentVideo: VideoQueueItem | null;
}) => {
  const currentVideo = useQueueStore().currentVideo;

  return (
    <div
      className={`${
        !currentVideo || currentVideo?.provider == "spotify" ? "flex" : "hidden"
      } dark:bg-black`}
    >
      <div ref={containerRef} className="spotify-embed" />
    </div>
  );
};

export default SpotifyPlayer;

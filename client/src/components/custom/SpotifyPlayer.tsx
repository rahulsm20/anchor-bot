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
      } h-16 md:h-20 lg:h-24 w-full justify-center items-center rounded-md overflow-hidden`}
    >
      <div ref={containerRef} className="spotify-embed" />
    </div>
  );
};

export default SpotifyPlayer;

"use client";
import { useEffect, useRef, useState } from "react";

import { useQueueStore } from "@/hooks/QueueProvider";
import { YoutubePlayerProps, YTPlayerEvent } from "@/types";

const YoutubePlayer = ({
  youtubePlayerRef,
  setIsPlaying,
  playerContainerRef,
  playNextVideo,
}: YoutubePlayerProps) => {
  const playerStateChangeHandler = useRef<
    ((event: YTPlayerEvent) => void) | null
  >(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerSize, setPlayerSize] = useState({
    width: "720",
    height: "300",
  });

  const { queue, currentVideo, setCurrentVideo } = useQueueStore();

  useEffect(() => {
    if (!containerRef.current) return;

    const updatePlayerSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = Math.floor(width * (9 / 16));
        setPlayerSize({ width: "720", height: height.toString() });
      }
    };

    updatePlayerSize();

    const resizeObserver = new ResizeObserver(updatePlayerSize);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  const loadYouTubeAPI = () => {
    if (!document.getElementById("youtube-iframe-script")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-script";
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  };

  useEffect(() => {
    if (!playerContainerRef.current) return;

    window.onYouTubeIframeAPIReady = () => {
      if (!playerContainerRef.current) return;

      playerContainerRef.current.replaceChildren();
      if (youtubePlayerRef) {
        youtubePlayerRef.current = new window.YT.Player(
          playerContainerRef.current,
          {
            height: playerSize.height,
            width: playerSize.width,
            videoId:
              currentVideo?.provider === "youtube" ? currentVideo.id : "",
            playerVars: { playsinline: 1 },
            events: {
              onReady: () => setIsPlaying(false),
              onStateChange: (event) => {
                if (playerStateChangeHandler.current) {
                  playerStateChangeHandler.current(event);
                }
              },
            },
          }
        );
      }
    };

    if (!window.YT) {
      loadYouTubeAPI();
    } else {
      window.onYouTubeIframeAPIReady();
    }

    return () => {
      if (youtubePlayerRef.current && currentVideo?.provider != "youtube") {
        youtubePlayerRef.current.destroy();
        youtubePlayerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    playerStateChangeHandler.current = async (event: YTPlayerEvent) => {
      if (event.data === window.YT.PlayerState.ENDED) {
        if (queue.length > 0) {
          await playNextVideo();
        } else {
          if (youtubePlayerRef.current) {
            youtubePlayerRef.current.stopVideo();
          }
          setCurrentVideo(null);
        }
      }
      setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
    };
  }, [queue]);

  return (
    <div
      className="youtube-player flex justify-center items-center"
      ref={containerRef}
    >
      {playerContainerRef ? (
        <div>
          <div
            className={`flex-col gap-2 p-2 ${
              currentVideo?.provider == "youtube" ? "flex" : "hidden"
            }`}
          >
            <div ref={playerContainerRef} />
          </div>
        </div>
      ) : (
        <LoaderEllipsis loading />
      )}
    </div>
  );
};

export default YoutubePlayer;

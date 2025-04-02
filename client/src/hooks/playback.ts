import {
  PlaybackState,
  SpotifyEmbedController,
  SpotifyIFrameAPI,
  VideoQueueItem,
  YTPlayer,
} from "@/types";
import { MutableRefObject, useEffect } from "react";

interface PlayerManagementProps {
  currentVideo: VideoQueueItem | null;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  theme: string;
  spotifyPlayerRef: MutableRefObject<SpotifyEmbedController | null>;
  youtubePlayerRef: MutableRefObject<YTPlayer | null>;
  setIsPlaying: (isPlaying: boolean) => void;
  playNextVideo: () => Promise<void>;
}

export const usePlayerManagement = ({
  currentVideo,
  containerRef,
  theme,
  spotifyPlayerRef,

  playNextVideo,
}: PlayerManagementProps) => {
  useEffect(() => {
    let controller: SpotifyEmbedController;

    const initializeSpotifyPlayer = (IFrameAPI: SpotifyIFrameAPI) => {
      const element = containerRef.current;
      if (!element) return;
      element.innerHTML = "";

      const options = {
        width: "100%",
        height: "480",
        uri: `spotify:track:${currentVideo?.id}`,
        theme,
      };

      IFrameAPI.createController(
        element,
        options,
        (newController: SpotifyEmbedController) => {
          controller = newController;
          if (spotifyPlayerRef) {
            spotifyPlayerRef.current = controller;
          }
          controller.play();
        }
      );
    };

    if (currentVideo?.provider === "spotify" && containerRef.current) {
      if (window.IFrameAPI) {
        initializeSpotifyPlayer(window.IFrameAPI);
      } else {
        window.onSpotifyIframeApiReady = (IFrameAPI) => {
          initializeSpotifyPlayer(IFrameAPI);
        };
      }
    }

    return () => {
      if (
        currentVideo &&
        currentVideo?.provider !== "spotify" &&
        spotifyPlayerRef
      ) {
        controller?.destroy();
        spotifyPlayerRef.current?.destroy();
        spotifyPlayerRef.current = null;
        if (containerRef.current) containerRef.current.innerHTML = "";
      }
    };
  }, [currentVideo?.id, containerRef, theme, spotifyPlayerRef]);

  useEffect(() => {
    const handlePlaybackUpdate = async (e: PlaybackState) => {
      if (
        Math.abs(e.data.position - e.data.duration) < 1000 &&
        !e.data.isPaused
      ) {
        await playNextVideo();
      }
    };

    if (spotifyPlayerRef.current) {
      spotifyPlayerRef.current.addListener(
        "playback_update",
        handlePlaybackUpdate
      );
    }

    return () => {
      if (spotifyPlayerRef.current) {
        spotifyPlayerRef.current.removeListener(
          "playback_update",
          handlePlaybackUpdate
        );
      }
    };
  }, [playNextVideo, spotifyPlayerRef]);
};

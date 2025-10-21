"use client";
import { useQueueRefs, useQueueStore } from "@/hooks/QueueProvider";
import { useSpotifySession } from "@/hooks/SpotifySessionProvider";
import { useToast } from "@/hooks/use-toast";
import { config } from "@/lib/config";
import { SONG_PROVIDERS } from "@/lib/constants";
import { ChatService } from "@/lib/services/chatService";
import { QUEUE_EVENTS, queueEvents } from "@/lib/services/eventBus";
import { messageHandler } from "@/lib/services/messageHandler";
import {
  PlaybackState,
  SpotifyEmbedController,
  SpotifyIFrameAPI,
  VideoQueueItem,
} from "@/types";
import { InfoIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import tmi from "tmi.js";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Queue from "./Queue";
import SongResourceSettings from "./settings/SongResourceSettings";
import SpotifyPlayer from "./SpotifyPlayer";
import { Heading } from "./Tags";
import YoutubePlayer from "./YoutubePlayer";

//------------------------------------------------------------------------

const SongRequestBody = () => {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSongRequestsEnabled, setIsSongRequestsEnabled] = useState(true);
  const {
    // queue,
    setQueue,
    currentVideo,
    setCurrentVideo,
    removeFromQueue,
    addToQueue,
    updateQueue,
  } = useQueueStore();

  const { data: session } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  const channel = session?.user?.name?.toLowerCase() as string;
  const currentVideoRef = useRef(currentVideo);
  const { theme } = useTheme();
  const [clientLoaded, setClientLoaded] = useState(false);
  const chatServiceRef = useRef<ChatService | null>(null);
  const playerStateChangeHandler = useRef<
    ((event: PlaybackState) => void) | null
  >(null);

  const { youtubePlayerRef, spotifyPlayerRef } = useQueueRefs();
  const { toast } = useToast();
  const { session: spotifySession } = useSpotifySession();
  const hasPlayedNext = useRef(false);

  useEffect(() => {
    if (spotifySession && !spotifySession?.email) {
      toast({
        title: "Please connect to Spotify",
        description: "You need to connect to Spotify to play spotify songs.",
      });
    }
  }, [spotifySession?.email]);

  useEffect(() => {
    const initialIRCClient = async () => {
      if (!channel || !session?.twitchAccessToken) return;

      if (chatServiceRef.current) {
        console.log("Client already exists, skipping initialization.");
        return;
      }

      console.log("Generating new client...");
      const client = new tmi.Client({
        options: { debug: config.NODE_ENV === "development" },
        channels: [channel],
        identity: {
          username: channel,
          password: `oauth:${session.twitchAccessToken}`,
        },
      });

      chatServiceRef.current = new ChatService(client, channel);

      client.on("message", messageHandler(chatServiceRef.current));

      try {
        await client.connect();
        setClientLoaded(true);
      } catch (err) {
        await signOut({ callbackUrl: "/" });
        console.error("Twitch chat connection failed:", err);
      }

      client.on("disconnected", async (reason) => {
        if (reason === "Login authentication failed") {
          await signOut({ callbackUrl: "/" });
        }
      });

      return () => {
        client.disconnect().catch(console.error);
        client.removeAllListeners();
        if (chatServiceRef.current) {
          chatServiceRef.current?.clearEventListeners();
          chatServiceRef.current = null;
        }
      };
    };

    if (!isSongRequestsEnabled) {
      if (chatServiceRef.current) {
        chatServiceRef.current.disconnect().catch(console.error);
        chatServiceRef.current.clearEventListeners();
        chatServiceRef.current = null;
      }
      return;
    } else {
      initialIRCClient();
    }

    return () => {
      if (chatServiceRef.current) {
        chatServiceRef.current.disconnect().catch(console.error);
        chatServiceRef.current.clearEventListeners();
        chatServiceRef.current = null;
      }
    };
  }, [session?.twitchAccessToken, channel, isSongRequestsEnabled]);

  useEffect(() => {
    if (currentVideoRef.current !== currentVideo) {
      currentVideoRef.current = currentVideo;
    }
  }, [currentVideo]);

  useEffect(() => {
    if (channel && clientLoaded) {
      queueEvents.on(QUEUE_EVENTS.ADD_SONG, async (songData) => {
        const { link, requestedBy } = songData;
        if (link) {
          const video = await addToQueue(link, requestedBy);
          if (video) {
            queueEvents.emit(QUEUE_EVENTS.SONG_ADDED, {
              ...video,
            });
          }
        } else {
          await updateQueue();
        }
      });

      queueEvents.on(QUEUE_EVENTS.SONG_ENDED, async () => {
        await playNextVideo();
      });
      queueEvents.on(QUEUE_EVENTS.CURRENT_SONG, (user) => {
        const curr = currentVideoRef.current;
        queueEvents.emit(QUEUE_EVENTS.FETCHED_CURRENT_SONG, curr, user);
      });

      return () => {
        queueEvents.removeAllListeners();
      };
    }
  }, [channel, clientLoaded]);

  useEffect(() => {
    const handleNextSong = (data: { video: VideoQueueItem }) => {
      if (data.video.provider === SONG_PROVIDERS.SPOTIFY) {
        setIsPlaying(true);
        if (
          youtubePlayerRef &&
          youtubePlayerRef.current &&
          youtubePlayerRef.current?.stopVideo
        ) {
          youtubePlayerRef.current.stopVideo();
        }
        if (
          spotifyPlayerRef &&
          spotifyPlayerRef.current &&
          data.video.provider === SONG_PROVIDERS.SPOTIFY
        ) {
          spotifyPlayerRef.current?.loadUri(`spotify:track:${data.video.id}`);
          spotifyPlayerRef.current?.play();
        }
      } else if (data.video.provider === SONG_PROVIDERS.YOUTUBE) {
        if (spotifyPlayerRef && spotifyPlayerRef.current) {
          spotifyPlayerRef.current.pause();
        }
        if (
          youtubePlayerRef &&
          youtubePlayerRef.current &&
          data.video.provider === SONG_PROVIDERS.YOUTUBE
        ) {
          youtubePlayerRef.current.loadVideoById(data.video.id);
          youtubePlayerRef.current.playVideo();
          if (spotifyPlayerRef && spotifyPlayerRef.current) {
            spotifyPlayerRef.current.pause();
          }
        }
      }
    };

    queueEvents.on(QUEUE_EVENTS.NEXT_SONG, handleNextSong);
    return () => {
      queueEvents.off(QUEUE_EVENTS.NEXT_SONG, handleNextSong);
    };
  }, []);

  useEffect(() => {
    let controller: SpotifyEmbedController;

    const initializeSpotifyPlayer = (IFrameAPI: SpotifyIFrameAPI) => {
      const element = containerRef.current;
      if (!element) return;

      // Only clear the container if we don't already have a player
      if (!spotifyPlayerRef.current) {
        element.innerHTML = "";

        const options = {
          width: "100%",
          height: "300",
          uri: `spotify:track:${currentVideo?.id}`,
          theme,
        };

        IFrameAPI.createController(
          element,
          options,
          (newController: SpotifyEmbedController) => {
            controller = newController;
            hasPlayedNext.current = false;

            controller.addListener(
              "playback_update",
              async (e: PlaybackState) => {
                if (hasPlayedNext.current) return;

                const { position, duration, isPaused } = e.data;
                const queue = useQueueStore.getState().queue;

                if (position >= duration - 2000 && !isPaused) {
                  if (!queue.length) return;

                  hasPlayedNext.current = true;
                  await playNextVideo();
                }
              }
            );

            spotifyPlayerRef.current = controller;
            spotifyPlayerRef.current.play();
          }
        );
      }
      // If we already have a controller, just load the new URI
      else if (currentVideo?.id && spotifyPlayerRef.current) {
        spotifyPlayerRef.current.loadUri(`spotify:track:${currentVideo.id}`);
        spotifyPlayerRef.current.play();
        hasPlayedNext.current = false;
      }
    };

    // Initialize or update player if current video is from Spotify
    if (
      currentVideo?.provider === SONG_PROVIDERS.SPOTIFY &&
      containerRef.current
    ) {
      if (window.IFrameAPI) {
        initializeSpotifyPlayer(window.IFrameAPI);
      } else {
        window.onSpotifyIframeApiReady = (IFrameAPI) => {
          initializeSpotifyPlayer(IFrameAPI);
        };
      }
    }

    // Only destroy the player when the component unmounts
    return () => {
      if (controller) {
        controller.removeListener("playback_update", () => {});
      }
    };
  }, [currentVideo, theme]);

  // Add this cleanup effect when the component unmounts
  useEffect(() => {
    return () => {
      if (spotifyPlayerRef.current) {
        spotifyPlayerRef.current.destroy();
        spotifyPlayerRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  const playVideo = (video: VideoQueueItem) => {
    if (video.provider === "spotify") {
      queueEvents.emit(QUEUE_EVENTS.NEXT_SONG, { video });
    } else if (youtubePlayerRef && youtubePlayerRef.current && video) {
      queueEvents.emit(QUEUE_EVENTS.NEXT_SONG, { video });
    }
  };

  useEffect(() => {
    playerStateChangeHandler.current = async (e: PlaybackState) => {
      if (
        Math.abs(e.data.position - e.data.duration) < 1000 &&
        !e.data.isPaused
      ) {
        await playNextVideo();
      }
    };
  }, []);

  const playNextVideo = async () => {
    try {
      const queue = useQueueStore.getState().queue;
      if (queue.length > 0) {
        const nextVideo = queue[0];
        if (nextVideo.provider === SONG_PROVIDERS.SPOTIFY) {
          if (youtubePlayerRef && youtubePlayerRef.current) {
            youtubePlayerRef.current.stopVideo();
          }
        }

        setCurrentVideo(nextVideo);
        playVideo(nextVideo);
        setIsPlaying(true);

        await removeFromQueue(0);
      } else {
        setCurrentVideo(null);
        // setQueue([]);
        setIsPlaying(false);
        if (youtubePlayerRef && youtubePlayerRef.current) {
          youtubePlayerRef.current.stopVideo();
        } else if (spotifyPlayerRef && spotifyPlayerRef.current) {
          spotifyPlayerRef.current.pause();
        }
      }
    } catch (error) {
      console.log(`Error in playNextVideo: ${error}`);
      setCurrentVideo(null);
      setQueue([]);
      setIsPlaying(false);
      if (youtubePlayerRef && youtubePlayerRef.current) {
        youtubePlayerRef.current.pauseVideo();
      }
    }
  };

  const skipVideo = async () => {
    await playNextVideo();
  };

  const controlPlayback = () => {
    if (isPlaying) {
      if (youtubePlayerRef && youtubePlayerRef.current) {
        youtubePlayerRef.current.pauseVideo();
      } else if (spotifyPlayerRef && spotifyPlayerRef.current) {
        spotifyPlayerRef.current.pause();
      }
    } else {
      if (
        currentVideo &&
        currentVideo.provider == SONG_PROVIDERS.YOUTUBE &&
        youtubePlayerRef &&
        youtubePlayerRef.current
      ) {
        youtubePlayerRef.current.playVideo();
      } else if (
        currentVideo &&
        currentVideo.provider == SONG_PROVIDERS.SPOTIFY &&
        spotifyPlayerRef &&
        spotifyPlayerRef.current?.play
      ) {
        spotifyPlayerRef.current.play();
      }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-10 px-10 relative">
      <div className="col-span-1 flex flex-col gap-2">
        <div className="flex gap-2 justify-between">
          <Heading className="flex items-center gap-2">
            <span>Song Requests</span>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent className="bg-background text-foreground border">
                  <p>
                    Users can only request songs as long as you have this page
                    open.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Heading>
          <SongResourceSettings />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="toggle-media-requests"
            checked={isSongRequestsEnabled}
            onCheckedChange={setIsSongRequestsEnabled}
          />
          <Label htmlFor="toggle-media-requests">
            {isSongRequestsEnabled ? "Enabled" : "Disabled"}
          </Label>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          <div className="flex flex-col gap-2 w-full">
            {currentVideo ? (
              <div className="w-full">
                <SpotifyPlayer
                  containerRef={containerRef}
                  currentVideo={currentVideo}
                />
                <YoutubePlayer
                  setIsPlaying={setIsPlaying}
                  playNextVideo={playNextVideo}
                  isPlaying={isPlaying}
                  playVideo={playVideo}
                  skipVideo={skipVideo}
                  controlPlayback={controlPlayback}
                  youtubePlayerRef={youtubePlayerRef}
                  playerContainerRef={playerContainerRef}
                />
              </div>
            ) : (
              <div className="w-full h-48 flex justify-center items-center">
                <h3>No song currently playing.</h3>
              </div>
            )}
          </div>
          {currentVideo && (
            <div className="current-video">
              <h3>{currentVideo.title}</h3>
            </div>
          )}
        </div>
      </div>
      <Queue
        youtubePlayerRef={youtubePlayerRef}
        isPlaying={isPlaying}
        skipVideo={skipVideo}
        controlPlayback={controlPlayback}
      />
    </div>
  );
};

export default SongRequestBody;

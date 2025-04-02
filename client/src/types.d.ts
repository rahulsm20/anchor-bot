import type { Client } from "tmi.js";

interface VideoQueueItem {
  id: string;
  title: string;
  song_id: string;
  url?: string;
  requested_by: string;
  provider: "youtube" | "spotify";
}

export type Queue = {
  id: string;
  channel: string;
  items: VideoQueueItem[];
};

// YouTube Player API types
export interface YTPlayer {
  destroy: () => void;
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  loadVideoById: (videoId: string) => void;
  searchVideo: (query: string) => void;
  cueVideoById: (videoId: string) => void;
}

export interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

export interface YTPlayerState {
  ENDED: number;
  PLAYING: number;
  PAUSED: number;
  BUFFERING: number;
  CUED: number;
}

export interface YTConfig {
  height: string | number;
  width: string | number;
  videoId: string;
  playerVars?: {
    playsinline?: number;
    [key: string]: string | number | undefined;
  };
  events?: {
    onReady?: (event: YTPlayerEvent) => void;
    onStateChange?: (event: YTPlayerEvent) => void;
  };
}

export interface YouTubeAPI {
  Player: new (element: HTMLDivElement | string, config: YTConfig) => YTPlayer;
  PlayerState: YTPlayerState;
}

declare global {
  interface Window {
    YT: YouTubeAPI;
    onYouTubeIframeAPIReady: () => void;
  }
  interface queueEvents {
    EventEmitter;
  }
}

export type PageMeta = {
  metadata: {
    title: string;
    description: string;
  };
};

export type YoutubePlayerProps = {
  isPlaying: boolean;
  youtubePlayerRef: RefObject<YTPlayer | null>;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  playerContainerRef: RefObject<HTMLDivElement>;
  playVideo: (video: VideoQueueItem) => void;
  skipVideo: () => void;
  controlPlayback: () => void;
  playNextVideo: () => Promise<void>;
};

export type QueueContextType = {
  queue: Queue | [];
  setQueue: Dispatch<SetStateAction<Queue>>;
  setCurrentVideo: Dispatch<SetStateAction<VideoQueueItem | null>>;
  loading: boolean;
  currentVideo: VideoQueueItem | null;
  queueId: string | null;
  // addToQueue: (link: string) => void;
  // moveUpInQueue: (index: number) => void;
  // onPopFromQueue: (id: string) => void;
  // removeFromQueue: (index: number) => void;
  queueItems: VideoQueueItem[];
};

export interface ExtendedClient extends Client {
  reason?: string;
}

export type PlaybackState = {
  data: {
    duration: number;
    isBuffering: boolean;
    isPaused: boolean;
    position: number;
  };
};

export interface SpotifyEmbedController {
  destroy: () => void;
  pause: () => void;
  play: () => void;
  resume: () => void;
  restart: () => void;
  seek: (time: number) => void;
  once: (event: string, callback: () => void) => void;
  loadUri: (uri: string) => void;
  emitEvent: (event: string, data: [key: string]) => void;
  addListener: (event: string, callback: (e: PlaybackState) => void) => void;
  removeListener: (event: string, callback: (e: PlaybackState) => void) => void;
}

export interface SpotifyIFrameAPI {
  createController: (
    element: HTMLElement | null,
    options: { uri: string },
    callback: (EmbedController: SpotifyEmbedController) => void
  ) => void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady: (IFrameAPI: SpotifyIFrameAPI) => void;
    IFrameAPI: SpotifyIFrameAPI;
  }
}

// global.d.ts
import { EventEmitter } from "events";

declare global {
  const queueEvents: EventEmitter | undefined; // ✅ Use var in global.d.ts
}

export type CommandType = {
  id?: string;
  command: string;
  response: string;
  description?: string;
};

import { VideoQueueItem } from "@/types";
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { config } from "./config";
import { getSpotifyTrack } from "./services/spotify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getYoutubeVideoTitle(videoId: string) {
  try {
    const res = await axios.get(
      `${config.CLIENT_URL}/api/youtube?videoId=${videoId}`
    );
    const { data } = res;
    return data.title;
  } catch (err) {
    console.log(err);
    return "";
  }
}

export async function generateServerSideSession({
  user,
}: {
  user: { sid: string; name: string };
}) {
  const session = {
    user: {
      sid: user.sid,
      name: user.name,
    },
  };

  return session;
}

export async function determineLinkProvider(
  link: string,
  requested_by: string
) {
  let title = "";
  let newVideo = {} as VideoQueueItem;
  const youtubeVideoId = link.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]+)/
  )?.[1];
  const spotifyTrackId = link.match(
    /(?:https:\/\/open.spotify.com\/track\/)([a-zA-Z0-9]+)/
  );
  if (youtubeVideoId) {
    if (youtubeVideoId == "shorts") {
      return null;
    }
    title = await getYoutubeVideoTitle(youtubeVideoId);
    newVideo = {
      id: youtubeVideoId,
      title,
      song_id: "",
      requested_by,
      provider: "youtube",
    };
  }
  if (spotifyTrackId) {
    title = await getSpotifyTrack(spotifyTrackId[1]);
    newVideo = {
      id: spotifyTrackId[1],
      title,
      song_id: "",
      requested_by,
      provider: "spotify",
    };
  }
  return newVideo;
}

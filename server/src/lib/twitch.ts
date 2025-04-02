import axios from "axios";
import { searchKeys } from "../utils/constants";
import { getCachedData, scanKeys } from "./redis";
import { config } from "../utils/config";

export const getActiveChannels = async () => {
  const { keys } = await scanKeys(searchKeys.CHANNEL_KEY);
  return keys;
};

export const getBotDetails = async () => {
  const details = await getCachedData("bot");
  return details;
};

const spotifyClient = axios.create({
  baseURL: "https://api.spotify.com/v1",
  headers: {
    Authorization: `Bearer ${config.SPOTIFY_API_KEY}`,
  },
});

export const getSongDetails = async ({
  trackId,
  provider,
}: {
  trackId: string;
  provider: "spotify" | "youtube";
}) => {
  if (provider === "spotify") {
    const res = await spotifyClient.get(`/tracks/${trackId}`);
    return res.data;
  }
};

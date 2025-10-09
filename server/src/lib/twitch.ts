import axios from "axios";
import { config } from "../utils/config";
import { searchKeys } from "../utils/constants";
import { getCachedData, scanKeys } from "./redis";

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
  query,
  provider,
}: {
  trackId?: string;
  query?: string;
  provider: "spotify" | "youtube";
}) => {
  if (provider === "spotify") {
    if (query) {
      const rest = await spotifyClient.get(
        `/search?q=${encodeURIComponent(query)}&type=track&limit=1`
      );
      const items = rest.data.tracks.items;
      if (items.length > 0) {
        return items[0];
      } else {
        throw new Error("No results found");
      }
    } else {
      const res = await spotifyClient.get(`/tracks/${trackId}`);
      return res.data;
    }
  }
};

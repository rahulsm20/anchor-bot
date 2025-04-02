import axios from "axios";
import { config } from "../utils/config";

export async function getYoutubeVideoTitle(videoId: string) {
  const res = await axios.get(`
    https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${config.YOUTUBE_API_KEY}`);

  const { data } = res;
  return data.items[0].snippet.title;
}

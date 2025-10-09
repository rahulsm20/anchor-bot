import { getSongDetails } from "../lib/twitch";
import { getYoutubeVideoTitle } from "../lib/youtube";

export const determineLinkProvider = async (link: string) => {
  const youtubeRegex = new RegExp(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]+)/
  );

  const spotifyRegex = new RegExp(
    /(?:https?:\/\/)?(?:www\.)?(?:open\.spotify\.com)\/track\/([a-zA-Z0-9_-]+)/
  );

  if (spotifyRegex.test(link)) {
    const spotifyId = link.match(spotifyRegex)?.[1];
    if (spotifyId) {
      const { name: title } = await getSongDetails({
        trackId: spotifyId,
        provider: "spotify",
      });
      return { provider: "spotify", id: spotifyId, title };
    }
  }
  if (youtubeRegex.test(link)) {
    const youtubeId = link.match(youtubeRegex)?.[1];
    if (youtubeId) {
      const title = await getYoutubeVideoTitle(youtubeId);
      return { provider: "youtube", id: youtubeId, title };
    }
  } else {
    const { name: title, id } = await getSongDetails({
      query: link,
      provider: "spotify",
    });
    return { provider: "spotify", id, title };
  }
  return null;
};

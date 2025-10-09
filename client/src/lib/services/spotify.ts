export async function getSpotifyTrack(
  id: string,
  isLink = true
): Promise<{ name: string; id?: string }> {
  if (isLink) {
    const res = await fetch(`/api/spotify/track?id=${id}`);
    const song = await res.json();
    if (song) {
      if (song.error) {
        // throw new Error("Please ensure you're connected to Spotify");
        return { name: "" };
      }
      const artist = song.artists
        .map((artist: { name: string }) => artist.name)
        .join(", ");
      return { name: `${song.name} - ${artist}` };
    }
    return { name: "" };
  } else {
    // search for track by name
    const res = await fetch(
      `/api/spotify/search?query=${encodeURIComponent(id)}`
    );
    const data = await res.json();
    if (
      data &&
      data.tracks &&
      data.tracks.items &&
      data.tracks.items.length > 0
    ) {
      const song = data.tracks.items[0];
      const artist = song.artists
        .map((artist: { name: string }) => artist.name)
        .join(", ");
      return { name: `${song.name} - ${artist}`, id: song.id };
    } else {
      return { name: "" };
    }
  }
}

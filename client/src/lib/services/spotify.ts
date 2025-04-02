export async function getSpotifyTrack(id: string): Promise<string> {
  const res = await fetch(`/api/spotify/track?id=${id}`);
  const song = await res.json();
  if (song) {
    if (song.error) {
      throw new Error("Please ensure you're connected to Spotify");
    }
    const artist = song.artists
      .map((artist: { name: string }) => artist.name)
      .join(", ");
    return `${song.name} - ${artist}`;
  }
  return "";
}

class SpotifyClient {
  baseUrl: string = "https://api.spotify.com/v1";
  constructor() {
    this.baseUrl = "https://api.spotify.com/v1";
  }
  async search(query: string) {
    const url = `${this.baseUrl}/search?q=${query}&type=track`;
    const response = await fetch(url);
    return await response.json();
  }
  async getTrack(id: string) {
    const url = `${this.baseUrl}/tracks/${id}`;
    const response = await fetch(url);
    return await response.json();
  }
}

export const spotifyClient = new SpotifyClient();

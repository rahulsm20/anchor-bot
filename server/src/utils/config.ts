export const config = {
  TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID || "",
  DATABASE_URL: process.env.DATABASE_URL || "",
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || "",
  SPOTIFY_API_KEY: process.env.SPOTIFY_API_KEY || "",
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID || "",
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET || "",
  SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI || "",
  CLIENT_URL: process.env.CLIENT_URL || "",
  LISTENER_API_URL:
    process.env.NEXT_PUBLIC_LISTENER_API || "http://localhost:5000",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_SINGING_KEY: process.env.JWT_SINGING_KEY || "",
};

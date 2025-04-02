export const config = {
  TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID || "",
  TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET || "",
  LISTENER_API_URL:
    process.env.NEXT_PUBLIC_LISTENER_API || "http://localhost:5000/api",
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID || "",
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET || "",
  SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || "",
  CLIENT_URL: process.env.CLIENT_URL || "",
  JWT_SINGING_KEY: process.env.JWT_SINGING_KEY || "",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",
};

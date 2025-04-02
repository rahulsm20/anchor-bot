// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    spotifyAccessToken?: string;
    spotifyRefreshToken?: string;
    twitchAccessToken?: string;
    twitchRefreshToken?: string;
    id_token?: string;
  }

  interface User extends DefaultUser {
    spotifyAccessToken?: string;
    spotifyRefreshToken?: string;
    twitchAccessToken?: string;
    twitchRefreshToken?: string;
    id_token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    spotifyAccessToken?: string;
    spotifyRefreshToken?: string;
    twitchAccessToken?: string;
    twitchRefreshToken?: string;
    id_token?: string;
  }
}

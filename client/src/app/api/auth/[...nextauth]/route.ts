import { config } from "@/lib/config";
import NextAuth from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";

const handler = NextAuth({
  providers: [
    TwitchProvider({
      clientId: config.TWITCH_CLIENT_ID,
      clientSecret: config.TWITCH_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid user:read:email chat:edit chat:read",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "spotify") {
        token.spotifyAccessToken = account.access_token;
        token.spotifyRefreshToken = account.refresh_token;
      }
      if (account?.provider === "twitch") {
        token.twitchAccessToken = account.access_token;
        token.twitchRefreshToken = account.refresh_token;
      }

      const extendedToken = { ...token, ...account };
      return extendedToken;
    },
    async session({ session, token }) {
      session.spotifyAccessToken = token.spotifyAccessToken;
      session.spotifyRefreshToken = token.spotifyRefreshToken;
      session.twitchAccessToken = token.twitchAccessToken;
      session.twitchRefreshToken = token.twitchRefreshToken;
      session.id_token = token.id_token;
      return session;
    },
  },
});
export { handler as GET, handler as POST };

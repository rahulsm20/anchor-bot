import { config } from "@/lib/config";
import { redirect } from "next/navigation";

const buildAuthUrl = () => {
  const scopes = ["user-read-email"];
  const concatScopes = scopes
    .map((scope) => {
      return encodeURIComponent(scope);
    })
    .join("+");

  return `https://accounts.spotify.com/authorize?response_type=code&client_id=${config.SPOTIFY_CLIENT_ID}&redirect_uri=${config.SPOTIFY_REDIRECT_URI}&scope=${concatScopes}&state=123
`;
};

const handler = async () => {
  const url = buildAuthUrl();
  return redirect(url);
};

export { handler as GET, handler as POST };

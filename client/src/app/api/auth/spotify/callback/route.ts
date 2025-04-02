import { config } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  const { code } = Object.fromEntries(req.nextUrl.searchParams);

  const formData = new URLSearchParams({
    code: code,
    redirect_uri: config.SPOTIFY_REDIRECT_URI,
    grant_type: "authorization_code",
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          config.SPOTIFY_CLIENT_ID + ":" + config.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("Spotify API error:", data);
    return NextResponse.redirect(new URL("/error", req.url));
  }

  const redirectUrl = new URL("/queue", req.url);
  const redirectResponse = NextResponse.redirect(redirectUrl);

  redirectResponse.cookies.set("spotify_access_token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: data.expires_in,
  });

  if (data.refresh_token) {
    redirectResponse.cookies.set("spotify_refresh_token", data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return redirectResponse;
};

export { handler as GET, handler as POST };

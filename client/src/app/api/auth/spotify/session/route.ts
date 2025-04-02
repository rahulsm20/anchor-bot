import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { config } from "@/lib/config";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("spotify_access_token")?.value;
  const refreshToken = req.cookies.get("spotify_refresh_token")?.value;

  if (!accessToken) {
    if (refreshToken) {
      const res = await refreshAndRefetchToken(refreshToken);
      if (res) {
        return res;
      }
    }
  }
  try {
    const response = await axios.get(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch track" },
      { status: 500 }
    );
  }
}

const refreshAndRefetchToken = async (refreshToken: string) => {
  try {
    const { data } = await axios.post(
      `https://accounts.spotify.com/api/token`,
      {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: config.SPOTIFY_CLIENT_ID,
        client_secret: config.SPOTIFY_CLIENT_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const redirectResponse = new NextResponse();

    redirectResponse.cookies.set("spotify_access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: data.expires_in,
    });

    if (data.refresh_token) {
      redirectResponse.cookies.set(
        "spotify_refresh_token",
        data.refresh_token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
        }
      );
    }
    return redirectResponse;
  } catch (error) {
    console.error(error);
    return null;
  }
};

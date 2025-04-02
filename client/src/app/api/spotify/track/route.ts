import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("spotify_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 401 });
  }
  const params = Object.fromEntries(req.nextUrl.searchParams);
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch track" },
      { status: 500 }
    );
  }
}

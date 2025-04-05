import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  const response = NextResponse.redirect(new URL("/song-requests", req.url));

  response.cookies.set("spotify_access_token", "", {
    maxAge: 0,
    path: "/",
  });
  response.cookies.set("spotify_refresh_token", "", {
    maxAge: 0,
    path: "/",
  });

  return response;
};

export { handler as GET, handler as POST };

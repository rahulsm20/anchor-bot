"use client";
import { useSpotifySession } from "@/hooks/SpotifySessionProvider";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const SpotifyLogin = () => {
  const { session, fetching, isAuthenticated } = useSpotifySession();
  const router = useRouter();

  return (
    <Button
      title={session?.email ? "Connected to Spotify" : "Connect Spotify"}
      className="bg-green-700 hover:bg-green-600"
      onClick={() => {
        if (session?.email) {
          window.location.href = "/api/auth/spotify/logout";
        } else {
          router.push("/api/auth/spotify");
        }
      }}
    >
      {fetching ? (
        <LoaderCircle className="animate-spin h-4 w-4" />
      ) : isAuthenticated ? (
        <>
          {session?.images && session?.images.length > 0 && (
            <Image
              src={session?.images.length > 0 ? session?.images[0].url : ""}
              alt="user-image"
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          <span>Logout Spotify</span>
        </>
      ) : (
        <>
          <Image src="/spotify2.png" alt="spotify" width={24} height={24} />
          <span>Connect Spotify</span>
        </>
      )}
    </Button>
  );
};

export default SpotifyLogin;

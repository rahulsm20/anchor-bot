import { useSpotifySession } from "@/hooks/SpotifySessionProvider";
import { Check, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const SpotifyLogin = () => {
  const { session, fetching } = useSpotifySession();
  const disabled = Boolean(fetching || session?.email);
  const router = useRouter();
  return (
    <Button
      title={session?.email ? "Connected to Spotify" : "Connect Spotify"}
      className="bg-green-700 hover:bg-green-600"
      disabled={disabled}
      onClick={() => !disabled && router.push("/api/auth/spotify")}
    >
      {fetching ? (
        <LoaderCircle className="animate-spin h-4 w-4" />
      ) : session?.email ? (
        <>
          {session?.images.length > 0 && (
            <Image
              src={session?.images.length > 0 ? session?.images[0].url : ""}
              alt="user-image"
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          <Check />
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

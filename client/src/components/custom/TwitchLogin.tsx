import { SongRequestPage } from "@/utils/page";
import { LoaderCircle, PersonStanding, Twitch } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";

const TwitchLogin = () => {
  const { data, status } = useSession();
  const userImage = data?.user?.image;
  const [loading, setLoading] = useState(false);

  const connectTwitch = () => {
    setLoading(true);
    signIn("twitch", { callbackUrl: SongRequestPage().metadata.href });
  };
  const disconnectTwitch = () => {
    setLoading(true);
    signOut({ callbackUrl: "/queue" });
  };
  return (
    <li>
      {status === "loading" ? (
        <LoaderCircle className="animate-spin h-4 w-4" />
      ) : data?.twitchAccessToken ? (
        <div className="flex items-center gap-2">
          {userImage ? (
            <Image
              src={userImage}
              alt="user-profile"
              className="rounded-full"
              width={30}
              height={30}
            />
          ) : (
            <PersonStanding />
          )}
          <Button onClick={disconnectTwitch}>
            {loading ? <LoaderCircle className="animate-spin h-4 w-4" /> : null}
            Logout
          </Button>
        </div>
      ) : (
        <Button onClick={connectTwitch} className="rounded-full">
          {loading ? (
            <LoaderCircle className="animate-spin h-4 w-4" />
          ) : (
            <Twitch />
          )}
          Login
        </Button>
      )}
    </li>
  );
};

export default TwitchLogin;

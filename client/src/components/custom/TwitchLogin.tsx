import { SongRequestPage } from "@/utils/page";
import { PersonStanding, Twitch } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import LoaderSpin from "./Loader-Spin";

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
        <LoaderSpin loading />
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
          <Button onClick={disconnectTwitch} className="text-white">
            {loading ? <LoaderSpin loading /> : null}
            Logout
          </Button>
        </div>
      ) : (
        <Button
          onClick={connectTwitch}
          className="border-0 text-white hover:bg-primary/80"
        >
          {loading ? <LoaderSpin loading /> : <Twitch />}
          Login
        </Button>
      )}
    </li>
  );
};

export default TwitchLogin;

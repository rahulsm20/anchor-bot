import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

type SpotifySession = {
  display_name: string;
  email: string;
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  href: string;
  id: string;
  images: [
    {
      height: number;
      url: string;
      width: number;
    }
  ];
  type: string;
  uri: string;
};
export const useSpotifySession = () => {
  const [session, setSession] = useState<SpotifySession | null>(null);
  const [fetching, setFetching] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorSent, setErrorSent] = useState(false);
  const { toast } = useToast();

  const fetchSession = async () => {
    setFetching(true)
    try {
      console.log("sending");
      const response = await fetch("/api/auth/spotify/session");
      const session = await response.json();
      if (!session.error) {
        setSession(session);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.log(err, "hi");
      if (!errorSent) {
        toast({
          title: "Please connect to Spotify",
          description: "You need to connect to Spotify to play spotify songs.",
        });
        setErrorSent(true);
      }
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchSession, 300 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return { session, fetching, isAuthenticated };
};

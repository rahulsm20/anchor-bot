import { useEffect, useState } from "react";
import { useToast } from "./use-toast";
import { SpotifySession } from "@/types";

export const useSpotifySession = () => {
  const [session, setSession] = useState<SpotifySession | null>(null);
  const [fetching, setFetching] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorSent, setErrorSent] = useState(false);
  const { toast } = useToast();

  const fetchSession = async () => {
    setFetching(true);
    try {
      const response = await fetch("/api/auth/spotify/session");
      const session = await response.json();
      if (!session.error) {
        setSession(session);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.log(err);
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
    fetchSession();
  }, []);

  return { session, fetching, isAuthenticated };
};

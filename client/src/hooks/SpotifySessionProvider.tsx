import { SpotifySession } from "@/types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

/**
 * Hook to manage Spotify session state.
 * @returns
 */
export const useSpotifySession = () => {
  const [session, setSession] = useState<SpotifySession | null>(null);
  const [fetching, setFetching] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorSent, setErrorSent] = useState(false);
  const { toast } = useToast();
  const { data: sessionData } = useSession();
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
    if (sessionData) {
      fetchSession();
    }
  }, []);

  return { session, fetching, isAuthenticated };
};

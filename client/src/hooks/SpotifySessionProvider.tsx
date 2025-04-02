import { useEffect, useState } from "react";

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
  const [fetching, setFetching] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchSession = async () => {
    const response = await fetch("/api/auth/spotify/session");
    const session = await response.json();
    return session;
  };
  useEffect(() => {
    const updateSession = () => {
      fetchSession()
        .then((session) => {
          if (!session.error) {
            setSession(session);
            setIsAuthenticated(true);
          }
        })
        .catch(console.error)
        .finally(() => setFetching(false));
    };
    updateSession();
    const intervalId = setInterval(updateSession, 180 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return { session, fetching, isAuthenticated };
};

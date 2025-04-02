import { config } from "@/lib/config";
import { ChatService } from "@/lib/services/chatService";
import { messageHandler } from "@/lib/services/messageHandler";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import tmi from "tmi.js";

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const channel = session?.user?.name?.toLowerCase() as string;
  const chatServiceRef = useRef<ChatService | null>(null);
  const [clientLoaded, setClientLoaded] = useState(false);
  useEffect(() => {
    const initialIRCClient = async () => {
      if (!channel || !session?.twitchAccessToken) return;

      if (chatServiceRef.current) {
        console.log("Client already exists, skipping initialization.");
        return;
      }

      console.log("Generating new client...");
      const client = new tmi.Client({
        options: { debug: config.NODE_ENV === "development" },
        channels: [channel],
        identity: {
          username: channel,
          password: `oauth:${session.twitchAccessToken}`,
        },
      });

      chatServiceRef.current = new ChatService(client, channel);

      client.on("message", messageHandler(chatServiceRef.current));

      try {
        await client.connect();
        setClientLoaded(true);
      } catch (err) {
        await signOut({ callbackUrl: "/" });
        console.error("Twitch chat connection failed:", err);
      }

      client.on("disconnected", async (reason) => {
        if (reason === "Login authentication failed") {
          await signOut({ callbackUrl: "/" });
        }
        console.log("Disconnected:", reason);
      });

      return () => {
        console.log("Cleaning up Twitch client...");
        client.disconnect().catch(console.error);
        client.removeAllListeners();
        if (chatServiceRef.current) {
          chatServiceRef.current?.clearEventListeners();
          chatServiceRef.current = null;
        }
      };
    };

    initialIRCClient();

    return () => {
      if (chatServiceRef.current) {
        chatServiceRef.current.disconnect().catch(console.error);
        chatServiceRef.current.clearEventListeners();
        chatServiceRef.current = null;
      }
    };
  }, [session?.twitchAccessToken, channel]);

  return <>{clientLoaded && children}</>;
};

export default ChatProvider;

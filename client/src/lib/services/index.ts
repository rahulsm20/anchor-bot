import { PermissionType, VideoQueueItem } from "@/types";
import axios from "axios";
import { getSession } from "next-auth/react";
import { config } from "../config";

async function createListenerClient() {
  const session = await getSession();

  return axios.create({
    baseURL: config.LISTENER_API_URL,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${session?.twitchAccessToken}`,
      "Content-Type": "application/json",
    },
  });
}

async function client() {
  return await createListenerClient();
}

export async function cacheUserData({
  name,
  oauthToken,
}: {
  name: string;
  oauthToken: string;
}) {
  try {
    const listenerClient = await client();
    const res = await listenerClient.post("/channel", {
      name,
      oauthToken,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function getQueueByChannel() {
  try {
    const listenerClient = await client();
    const res = await listenerClient.get(`/queue`);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function getCommandsByChannel() {
  try {
    const listenerClient = await client();
    const res = await listenerClient.get(`/channel/commands`);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export const serverHandlers = {
  addToQueue: async ({
    video,
    channel,
  }: {
    video: VideoQueueItem;
    channel: string;
  }) => {
    try {
      const listenerClient = await client();
      const res = await listenerClient.post(`/queue/add`, {
        ...video,
        channel,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },
  addToQueueFromMessage: async ({
    link,
    requested_by,
    channel,
  }: {
    link: string;
    requested_by: string;
    channel: string;
  }) => {
    try {
      const listenerClient = await client();
      const res = await listenerClient.post(`/queue/add?fromMessage=true`, {
        link,
        requested_by,
        channel,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },
  removeFromQueue: async (id: string, channel: string) => {
    try {
      const listenerClient = await client();
      const res = await listenerClient.delete(
        `/queue/remove?id=${id}&channel=${channel}`
      );
      return res.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  removeFromQueueFromMessage: async (user: string) => {
    try {
      const listenerClient = await client();
      const res = await listenerClient.delete(`/queue/remove?user=${user}`);
      return res.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  getSpotifyTitle: async (uri: string) => {
    try {
      const listenerClient = await client();
      const res = await listenerClient.get(`/spotify/title?uri=${uri}`);
      return res.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  addCommand: async (data: {
    command: string;
    description?: string;
    response: string;
    channel: string;
  }) => {
    try {
      const listenerClient = await client();
      const response = await listenerClient.post(`/channel/commands`, {
        ...data,
      });
      return response.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  getCommands: async () => {
    try {
      const listenerClient = await client();
      const response = await listenerClient.get(`/channel/commands`);
      return response.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  addQuote: async (data: { quote: string; channel: string }) => {
    try {
      const listenerClient = await client();
      const response = await listenerClient.post(`/channel/quotes`, {
        ...data,
      });
      return response.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  deleteCommand: async (id: string) => {
    try {
      const listenerClient = await client();
      const response = await listenerClient.delete(`/channel/commands/${id}`);
      return response.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  updatePermissions: async (data: { permissions: PermissionType[] }) => {
    try {
      const listenerClient = await client();
      const response = await listenerClient.post(`/channel/permissions`, data);
      return response.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  getPermissions: async () => {
    try {
      const listenerClient = await client();
      const response = await listenerClient.get(`/channel/permissions`);
      return response.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};

export const getPublicQueueByChannel = async (
  channel: string
): Promise<{ items: VideoQueueItem[] }> => {
  try {
    const listenerClient = await client();
    const res = await listenerClient.get(`/public/queue/${channel}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching public queue:", err);
    throw err;
  }
};

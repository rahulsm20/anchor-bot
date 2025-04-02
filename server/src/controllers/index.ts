import { Request, Response } from "express";
import { queries } from "../db/queries";
import { cacheData } from "../lib/redis";
import { getSongDetails } from "../lib/twitch";
import { determineLinkProvider } from "../utils";
export const channelControllers = {
  addUpdateChannel: async (req: Request, res: Response) => {
    try {
      const { name, oauthToken } = req.body;
      if (!name || !oauthToken) {
        return res.status(400).json({ error: "Invalid Request" });
      }
      await cacheData(`channel:${name}`, oauthToken);
      return res.status(200).json("updated user cache");
    } catch (error) {
      console.log({ error });
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getCommandsForChannel: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(400).json({ error: "Unauthenticated Request" });
      }
      const channel = req.user?.login.toLowerCase();
      const commands = await queries.getCommandsByChannel({
        channel: channel as string,
      });
      return res.status(200).json(commands);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  addCommandForChannel: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(400).json({ error: "Unauthenticated Request" });
      }
      const channel = req.user?.login.toLowerCase();
      const { command, response, description } = req.body;
      if (!command || !response || !channel) {
        return res.status(400).json({ error: "Invalid Request" });
      }
      const commandData = await queries.addCommand({
        command: `!${command}`,
        response,
        description,
        channel,
      });
      return res.status(200).json(commandData);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error", err });
    }
  },
  getQuotesForChannel: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(400).json({ error: "Unauthenticated Request" });
      }
      const channel = req.user?.login.toLowerCase();

      const quotes = await queries.getQuotesByChannel({
        channel: channel as string,
      });
      return res.status(200).json(quotes);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  addQuotesForChannel: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(400).json({ error: "Unauthenticated Request" });
      }
      const channel = req.user?.login.toLowerCase();

      const { quote } = req.body;
      if (!quote || !channel) {
        return res.status(400).json({ error: "Invalid Request" });
      }
      const quoteData = await queries.addQuote({
        quote,
        channel,
      });
      return res.status(200).json(quoteData);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  deleteCommandForChannel: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(400).json({ error: "Unauthenticated Request" });
      }
      const channel = req.user?.login.toLowerCase();
      const { id } = req.query;
      if (!id || !channel) {
        return res.status(400).json({ error: "Invalid Request" });
      }
      await queries.deleteCommand({
        id: id as string,
        channel,
      });
      return res.status(200).json("Command deleted");
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  // updatePermissions: async (req: Request, res: Response) => {
  //   try {
  //     if (!req.user) {
  //       return res.status(400).json({ error: "Unauthenticated Request" });
  //     }
  //     const channel = req.user?.login.toLowerCase();

  //     if (!channel || !permissions) {
  //       return res.status(400).json({ error: "Invalid Request" });
  //     }
  //     const result = await queries.updatePermissions({
  //       channel,
  //       permissions,
  //     });
  //     return res.status(200).json(result);
  //   } catch (err) {
  //     console.log(err);
  //     return res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }
};

export const queueControllers = {
  getQueue: async (req: Request, res: Response) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(400).json({ error: "Unauthenticated Request" });
      }
      const channel = user.login;
      const queue = await queries.getQueueByChannel({
        channel: channel as string,
      });
      return res.status(200).json(queue);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },
  addToQueue: async (req: Request, res: Response) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(400).json({ error: "Unauthenticated Request" });
      }
      const { fromMessage } = req.query;
      const channel = user.login;
      if (fromMessage) {
        const { link, requested_by } = req.body;
        if (!link || !requested_by || !channel) {
          return res.status(400).json({ error: "Invalid Request" });
        }
        const result = await determineLinkProvider(link);
        if (result) {
          const { provider, id, title } = result;
          const item = await queries.addToQueue({
            videoId: id,
            title,
            requested_by,
            channel,
            provider,
          });
          return res.status(200).json(item);
        }
      }
      const { id, title, requested_by, provider } = req.body;
      if (!id || !title || !requested_by || !provider || !channel) {
        return res.status(400).json({ error: "Invalid Request" });
      }
      const result = {
        id,
        title,
        requested_by,
        provider,
        channel,
      };

      if (result) {
        const { provider, id: videoId, title } = result;
        const item = await queries.addToQueue({
          videoId,
          title,
          requested_by: requested_by as string,
          channel: channel as string,
          provider: provider as string,
        });
        return res.status(200).json(item);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  popFromQueue: async (req: Request, res: Response) => {
    try {
      const { id, channel, user } = req.query;
      if (user && channel) {
        const popped = await queries.popFromQueueByUser({
          user: user as string,
          channel: channel as string,
        });
        if (popped) {
          return popped;
        }
      }
      if (!id || !channel) {
        return res.status(400).json({ error: "Invalid Request" });
      }
      await queries.popFromQueue({
        id: id as string,
        channel: channel as string,
      });
      return res.status(200).json("Item removed from queue");
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export const spotifyControllers = {
  getTitle: async (req: Request, res: Response) => {
    try {
      const { uri } = req.query;
      if (!uri) {
        return res.status(400).json({ error: "Invalid Request" });
      }
      const data = await getSongDetails({
        trackId: uri as string,
        provider: "spotify",
      });
      return res.status(200).json(data.name);
    } catch (err) {
      // console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

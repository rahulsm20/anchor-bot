// lib/services/chatService.ts
import { CommandType, ExtendedClient, VideoQueueItem } from "@/types";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat"; // ES 2015
import { serverHandlers } from ".";
import { config } from "../config";
import { validatePermission } from "../utils";
import { QUEUE_EVENTS, queueEvents } from "./eventBus";
dayjs.extend(advancedFormat);
export class ChatService {
  private client: ExtendedClient | null;
  private channel: string;

  constructor(client: ExtendedClient | null, channel: string) {
    this.client = client;
    this.channel = channel;
    this.initializeEventListeners();
  }

  private initializeEventListeners() {
    queueEvents.on(QUEUE_EVENTS.SONG_REMOVED, (data) => {
      const { newSong, requestedBy } = data;
      this.client?.say(
        this.channel,
        `Removed ${newSong.title} requested by @${requestedBy}`
      );
    });
    queueEvents.on(QUEUE_EVENTS.SONG_ADDED, (data: VideoQueueItem) => {
      const { title, requested_by } = data;
      if (!title) {
        this.client?.say(
          this.channel,
          `Please connect Spotify to allow users to request spotify links @${this.channel}`
        );
      } else {
        this.client?.say(
          this.channel,
          `Added ${title} to the queue requested by @${requested_by}`
        );
      }
    });

    queueEvents.on(QUEUE_EVENTS.FETCHED_CURRENT_SONG, (currentSong, user) => {
      if (currentSong) {
        this.client?.say(
          this.channel,
          `Now playing: ${currentSong.title} requested by ${currentSong.requested_by} @${user}`
        );
      } else {
        this.client?.say(this.channel, `No song currently playing @${user}`);
      }
    });
  }

  async handleCommand(
    command: string,
    args: string[],
    user: string,
    badges: string
  ) {
    const customCommands = await serverHandlers.getCommands();
    const customCommand = customCommands.find(
      (c: CommandType) => c.command === command
    );
    if (customCommand) {
      this.client?.say(
        this.channel,
        parseCustomCommand(customCommand.response, user)
      );
      return;
    }
    const hasPermission = await validatePermission(command, badges);
    if (!hasPermission) {
      this.client?.say(
        this.channel,
        `You don't have permission to use this command @${user}`
      );
      return;
    }
    switch (command) {
      case "!sr":
        const link = args[0];
        const requestedBy = user;
        queueEvents.emit(QUEUE_EVENTS.ADD_SONG, { link, requestedBy });
        break;
      case "!song":
        queueEvents.emit(QUEUE_EVENTS.CURRENT_SONG, user);
        break;
      case "!rm":
        queueEvents.emit(QUEUE_EVENTS.SONG_REMOVED, {
          requestedBy: user,
        });
        break;
      case "!quote":
        if (args.length < 2) {
          return;
        }
        const [quote, hyphen, quoteBy] = args;
        const date = dayjs().format("Do MMM YYYY");
        if (hyphen !== "-") {
          const parsedQuote = `${quote} - ${hyphen}, ${date}`;
          await serverHandlers.addQuote({
            quote: parsedQuote,
            channel: this.channel,
          });
          break;
        }
        const parsedQuote = `${quote} - ${quoteBy}, ${date}`;
        await serverHandlers.addQuote({
          quote: parsedQuote,
          channel: this.channel,
        });
        break;
      case "!queue":
        this.client?.say(
          this.channel,
          `You can find the queue here: ${config.CLIENT_URL}/song-requests/${this.channel} @${user}`
        );
        break;
    }
  }

  clearEventListeners() {
    this.client?.removeAllListeners();
  }

  async disconnect() {
    await this.client?.disconnect();
  }
}

const parseCustomCommand = (command: string, user: string) => {
  const containsUser = command.includes("@{user}");
  if (containsUser) {
    const parsedCommand = command.replace("@{user}", `@${user}`);
    return parsedCommand;
  }
  return command;
};

import { ChatService } from "./chatService";
import tmi from "tmi.js";

export const messageHandler =
  (chatService: ChatService) =>
  async (channel: string, tags: tmi.ChatUserstate, message: string) => {
    const user = tags["display-name"] as string;
    const { command, args } = parseMessage(message);

    if (command.startsWith("!")) {
      await chatService.handleCommand(command, args, user);
    }
  };

function parseMessage(message: string) {
  const [command, ...args] = message.split(" ");
  return { command, args };
}

import { and, eq } from "drizzle-orm";
import { db } from "./index";
import { commands, queue, queueItem, quotes } from "./schema";

export const queries = {
  getQuotesByChannel: async ({ channel }: { channel: string }) => {
    if (!channel) {
      throw new Error("Please provide a channel name");
    }
    return db.query.quotes.findMany({
      where: (quote, { eq }) => eq(quote.channel, channel),
    });
  },
  addQuote: async ({ quote, channel }: { quote: string; channel: string }) => {
    if (!quote || !channel) {
      throw new Error("Please provide a quote and channel");
    }
    return db.insert(quotes).values({ quote, channel }).returning();
  },
  getQueueByChannel: async ({ channel }: { channel: string }) => {
    if (!channel) {
      throw new Error("Please provide a channel name");
    }
    const returnedQueue = await db.query.queue.findFirst({
      where: (queue, { eq }) => eq(queue.channel, channel),
    });
    if (!returnedQueue) return null;

    // Fetch queue items separately
    let queueItems = await db.query.queueItem.findMany({
      where: (queueItem, { eq }) => eq(queueItem.queue_id, returnedQueue.id),
      orderBy: (queueItem, { asc }) => [asc(queueItem.position)],
    });
    queueItems.map((item) => ({
      ...item,
      id: item.url,
    }));
    return { ...returnedQueue, items: queueItems };
  },
  addToQueue: async ({
    channel,
    provider,
    title,
    videoId,
    requested_by = "system",
  }: {
    channel: string;
    videoId: string;
    provider: string;
    title: string;
    requested_by?: string;
  }) => {
    if (!channel || !videoId) {
      throw new Error("Please provide a channel name and video ID");
    }

    let existingQueue = await db.query.queue.findFirst({
      where: (queue, { eq }) => eq(queue.channel, channel),
    });

    if (!existingQueue) {
      const [newQueue] = await db.insert(queue).values({ channel }).returning({
        id: queue.id,
        channel: queue.channel,
        access_option: queue.access_option,
      });

      existingQueue = newQueue;
    }

    const lastPosition = await db.query.queueItem
      .findFirst({
        where: (queueItem, { eq }) => eq(queueItem.queue_id, existingQueue.id),
        orderBy: (queueItem, { desc }) => [desc(queueItem.position)],
      })
      .then((item) => item?.position || 0);

    const [newQueueItem] = await db
      .insert(queueItem)
      .values({
        queue_id: existingQueue.id,
        position: lastPosition + 1,
        provider,
        title,
        requested_by,
        requested_at: new Date(),
        url: videoId,
      })
      .returning();

    return newQueueItem;
  },
  popFromQueue: async ({ id, channel }: { id: string; channel: string }) => {
    if (!id || !channel) {
      throw new Error(
        "Please provide a channel name and the id of the item to pop"
      );
    }
    const queue = await db.query.queue.findFirst({
      where: (queue, { eq }) => eq(queue.channel, channel),
    });
    if (queue) {
      const queue_id = queue.id;
      await db.delete(queueItem).where(eq(queueItem.id, id));
      const remainingItems = await db.query.queueItem.findMany({
        where: (queueItem, { eq }) => eq(queueItem.queue_id, queue_id),
        orderBy: (queueItem, { asc }) => [asc(queueItem.position)],
        columns: { id: true },
      });

      await Promise.all(
        remainingItems.map((item, index) =>
          db
            .update(queueItem)
            .set({ position: index + 1 })
            .where(eq(queueItem.id, item.id))
        )
      );
    } else {
      throw new Error("Queue not found");
    }
  },
  popFromQueueByUser: async ({
    user,
    channel,
  }: {
    user: string;
    channel: string;
  }) => {
    if (!user || !channel) {
      throw new Error("Please provide a channel name and the user to pop");
    }
    const queue = await db.query.queue.findFirst({
      where: (queue, { eq }) => eq(queue.channel, channel),
    });
    if (queue) {
      const queue_id = queue.id;
      const deleted = await db
        .delete(queueItem)
        .where(
          and(
            eq(queueItem.requested_by, user),
            eq(queueItem.queue_id, queue_id)
          )
        )
        .returning({ id: queueItem.id });
      const remainingItems = await db.query.queueItem.findMany({
        where: (queueItem, { eq }) => eq(queueItem.queue_id, queue_id),
        orderBy: (queueItem, { asc }) => [asc(queueItem.position)],
        columns: { id: true },
      });

      await Promise.all(
        remainingItems.map((item, index) =>
          db
            .update(queueItem)
            .set({ position: index + 1 })
            .where(eq(queueItem.id, item.id))
        )
      );
      return deleted;
    } else {
      throw new Error("Queue not found");
    }
  },
  getCommandsByChannel: async ({ channel }: { channel: string }) => {
    if (!channel) {
      throw new Error("Please provide a channel name");
    }
    return db.query.commands.findMany({
      where: (command, { eq }) => eq(command.channel, channel),
    });
  },
  addCommand: async ({
    command,
    response,
    description,
    channel,
  }: {
    command: string;
    response: string;
    description: string;
    channel: string;
  }) => {
    if (!command || !response || !channel) {
      throw new Error("Please provide a command, response, and channel");
    }
    return db
      .insert(commands)
      .values({ command, response, description, channel })
      .returning();
  },
  deleteCommand: async ({ id, channel }: { id: string; channel: string }) => {
    if (!id || !channel) {
      throw new Error("Please provide a command ID and channel name");
    }
    return db
      .delete(commands)
      .where(and(eq(commands.id, id), eq(commands.channel, channel)))
      .returning();
  },
};

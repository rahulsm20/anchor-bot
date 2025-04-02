import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const queueItem = pgTable("queue_item", {
  id: uuid().primaryKey().defaultRandom(),
  queue_id: uuid("queue_id").references(() => queue.id),
  position: integer("position"),
  requested_by: varchar("requested_by"),
  requested_at: timestamp("requested_at"),
  provider: varchar("provider"),
  title: varchar("title"),
  url: varchar("url"),
});

export const AccessOptionEnum = pgEnum("access_option_enum", [
  "everyone",
  "subscribers",
  "vips",
  "mods",
  "followers",
]);

export const queue = pgTable(
  "queue",
  {
    id: uuid().primaryKey().defaultRandom(),
    channel: varchar("channel").unique().notNull(),
    access_option: AccessOptionEnum().default("everyone"),
  },
  (table) => [index("channel_idx").on(table.channel)]
);

export const queueRelations = relations(queue, ({ many }) => ({
  items: many(queueItem),
}));

export const commands = pgTable(
  "commands",
  {
    id: uuid().primaryKey().defaultRandom(),
    command: varchar("command").notNull(),
    description: varchar("description"),
    response: varchar("response").notNull(),
    channel: varchar("channel").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp()
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => [index("channel_command_idx").on(table.channel, table.command)]
);

export const quotes = pgTable(
  "quotes",
  {
    id: serial().primaryKey(),
    quote: varchar("quote").notNull(),
    channel: varchar("channel").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp()
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => [index("channel_quote_idx").on(table.channel, table.quote)]
);

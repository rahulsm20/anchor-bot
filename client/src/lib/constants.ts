export const constants = {
  TWITCH_CLIENT_ID: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || "",
  TWITCH_CLIENT_SECRET: process.env.NEXT_PUBLIC_TWITCH_CLIENT_SECRET || "",
};

export const paths = {
  commands: "/commands",
  faq: "/faq",
  sr: "/queue",
  home: "/",
};

export const PAGES = {
  HOME: {
    title: "Home",
    href: "/",
  },
  SR: {
    title: "Queue",
    href: "/queue",
  },
  COMMANDS: {
    title: "Commands",
    href: "/commands",
  },
  FAQ: {
    title: "FAQ",
    href: "/faq",
  },
};

export const TwitchUserLink = (username: string) =>
  `https://twitch.tv/${username}`;

export const ACCESS_OPTIONS = [
  { value: "everyone", label: "Everyone" },
  { value: "subscribers", label: "Subscribers" },
  {
    value: "vips",
    label: "VIPs",
    icon: "https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/3",
  },
  {
    value: "mods",
    label: "Mods",
    icon: "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1",
  },
  { value: "followers", label: "Followers" },
];

export const ACCESS_OPTIONS_MAP = {
  EVERYONE: "everyone",
  SUBSCRIBERS: "subscribers",
  VIPS: "vips",
  MODS: "mods",
  FOLLOWERS: "followers",
};

export const SONG_PROVIDERS = {
  YOUTUBE: "youtube",
  SPOTIFY: "spotify",
  SOUNDCLOUD: "soundcloud",
  LOCAL: "local",
};

export type CommandType = {
  command: string;
  response: string;
  description: string;
  id: string;
  created_at: string;
  updated_at: string;
};

export type ACCESS_OPTION_MAP = {
  EVERYONE: "everyone";
  SUBSCRIBERS: "subscribers";
  VIPS: "vips";
  MODS: "mods";
  FOLLOWERS: "followers";
};

export type AccessOption =
  | "everyone"
  | "subscribers"
  | "vips"
  | "mods"
  | "followers";

export type PermissionType = {
  feature: string;
  authorizedPersonnel: AccessOption;
};

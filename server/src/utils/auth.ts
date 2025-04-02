import axios from "axios";

export const verifyTwitchToken = async (token: string) => {
  const data = await axios.get("https://id.twitch.tv/oauth2/validate", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (data.status !== 200) {
    throw new Error("Invalid token");
  }
  return data.data;
};

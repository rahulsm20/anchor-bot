import React from "react";
const SpotifyIFrame = ({
  link: r,
  style: i = {},
  wide: t = !1,
  width: n = t ? "100%" : 300,
  height: o = t ? 380 : 380,
  frameBorder: a = 0,
  allow: m = "encrypted-media",
  ...p
}: {
  link: string;
  style?: React.CSSProperties;
  wide?: boolean;
  width?: number | string;
  height?: number;
  frameBorder?: number;
  allow?: string;
}) => {
  const e = new URL(r);
  return (
    (e.pathname = e.pathname.replace(/\/intl-\w+\//, "/")),
    React.createElement("iframe", {
      title: "Spotify Web Player",
      src: `https://open.spotify.com/embed${e.pathname}`,
      width: n,
      height: o,
      frameBorder: a,
      allow: m,
      style: { borderRadius: 0, ...i },
      ...p,
    })
  );
};

export default SpotifyIFrame;

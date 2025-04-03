import Layout from "@/components/custom/Layout";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const sfPro = localFont({
  src: "./fonts/SF-Pro-Display-Regular.woff",
  variable: "--font-sf-pro",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Anchor Bot | Home",
  description: "A twitch bot for everyone!",
  icons: [
    {
      url: "/anchor.svg",
      rel: "icon",
      type: "image/x-icon",
      sizes: "16x16",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta
        name="twitter:card"
        content="an image of the anchor bot song request page"
      />
      <meta name="twitter:site" content="@boringBroccoli" />
      <meta name="twitter:creator" content="@boringBroccoli" />
      <meta name="twitter:title" content="Anchor Bot" />
      <meta name="twitter:description" content="a twitch bot for everyone." />
      <meta name="twitter:image" content="/anchor-bot.png" />
      <meta
        name="twitter:image:alt"
        content="A brief description of the image for accessibility."
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${sfPro.variable}`}
      >
        <script
          src="https://open.spotify.com/embed/iframe-api/v1?theme=dark"
          async
        ></script>
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}

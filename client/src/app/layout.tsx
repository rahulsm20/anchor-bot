import Layout from "@/components/custom/Layout";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
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
  description: "A Twitch bot for everyone!",
  icons: [
    { url: "/anchor.svg", rel: "icon", type: "image/x-icon", sizes: "16x16" },
  ],
  keywords: ["twitch", "bot", "anchor", "anchor bot", "twitch bot"],
  openGraph: {
    title: "Anchor Bot",
    description: "A Twitch bot for everyone.",
    url: "https://anchor-bot.vercel.app",
    siteName: "Anchor Bot",
    images: [
      {
        url: "https://anchor-bot.vercel.app/home.png",
        width: 1200,
        height: 630,
        alt: "A Twitch bot for everyone",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@anchor-bot",
    creator: "@boringBroccoli",
    title: "Anchor Bot",
    description: "A Twitch bot for everyone.",
    images: [
      {
        url: "https://anchor-bot.vercel.app/home.png",
        width: 1200,
        height: 630,
        alt: "A Twitch bot for everyone",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
          <Layout>
            {children}
            <Toaster />
          </Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}

"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Anchor,
  BookOpen,
  Command,
  Computer,
  Glasses,
  Play,
  PlusCircle,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "Open Source",
      description: "Open source and free to use.",
      icon: <BookOpen />,
    },
    {
      title: "Privacy First",
      description: "All your credentials are saved on the client side.",
      icon: <Glasses />,
    },
    {
      title: "Song Requests",
      description: "Streamline song requests from your viewers.",
      icon: <Play />,
    },
    {
      title: "Commands",
      description: "A wide set of commands to interact with your viewers.",
      icon: <Command />,
    },
    {
      title: "Customizable",
      description: "Customize the bot to fit your needs.",
      icon: <PlusCircle />,
    },
    {
      title: "Easy to Use",
      description: "Simple and intuitive user interface.",
      icon: <Computer />,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-5 w-1/2">
      <section className="flex flex-col items-start justify-start w-full">
        <div className="flex items-center justify-center gap-2">
          <Anchor className="text-foreground" />
          <h1 className="text-5xl">Anchor Bot</h1>
        </div>
        <p className="ml-8">A twitch bot for everyone! </p>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:grid-cols-3 animate-accordion-up">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="flex flex-col w-60 p-4 backdrop-blur-md border-foreground/20"
          >
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-5">{feature.icon}</div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

import { Heading } from "@/components/custom/Tags";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQPage } from "@/utils/page";

const FAQ_DATA = [
  {
    question: "How do I connect my Spotify account?",
    answer: (
      <div>
        <p className="text-muted-foreground">
          To connect your Spotify account, click on the &quot;Connect
          Spotify&quot; button in the settings page. You will be redirected to{" "}
          Spotify&apos;s login page, where you can log in and authorize our app
          to access your Spotify data.
        </p>
        <p className="text-muted-foreground">
          Once you have authorized the app, you will be redirected back to our
          app, and your Spotify account will be connected.
        </p>
      </div>
    ),
  },
  {
    question: "Why should I trust you with my Twitch and Spotify credentials?",
    answer:
      "You shouldn't. :) \nJust kidding, we don't store your credentials.",
  },
  {
    question: "Why do I need to connect my spotify?",
    answer:
      "You need to connect your spotify account to be able to fetch music data from Spotify.",
  },
] as const;

const QuestionAndAnswer = ({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string | React.ReactNode;
  index: number;
}) => (
  <AccordionItem value={`item-${index}`}>
    <AccordionTrigger>{question}</AccordionTrigger>
    <AccordionContent className="flex flex-col gap-2">
      {typeof answer == "string" ? (
        answer.split("\n").map((line, i) => (
          <p key={i} className="text-muted-foreground">
            {line}
          </p>
        ))
      ) : (
        <div className="text-muted-foreground">{answer}</div>
      )}
    </AccordionContent>
  </AccordionItem>
);

const FAQ = () => {
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <Heading>FAQ</Heading>
      <section className="mt-6">
        <Accordion type="single" collapsible className="w-full">
          {FAQ_DATA.map((qa, index) => (
            <QuestionAndAnswer
              key={index}
              index={index}
              question={qa.question}
              answer={qa.answer}
            />
          ))}
        </Accordion>
      </section>
    </div>
  );
};

export async function generateMetadata() {
  return FAQPage().metadata;
}

export default FAQ;

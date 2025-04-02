import { Heading } from "@/components/custom/Tags";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQPage } from "@/utils/page";

// Move data to a separate constant
const FAQ_DATA = [
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
  answer: string;
  index: number;
}) => (
  <AccordionItem value={`item-${index}`}>
    <AccordionTrigger>{question}</AccordionTrigger>
    <AccordionContent className="flex flex-col gap-2">
      {answer.split("\n").map((line, i) => (
        <p key={i} className="text-muted-foreground">
          {line}
        </p>
      ))}
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

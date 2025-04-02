import React from "react";

interface HeadingProps {
  className?: string;
  children?: React.ReactNode;
}
export const Heading = ({ className, children }: HeadingProps) => {
  return (
    <h1
      className={`text-lg underline underline-offset-8 font-light flex items-center gap-2 ${className}`}
    >
      {children}
    </h1>
  );
};

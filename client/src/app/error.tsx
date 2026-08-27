"use client";


export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  retry: () => void;
}) {
  const message =
    error instanceof Error ? error.message : "Something went wrong";

  return (
    <div>
      <h2>{message}</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

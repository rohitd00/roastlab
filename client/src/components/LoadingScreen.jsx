import { useEffect, useState } from "react";

const MESSAGES = [
  "Finding your stats...",
  "Analyzing aim...",
  "Reviewing questionable decisions...",
  "Calculating teammate suffering...",
  "Preparing your judgment...",
];

export default function LoadingScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 550);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="loading-message" key={index}>
        {MESSAGES[index]}
      </p>
    </div>
  );
}

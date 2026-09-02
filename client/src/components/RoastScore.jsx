import { useEffect, useState } from "react";
import { severityColor } from "../lib/labels";

export default function RoastScore({ score, severity }) {
  const [displayScore, setDisplayScore] = useState(0);
  const color = severityColor(severity);

  useEffect(() => {
    const duration = 700;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      setDisplayScore(Math.round(progress * score));
      if (progress < 1) requestAnimationFrame(tick);
    }

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - displayScore / 100);

  return (
    <div className="roast-score">
      <svg width="140" height="140" viewBox="0 0 140 140" className="roast-score-ring">
        <circle cx="70" cy="70" r="54" fill="none" stroke="var(--border)" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
        />
        <text x="70" y="65" textAnchor="middle" className="roast-score-number">
          {displayScore}
        </text>
        <text x="70" y="85" textAnchor="middle" className="roast-score-label">
          / 100
        </text>
      </svg>
      <p className="roast-score-caption">Roast Score</p>
      <p className="roast-score-severity" style={{ color }}>
        {severity.toUpperCase()}
      </p>
    </div>
  );
}

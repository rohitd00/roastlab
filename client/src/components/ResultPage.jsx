import { useState } from "react";
import RoastScore from "./RoastScore";
import BreakdownBars from "./BreakdownBars";
import RecentForm from "./RecentForm";
import AgentMapBreakdown from "./AgentMapBreakdown";
import { WEAKNESS_LABELS, STRENGTH_LABELS, STRENGTH_ICONS, CRIME_ICONS } from "../lib/labels";

function buildShareText({ player, stats, analysis, roast }) {
  return [
    "🔥 Valorant Roast Lab",
    "",
    `${player.gameName}#${player.tagLine}`,
    player.rank,
    "",
    `K/D: ${stats.kd}`,
    `Win Rate: ${stats.winRate}%`,
    `HS: ${stats.headshotPercentage}%`,
    "",
    `Roast Score: ${analysis.roastScore}/100`,
    "",
    `"${roast.verdict || ""}"`,
  ].join("\n");
}

export default function ResultPage({ result, onReset }) {
  const { player, stats, analysis, roast } = result;
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = buildShareText(result);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const statCards = [
    { label: "K/D", value: stats.kd },
    { label: "Win Rate", value: `${stats.winRate}%` },
    { label: "ACS", value: stats.acs },
    { label: "ADR", value: stats.adr },
    { label: "HS%", value: `${stats.headshotPercentage}%` },
    { label: "Games", value: stats.games },
  ];

  return (
    <div className="result-page">
      <header className="result-header">
        <p className="eyebrow">VALORANT ROAST LAB</p>
        <h1 className="player-name">
          {player.gameName}
          <span className="player-tag">#{player.tagLine}</span>
        </h1>
        <p className="player-rank">{player.rank}</p>
      </header>

      <RoastScore score={analysis.roastScore} severity={analysis.severity} />

      <section className="stats-grid">
        {statCards.map((card) => (
          <div className="stat-card" key={card.label}>
            <p className="stat-value">{card.value}</p>
            <p className="stat-label">{card.label}</p>
          </div>
        ))}
      </section>

      {analysis.biggestCrimes?.length > 0 && (
        <section className="crimes">
          <h2 className="section-title">Biggest Crimes</h2>
          <div className="crimes-list">
            {analysis.biggestCrimes.map((crime) => (
              <div className="crime-item" key={crime.key}>
                <span className="crime-icon">{CRIME_ICONS[crime.key] || "⚠️"}</span>
                <span className="crime-value">{crime.value}</span>
                <span className="crime-label">{crime.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {analysis.strengths?.length > 0 && (
        <section className="strengths">
          <h2 className="section-title">You're Actually Good At</h2>
          <div className="strengths-list">
            {analysis.strengths.map((s) => (
              <div className="strength-item" key={s}>
                <span className="strength-icon">{STRENGTH_ICONS[s] || "✅"}</span>
                <span>{STRENGTH_LABELS[s] || s}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <BreakdownBars breakdown={analysis.breakdown} />

      <RecentForm form={analysis.recentForm} />

      <AgentMapBreakdown agentBreakdown={analysis.agentBreakdown} mapBreakdown={analysis.mapBreakdown} />

      <section className="roast-card">
        <p className="roast-card-title">🔥 Your Roast</p>
        <p className="roast-card-text">{roast.text}</p>
        {analysis.weaknesses?.length > 0 && (
          <div className="weakness-tags">
            {analysis.weaknesses.map((w) => (
              <span className="weakness-tag" key={w}>
                {WEAKNESS_LABELS[w] || w}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="verdict">
        <p className="verdict-label">Final Verdict</p>
        <p className="verdict-text">"{roast.verdict || "Statistically speaking, it's not great."}"</p>
      </section>

      <div className="result-actions">
        <button type="button" className="secondary-button" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy Roast"}
        </button>
        <button type="button" className="roast-button" onClick={onReset}>
          Roast Again
        </button>
      </div>
    </div>
  );
}

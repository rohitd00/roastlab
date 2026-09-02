export default function AgentMapBreakdown({ agentBreakdown, mapBreakdown }) {
  const mostPlayed = agentBreakdown?.mostPlayed;
  const bestMap = mapBreakdown?.best;
  const worstMap = mapBreakdown?.worst;

  if (!mostPlayed && !bestMap) return null;

  return (
    <div className="agent-map-grid">
      {mostPlayed && (
        <div className="info-card">
          <p className="info-card-title">Most Played</p>
          <p className="info-card-value">{mostPlayed.agent}</p>
          <p className="info-card-meta">
            {mostPlayed.games} games · {mostPlayed.winRate}% WR · {mostPlayed.kd} K/D
          </p>
        </div>
      )}

      {bestMap && (
        <div className="info-card">
          <p className="info-card-title">Best Map</p>
          <p className="info-card-value">{bestMap.map}</p>
          <p className="info-card-meta">{bestMap.winRate}% win rate</p>
        </div>
      )}

      {worstMap && worstMap.map !== bestMap?.map && (
        <div className="info-card">
          <p className="info-card-title">Worst Map</p>
          <p className="info-card-value">{worstMap.map}</p>
          <p className="info-card-meta">{worstMap.winRate}% win rate</p>
        </div>
      )}
    </div>
  );
}

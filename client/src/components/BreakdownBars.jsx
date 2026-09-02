const ROWS = [
  { key: "fragging", label: "Fragging" },
  { key: "aim", label: "Aim" },
  { key: "entry", label: "Entry" },
  { key: "winning", label: "Winning" },
  { key: "consistency", label: "Consistency" },
];

export default function BreakdownBars({ breakdown }) {
  return (
    <div className="breakdown">
      <h2 className="section-title">Performance</h2>
      <div className="breakdown-rows">
        {ROWS.map(({ key, label }) => (
          <div className="breakdown-row" key={key}>
            <span className="breakdown-label">{label}</span>
            <div className="breakdown-track">
              <div
                className="breakdown-fill"
                style={{ width: `${breakdown[key]}%` }}
              />
            </div>
            <span className="breakdown-value">{breakdown[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RecentForm({ form }) {
  if (!form?.length) return null;

  return (
    <div className="recent-form">
      <h2 className="section-title">Recent Form</h2>
      <div className="recent-form-badges">
        {form.map((result, i) => (
          <span
            key={i}
            className={`form-badge ${result === "W" ? "form-win" : "form-loss"}`}
            aria-label={result === "W" ? "Win" : "Loss"}
          >
            {result}
          </span>
        ))}
      </div>
    </div>
  );
}

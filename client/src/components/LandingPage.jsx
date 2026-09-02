import { useState } from "react";
import { isValidRiotId } from "../lib/api";
import ErrorBanner from "./ErrorBanner";

const INTENSITIES = [
  { value: "friendly", label: "Friendly" },
  { value: "brutal", label: "Brutal" },
  { value: "nuclear", label: "Nuclear" },
];

export default function LandingPage({ onSubmit, loading, error, onDismissError, mockRiotIds }) {
  const [riotId, setRiotId] = useState("");
  const [intensity, setIntensity] = useState("brutal");
  const [formError, setFormError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    if (!isValidRiotId(riotId)) {
      setFormError("Enter your Riot ID in the format Name#Tag.");
      return;
    }

    setFormError(null);
    onSubmit({ riotId: riotId.trim(), intensity });
  }

  return (
    <div className="landing">
      <div className="landing-inner">
        <p className="eyebrow">VALORANT ROAST LAB</p>
        <h1 className="landing-title">
          Your stats. <span className="accent">Your mistakes.</span> Our judgment.
        </h1>
        <p className="landing-subtitle">
          Drop in your Riot ID and we'll turn your last 20 matches into a data-backed roast.
        </p>

        <form className="roast-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="riotId">Riot ID</label>
            <input
              id="riotId"
              name="riotId"
              type="text"
              placeholder="RohitDas#1234"
              value={riotId}
              onChange={(e) => setRiotId(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label htmlFor="intensity">Intensity</label>
            <select id="intensity" value={intensity} onChange={(e) => setIntensity(e.target.value)}>
              {INTENSITIES.map((i) => (
                <option value={i.value} key={i.value}>
                  {i.label}
                </option>
              ))}
            </select>
          </div>

          {formError && <p className="field-error">{formError}</p>}
          <ErrorBanner message={error} onDismiss={onDismissError} />

          <button type="submit" className="roast-button" disabled={loading}>
            {loading ? "Analyzing..." : "🔥 Roast Me"}
          </button>
        </form>

        <p className="disclaimer">
          This is an entertainment-focused performance analysis. Player data is only displayed
          when available through the application's permitted data access flow. Valorant Roast Lab
          is an independent fan project and is not affiliated with Riot Games.
        </p>

        {mockRiotIds?.length > 0 && (
          <p className="mock-hint">
            Running in mock mode — try: {mockRiotIds.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { isValidRiotId } from "../lib/api";
import ErrorBanner from "./ErrorBanner";

const REGIONS = [
  { value: "na", label: "North America" },
  { value: "eu", label: "Europe" },
  { value: "ap", label: "Asia Pacific" },
  { value: "kr", label: "Korea" },
];

const INTENSITIES = [
  { value: "friendly", label: "Friendly" },
  { value: "brutal", label: "Brutal" },
  { value: "nuclear", label: "Nuclear" },
];

export default function LandingPage({ onSubmit, loading, error, onDismissError, mockRiotIds }) {
  const [riotId, setRiotId] = useState("");
  const [region, setRegion] = useState("ap");
  const [intensity, setIntensity] = useState("brutal");
  const [formError, setFormError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    if (!isValidRiotId(riotId)) {
      setFormError("Enter your Riot ID in the format Name#Tag.");
      return;
    }

    setFormError(null);
    onSubmit({ riotId: riotId.trim(), region, intensity });
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
              list={mockRiotIds?.length ? "mock-riot-ids" : undefined}
            />
            {mockRiotIds?.length > 0 && (
              <datalist id="mock-riot-ids">
                {mockRiotIds.map((id) => (
                  <option value={id} key={id} />
                ))}
              </datalist>
            )}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="region">Region</label>
              <select id="region" value={region} onChange={(e) => setRegion(e.target.value)}>
                {REGIONS.map((r) => (
                  <option value={r.value} key={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
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

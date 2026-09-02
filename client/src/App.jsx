import { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage";
import LoadingScreen from "./components/LoadingScreen";
import ResultPage from "./components/ResultPage";
import { requestRoast, fetchMockRiotIds } from "./lib/api";
import "./App.css";

const VIEWS = { LANDING: "landing", LOADING: "loading", RESULT: "result" };

export default function App() {
  const [view, setView] = useState(VIEWS.LANDING);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [mockRiotIds, setMockRiotIds] = useState([]);

  useEffect(() => {
    fetchMockRiotIds().then(setMockRiotIds);
  }, []);

  async function handleSubmit({ riotId, intensity }) {
    setError(null);
    setView(VIEWS.LOADING);

    try {
      const data = await requestRoast({ riotId, intensity });
      setResult(data);
      setView(VIEWS.RESULT);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setView(VIEWS.LANDING);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
    setView(VIEWS.LANDING);
  }

  if (view === VIEWS.LOADING) {
    return <LoadingScreen />;
  }

  if (view === VIEWS.RESULT && result) {
    return <ResultPage result={result} onReset={handleReset} />;
  }

  return (
    <LandingPage
      onSubmit={handleSubmit}
      loading={false}
      error={error}
      onDismissError={() => setError(null)}
      mockRiotIds={mockRiotIds}
    />
  );
}

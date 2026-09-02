const RIOT_ID_REGEX = /^[^#\s]{1,16}#[^#\s]{2,5}$/;

export function isValidRiotId(riotId) {
  return typeof riotId === "string" && RIOT_ID_REGEX.test(riotId.trim());
}

export async function requestRoast({ riotId, intensity }) {
  const response = await fetch("/api/roast", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ riotId, intensity }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    const error = new Error(data?.error?.message || "Something went wrong.");
    error.code = data?.error?.code || "INTERNAL_ERROR";
    throw error;
  }

  return data;
}

export async function fetchMockRiotIds() {
  try {
    const response = await fetch("/api/players/mock");
    const data = await response.json();
    return data.success ? data.riotIds : [];
  } catch {
    return [];
  }
}

const { openings, weaknessLines, strengthLines, verdicts, noWeaknessLines } = require("./roastTemplates");

function pick(arr, seed = 0) {
  if (!arr || arr.length === 0) return "";
  return arr[seed % arr.length];
}

function buildTemplateRoast(player, stats, analysis, intensity) {
  const { weaknesses, strengths } = analysis;
  const seed = stats.kills + stats.deaths;

  const opening = pick(openings[intensity], seed);

  const weaknessSentences = weaknesses
    .filter((w) => weaknessLines[w])
    .slice(0, 3)
    .map((w, i) => pick(weaknessLines[w][intensity], seed + i));

  const bodySentences = weaknessSentences.length
    ? weaknessSentences
    : [pick(noWeaknessLines, seed)];

  const strengthSentence = strengths.length
    ? pick(strengths.map((s) => pick(strengthLines[s] || [], seed)).filter(Boolean), 0)
    : null;

  const verdict = pick(verdicts[intensity], seed + 1);

  const paragraphs = [opening, ...bodySentences];
  if (strengthSentence) {
    paragraphs.push(`${strengthSentence} Unfortunately, that alone isn't carrying the team.`);
  }

  return {
    intensity,
    text: paragraphs.join(" "),
    verdict,
    source: "template",
  };
}

async function generateWithAI(player, stats, analysis, intensity) {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return null;

  const prompt = `You are a sarcastic VALORANT commentator. Generate a humorous roast (3-5 sentences) using ONLY the statistics supplied below. Do not invent statistics. Mention at least two real statistics. Use VALORANT terminology. The roast should be playful, never hateful, and must not reference race, religion, nationality, disability, sexuality, or appearance. Intensity: ${intensity}. End with a single short verdict line prefixed with "VERDICT:".

Player: ${player.gameName}#${player.tagLine} (${player.rank})
Stats: ${JSON.stringify(stats)}
Weaknesses: ${analysis.weaknesses.join(", ") || "none notable"}
Strengths: ${analysis.strengths.join(", ") || "none notable"}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = data?.content?.[0]?.text;
    if (!text) return null;

    const verdictMatch = text.match(/VERDICT:\s*(.+)/i);

    return {
      intensity,
      text: text.replace(/VERDICT:.*$/is, "").trim(),
      verdict: verdictMatch ? verdictMatch[1].trim() : null,
      source: "ai",
    };
  } catch (err) {
    return null;
  }
}

async function generateRoast(player, stats, analysis, intensity = "brutal") {
  const aiRoast = await generateWithAI(player, stats, analysis, intensity);
  if (aiRoast) return aiRoast;
  return buildTemplateRoast(player, stats, analysis, intensity);
}

module.exports = { generateRoast, buildTemplateRoast };

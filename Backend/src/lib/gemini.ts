type GeminiReviewInput = {
  feedback: string;
  rating: number;
};

export type GeminiReviewInsight = {
  category: string;
  sentiment: "positive" | "neutral" | "negative";
  score: number;
  summary: string;
};

type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

export async function analyzeReviewWithGemini(
  input: GeminiReviewInput,
): Promise<GeminiReviewInsight> {
  const apiKey = getRequiredEnv("GEMINI_API_KEY");
  const model = process.env["GEMINI_MODEL"] || "gemini-1.5-flash";
  const prompt = [
    "Analyze this customer review for a laundry and dry cleaning business.",
    "Return strict JSON only with these keys:",
    "category, sentiment, score, summary.",
    "category must be one of: quality, delivery, timeliness, staff, pricing, convenience, communication, overall.",
    "sentiment must be one of: positive, neutral, negative.",
    "score must be a number from 0 to 1 where 1 is strongest positive.",
    "summary must be a short one-sentence explanation.",
    `Rating: ${input.rating}`,
    `Feedback: ${input.feedback || "No written feedback provided."}`,
  ].join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${body}`);
  }

  const payload = await response.json() as GeminiGenerateResponse;
  const rawText =
    payload?.candidates?.[0]?.content?.parts?.[0]?.text ??
    payload?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("") ??
    "";

  const parsed = JSON.parse(rawText) as Partial<GeminiReviewInsight>;
  const sentiment =
    parsed.sentiment === "negative" || parsed.sentiment === "neutral"
      ? parsed.sentiment
      : "positive";

  return {
    category: parsed.category?.trim() || "overall",
    sentiment,
    score: clampScore(Number(parsed.score)),
    summary: parsed.summary?.trim() || "Review analyzed successfully.",
  };
}

import Groq from "groq-sdk";

/**
 * Shared Groq client for use in SERVER-SIDE API routes only.
 * NEVER import this in a client component — the API key must stay server-side.
 *
 * @example (inside src/app/api/ai/advisor/route.ts)
 * import { groq } from "@/lib/groq";
 * const response = await groq.chat.completions.create({ ... });
 */
export const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

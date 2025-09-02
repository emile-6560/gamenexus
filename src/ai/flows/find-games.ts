
'use server';
/**
 * @fileOverview A flow to find games based on a user's natural language query.
 *
 * - findGames - A function that finds games based on a query.
 * - FindGamesInput - The input type for the findGames function.
 * - FindGamesOutput - The return type for the findGames function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindGamesInputSchema = z.object({
  query: z.string().describe("The user's natural language query for finding games."),
});
export type FindGamesInput = z.infer<typeof FindGamesInputSchema>;

const FindGamesOutputSchema = z.object({
    recommendationText: z.string().describe("A friendly and helpful text that introduces the recommended games. This text MUST NOT be empty."),
    games: z.array(
        z.object({
            name: z.string().describe("The exact, full and official title of the recommended game. This is critical for searching in a database."),
            reason: z.string().describe("A short, compelling reason (1-2 sentences) why this specific game is recommended based on the user's query.")
        })
    ).describe("A list of 3 to 5 recommended games. This list can be empty if no relevant games are found.")
});
export type FindGamesOutput = z.infer<typeof FindGamesOutputSchema>;


export async function findGames(input: FindGamesInput): Promise<FindGamesOutput> {
  return findGamesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findGamesPrompt',
  input: {schema: FindGamesInputSchema},
  output: {schema: FindGamesOutputSchema},
  prompt: `You are a friendly and expert video game assistant.
Your task is to provide a helpful and encouraging introductory text, and then suggest a list of 3 to 5 relevant games based on the user's query.

User Query: {{{query}}}

**CRITICAL INSTRUCTIONS:**
1.  **ALWAYS** provide a 'recommendationText'. It should be friendly and relevant to the user's query. If you find no games, use this text to explain why (e.g., "That's a very specific request! I couldn't find any games that exactly match, but you might be interested in...").
2.  **ALWAYS** provide a 'games' array. If you cannot find any relevant games, this MUST be an EMPTY array ([]).
3.  For each game in the array, provide the **EXACT and OFFICIAL** game title in the 'name' field. This is crucial for database lookups.
4.  For each game, provide a short, compelling 'reason'.

Example for a successful search:
{
  "recommendationText": "Based on your love for open-world RPGs, here are a few gems you might adore:",
  "games": [
    { "name": "The Witcher 3: Wild Hunt", "reason": "Features a massive, living world and one of the most celebrated stories in gaming." },
    { "name": "Elden Ring", "reason": "Offers unparalleled exploration and challenging combat in a dark fantasy setting." }
  ]
}

Example for an unsuccessful search:
{
  "recommendationText": "I couldn't find any games about space-faring pirate cats, but if you like cats and space, maybe you'd enjoy 'Stray' or 'Everspace'!",
  "games": []
}

DO NOT DEVIATE FROM THIS FORMAT. Your response MUST be valid JSON that matches the output schema.
`,
});

const findGamesFlow = ai.defineFlow(
  {
    name: 'findGamesFlow',
    inputSchema: FindGamesInputSchema,
    outputSchema: FindGamesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a valid response.");
    }
    return output;
  }
);

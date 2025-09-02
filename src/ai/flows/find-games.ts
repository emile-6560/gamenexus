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
    recommendationText: z.string().describe("A friendly and helpful text that introduces the recommended games."),
    games: z.array(
        z.object({
            name: z.string().describe("The exact title of the recommended game."),
            reason: z.string().describe("A short, compelling reason why this specific game is recommended based on the user's query.")
        })
    ).describe("A list of 3 to 5 recommended games.")
});
export type FindGamesOutput = z.infer<typeof FindGamesOutputSchema>;


export async function findGames(input: FindGamesInput): Promise<FindGamesOutput> {
  return findGamesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findGamesPrompt',
  input: {schema: FindGamesInputSchema},
  output: {schema: FindGamesOutputSchema},
  prompt: `You are a friendly and expert video game assistant named 'GameAI'.
A user will ask you to find games based on their preferences or questions.
Your task is to understand their query, provide a helpful and encouraging introductory text, and then suggest a list of 3 to 5 relevant games.
For each game, you must provide its exact title and a brief, compelling reason for the recommendation.

User Query: {{{query}}}

Based on this query, please act as GameAI and generate a response.
Make your introduction warm and your reasons for each game insightful and tailored to the user's request.
Example Output:
- recommendationText: "Of course! Based on your love for open-world RPGs with deep stories, here are a few gems you might adore:"
- games: [
    { name: "The Witcher 3: Wild Hunt", reason: "Features a massive, living world and one of the most celebrated stories in gaming."},
    { name: "Elden Ring", reason: "Offers unparalleled exploration and challenging combat in a dark fantasy setting."}
]
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
    return output!;
  }
);

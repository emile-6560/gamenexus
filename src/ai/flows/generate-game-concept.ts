'use server';
/**
 * @fileOverview A flow to generate a game concept from a user prompt.
 *
 * - generateGameConcept - A function that generates a game concept.
 * - GenerateGameConceptInput - The input type for the generateGameConcept function.
 * - GenerateGameConceptOutput - The return type for the generateGameConcept function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGameConceptInputSchema = z.object({
  prompt: z.string().describe('The user\'s idea for a game.'),
});
export type GenerateGameConceptInput = z.infer<typeof GenerateGameConceptInputSchema>;

const GenerateGameConceptOutputSchema = z.object({
  title: z.string().describe('The creative and catchy title of the game.'),
  genre: z.string().describe('The primary genre of the game (e.g., RPG, Platformer, Strategy).'),
  description: z.string().describe('A detailed and engaging description of the game world, story, and objectives.'),
  gameplayMechanics: z.array(z.string()).describe('A list of 3-5 unique and interesting gameplay mechanics.'),
});
export type GenerateGameConceptOutput = z.infer<typeof GenerateGameConceptOutputSchema>;


export async function generateGameConcept(input: GenerateGameConceptInput): Promise<GenerateGameConceptOutput> {
  return generateGameConceptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGameConceptPrompt',
  input: {schema: GenerateGameConceptInputSchema},
  output: {schema: GenerateGameConceptOutputSchema},
  prompt: `You are a creative game designer AI.
A user will provide you with a prompt for a game idea.
Your task is to expand on this idea and generate a full game concept.

User Idea: {{{prompt}}}

Based on this idea, please generate a compelling game concept.
Provide a creative title, a genre, a detailed description of the game, and a list of unique gameplay mechanics.
Make it sound exciting and innovative.
`,
});

const generateGameConceptFlow = ai.defineFlow(
  {
    name: 'generateGameConceptFlow',
    inputSchema: GenerateGameConceptInputSchema,
    outputSchema: GenerateGameConceptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

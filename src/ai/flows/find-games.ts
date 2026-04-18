'use server';
/**
 * @fileOverview A flow to find games based on a user's natural language query.
 */

import { ai } from '@/ai/genkit';
import { gemini15Pro } from '@genkit-ai/googleai'; // 1. Importe le modèle
import { FindGamesInputSchema, FindGamesOutputSchema } from '@/lib/game-discovery-types';

const prompt = ai.definePrompt({
  name: 'findGamesPrompt',
  input: {schema: FindGamesInputSchema},
  output: {schema: FindGamesOutputSchema},
  // 2. Optionnel mais recommandé : définir le modèle par défaut ici aussi
  model: gemini15Pro, 
  prompt: `You are a friendly and expert video game assistant... (le reste de ton prompt)`,
});

export const findGamesFlow = ai.defineFlow(
  {
    name: 'findGamesFlow',
    inputSchema: FindGamesInputSchema,
    outputSchema: FindGamesOutputSchema,
  },
  async input => {
    // 3. CORRECTION : Ajoute l'objet de configuration avec le modèle
    const {output} = await prompt(input, {
      model: gemini15Pro,
    });

    if (!output) {
      throw new Error("AI failed to generate a valid response.");
    }
    return output;
  }
);

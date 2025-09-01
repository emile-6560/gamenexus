'use server';

/**
 * @fileOverview A flow to aggregate game prices from major online retailers.
 *
 * - aggregateGamePrices - A function that aggregates prices for a given game.
 * - AggregateGamePricesInput - The input type for the aggregateGamePrices function.
 * - AggregateGamePricesOutput - The return type for the aggregateGamePrices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AggregateGamePricesInputSchema = z.object({
  gameName: z.string().describe('Le nom du jeu pour lequel chercher les prix.'),
});
export type AggregateGamePricesInput = z.infer<typeof AggregateGamePricesInputSchema>;

const AggregateGamePricesOutputSchema = z.object({
  prices: z.array(
    z.object({
      retailer: z.string().describe('Le nom du détaillant.'),
      price: z.string().describe('Le prix du jeu chez le détaillant.'),
      url: z.string().describe("L'URL de la page du jeu sur le site du détaillant."),
    })
  ).describe('Un tableau de prix de différents détaillants.'),
});
export type AggregateGamePricesOutput = z.infer<typeof AggregateGamePricesOutputSchema>;

export async function aggregateGamePrices(input: AggregateGamePricesInput): Promise<AggregateGamePricesOutput> {
  return aggregateGamePricesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aggregateGamePricesPrompt',
  input: {schema: AggregateGamePricesInputSchema},
  output: {schema: AggregateGamePricesOutputSchema},
  prompt: `Vous êtes un service d'agrégation de prix pour les jeux vidéo. Étant donné le nom d'un jeu, vous rechercherez son prix sur les principaux détaillants en ligne et renverrez une liste de prix, de noms de détaillants et d'URL.

Nom du jeu: {{{gameName}}}

Formatez votre réponse sous forme de tableau JSON d'objets, où chaque objet a les clés 'retailer', 'price' et 'url'. Le champ 'price' doit inclure le symbole de la devise.
`,
});

const aggregateGamePricesFlow = ai.defineFlow(
  {
    name: 'aggregateGamePricesFlow',
    inputSchema: AggregateGamePricesInputSchema,
    outputSchema: AggregateGamePricesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

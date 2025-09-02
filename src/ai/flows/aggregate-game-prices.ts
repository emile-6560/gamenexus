
'use server';

/**
 * @fileOverview A flow to aggregate game prices from major online retailers.
 *
 * - aggregateGamePrices - A function that aggregates prices for a given game.
 */

import {ai} from '@/ai/genkit';
import { AggregateGamePricesInput, AggregateGamePricesInputSchema, AggregateGamePricesOutput, AggregateGamePricesOutputSchema } from '@/lib/price-aggregator-types';

export async function aggregateGamePrices(input: AggregateGamePricesInput): Promise<AggregateGamePricesOutput> {
  return aggregateGamePricesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aggregateGamePricesPrompt',
  input: {schema: AggregateGamePricesInputSchema},
  output: {schema: AggregateGamePricesOutputSchema},
  prompt: `Vous êtes un service expert d'agrégation de prix pour les jeux vidéo.
Votre tâche est de trouver le prix pour le jeu spécifié sur plusieurs grands détaillants en ligne comme Steam, Amazon, Instant Gaming, et le PlayStation Store.

Jeu: {{{gameName}}}

Veuillez retourner une liste de prix. Pour chaque détaillant, fournissez le nom du détaillant, le prix sous forme de nombre (par exemple, 59.99), et un lien direct vers la page du produit.
Si vous ne trouvez aucun prix, retournez un tableau vide.
`,
});

const aggregateGamePricesFlow = ai.defineFlow(
  {
    name: 'aggregateGamePricesFlow',
    inputSchema: AggregateGamePricesInputSchema,
    outputSchema: AggregateGamePricesOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      ...input,
      model: 'googleai/gemini-2.5-pro',
    });
    return output!;
  }
);

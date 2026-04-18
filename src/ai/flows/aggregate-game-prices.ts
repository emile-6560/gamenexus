'use server';

import { ai } from '@/ai/genkit';
import { gemini15Pro } from '@genkit-ai/googleai'; // Importe le modèle officiel
import { 
  AggregateGamePricesInput, 
  AggregateGamePricesInputSchema, 
  AggregateGamePricesOutput, 
  AggregateGamePricesOutputSchema 
} from '@/lib/price-aggregator-types';

const prompt = ai.definePrompt({
  name: 'aggregateGamePricesPrompt',
  input: { schema: AggregateGamePricesInputSchema },
  output: { schema: AggregateGamePricesOutputSchema },
  // On définit le modèle par défaut ici aussi pour être sûr
  model: gemini15Pro, 
  prompt: `Vous êtes un service expert d'agrégation de prix pour les jeux vidéo.
Votre tâche est de trouver le prix pour le jeu spécifié sur plusieurs grands détaillants en ligne au Canada (Amazon.ca, Steam, Instant Gaming, et le PlayStation Store).

Jeu: {{{gameName}}}

Veuillez retourner une liste de prix. Pour chaque détaillant, fournissez le nom du détaillant, le prix sous forme de nombre (par exemple, 59.99), et un lien direct vers la page du produit.
Si vous ne trouvez aucun prix, retournez un tableau vide.`,
});

const aggregateGamePricesFlow = ai.defineFlow(
  {
    name: 'aggregateGamePricesFlow',
    inputSchema: AggregateGamePricesInputSchema,
    outputSchema: AggregateGamePricesOutputSchema,
  },
  async (input) => {
    // CORRECTION : On passe l'objet du modèle, pas un string qui n'existe pas
    const { output } = await prompt(input, {
      model: gemini15Pro, 
    });
    
    return output || { prices: [] };
  }
);

export async function aggregatePrices(input: AggregateGamePricesInput): Promise<AggregateGamePricesOutput> {
    return await aggregateGamePricesFlow(input);
}

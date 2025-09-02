import { z } from 'zod';

export const AggregateGamePricesInputSchema = z.object({
  gameName: z.string().describe('Le nom du jeu pour lequel chercher les prix.'),
});
export type AggregateGamePricesInput = z.infer<typeof AggregateGamePricesInputSchema>;

export const AggregateGamePricesOutputSchema = z.object({
  prices: z.array(
    z.object({
      retailer: z.string().describe('Le nom du détaillant (ex: Amazon, Steam, etc.).'),
      price: z.number().describe('Le prix du jeu en tant que nombre, sans symbole de devise.'),
      url: z.string().describe("L'URL de la page du jeu sur le site du détaillant."),
    })
  ).describe('Un tableau de prix de différents détaillants.'),
});
export type AggregateGamePricesOutput = z.infer<typeof AggregateGamePricesOutputSchema>;

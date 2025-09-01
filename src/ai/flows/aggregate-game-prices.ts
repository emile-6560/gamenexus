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
  gameName: z.string().describe('The name of the game to search for prices.'),
});
export type AggregateGamePricesInput = z.infer<typeof AggregateGamePricesInputSchema>;

const AggregateGamePricesOutputSchema = z.object({
  prices: z.array(
    z.object({
      retailer: z.string().describe('The name of the retailer.'),
      price: z.string().describe('The price of the game at the retailer.'),
      url: z.string().describe('The URL to the game page on the retailer website.'),
    })
  ).describe('An array of prices from different retailers.'),
});
export type AggregateGamePricesOutput = z.infer<typeof AggregateGamePricesOutputSchema>;

export async function aggregateGamePrices(input: AggregateGamePricesInput): Promise<AggregateGamePricesOutput> {
  return aggregateGamePricesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aggregateGamePricesPrompt',
  input: {schema: AggregateGamePricesInputSchema},
  output: {schema: AggregateGamePricesOutputSchema},
  prompt: `You are a price aggregation service for video games. Given the name of a game, you will search for its price on major online retailers and return a list of prices, retailer names, and URLs.

Game Name: {{{gameName}}}

Format your response as a JSON array of objects, where each object has the keys 'retailer', 'price', and 'url'.  The 'price' field should include the currency symbol.
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

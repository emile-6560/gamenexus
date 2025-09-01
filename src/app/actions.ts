'use server';

import { aggregateGamePrices } from '@/ai/flows/aggregate-game-prices';
import type { AggregateGamePricesOutput } from '@/ai/flows/aggregate-game-prices';

export async function findPricesAction(gameName: string): Promise<AggregateGamePricesOutput> {
  try {
    // Add a fake delay to simulate a real-world scenario and show loading state
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, the AI call would be here.
    // For this mock-up, we return static data that matches the expected output schema.
    const mockPrices = [
        { retailer: 'Steam', price: '$29.99', url: '#' },
        { retailer: 'GOG.com', price: '$27.99', url: '#' },
        { retailer: 'Epic Games Store', price: '$39.99', url: '#' },
    ];
    
    // The AI might return an empty array if no prices are found.
    const shouldReturnEmpty = Math.random() > 0.8;
    
    const output: AggregateGamePricesOutput = {
        prices: shouldReturnEmpty ? [] : mockPrices,
    };
    
    return output;
    
    // The actual call to the AI flow is commented out to avoid using credits/API calls during development without a real backend.
    // const result = await aggregateGamePrices({ gameName });
    // return result;

  } catch (error) {
    console.error('Error in findPricesAction:', error);
    throw new Error('Failed to fetch game prices.');
  }
}

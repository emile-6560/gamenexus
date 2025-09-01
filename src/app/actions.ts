'use server';

import { aggregateGamePrices } from '@/ai/flows/aggregate-game-prices';
import type { AggregateGamePricesOutput } from '@/ai/flows/aggregate-game-prices';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GameStatus } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function findPricesAction(gameName: string): Promise<AggregateGamePricesOutput> {
  try {
    const result = await aggregateGamePrices({ gameName });
    return result;

  } catch (error) {
    console.error('Error in findPricesAction:', error);
    throw new Error('Failed to fetch game prices.');
  }
}

export async function updateUserGameStatus(userId: string, gameId: number, status: GameStatus, gameName: string) {
  try {
    const userGameRef = doc(db, 'users', userId, 'games', String(gameId));
    await setDoc(userGameRef, {
      gameId,
      status,
      gameName,
      updatedAt: new Date(),
    });
    // Revalidate the experiences page to show the new status
    revalidatePath('/my-experiences');
  } catch (error) {
    console.error('Error updating game status:', error);
    throw new Error('Failed to update game status.');
  }
}

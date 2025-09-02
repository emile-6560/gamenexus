
'use server';

import { aggregateGamePrices } from '@/ai/flows/aggregate-game-prices';
import type { AggregateGamePricesOutput } from '@/ai/flows/aggregate-game-prices';
import { generateGameConcept } from '@/ai/flows/generate-game-concept';
import type { GenerateGameConceptOutput } from '@/ai/flows/generate-game-concept';
import { doc, setDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Game, GameStatus, UserGame } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { getGameDetails } from '@/lib/igdb-api';

export async function findPricesAction(gameName: string): Promise<AggregateGamePricesOutput> {
  try {
    const result = await aggregateGamePrices({ gameName });
    return result;

  } catch (error) {
    console.error('Error in findPricesAction:', error);
    throw new Error('Failed to fetch game prices.');
  }
}

export async function generateGameConceptAction(prompt: string): Promise<GenerateGameConceptOutput> {
    try {
        const result = await generateGameConcept({ prompt });
        return result;
    } catch (error) {
        console.error('Error in generateGameConceptAction:', error);
        throw new Error('Failed to generate game concept.');
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
    }, { merge: true });
    // Revalidate the experiences page to show the new status
    revalidatePath('/my-experiences');
  } catch (error) {
    console.error('Error updating game status:', error);
    throw new Error('Failed to update game status.');
  }
}

export async function getUserGames(userId: string): Promise<(Game & { status: GameStatus })[]> {
    try {
        const userGamesRef = collection(db, 'users', userId, 'games');
        const q = query(userGamesRef, orderBy('updatedAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const userGames: UserGame[] = [];
        querySnapshot.forEach((doc) => {
            userGames.push(doc.data() as UserGame);
        });

        const gamesWithDetails = await Promise.all(
            userGames
                .filter(ug => ug.status === 'playing' || ug.status === 'played')
                .map(async (userGame) => {
                    const gameDetails = await getGameDetails(userGame.gameId);
                    if (gameDetails) {
                        return {
                            ...gameDetails,
                            status: userGame.status,
                        };
                    }
                    return null;
                })
        );

        return gamesWithDetails.filter((g): g is Game & { status: GameStatus } => g !== null);
    } catch (error) {
        console.error('Error fetching user games:', error);
        throw new Error('Failed to fetch user games.');
    }
}

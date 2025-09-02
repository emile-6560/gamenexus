
'use server';

import { aggregateGamePrices } from '@/ai/flows/aggregate-game-prices';
import type { AggregateGamePricesOutput } from '@/ai/flows/aggregate-game-prices';
import { findGames } from '@/ai/flows/find-games';
import type { FindGamesOutput } from '@/ai/flows/find-games';
import { doc, setDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Game, GameStatus, UserGame } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { getGameDetails, getGames } from '@/lib/igdb-api';

export async function findPricesAction(gameName: string): Promise<AggregateGamePricesOutput> {
  try {
    const result = await aggregateGamePrices({ gameName });
    return result;

  } catch (error) {
    console.error('Error in findPricesAction:', error);
    throw new Error('Failed to fetch game prices.');
  }
}

export async function findGamesAction(query: string): Promise<{ intro: string; games: Game[] }> {
    try {
        const aiResult = await findGames({ query });
        
        if (!aiResult || aiResult.games.length === 0) {
            return { intro: "Désolé, l'IA n'a trouvé aucune recommandation pour votre recherche. Essayez d'être plus précis !", games: [] };
        }

        const gamePromises = aiResult.games.map(async (recommendedGame) => {
            try {
                // Search for the game recommended by the AI
                const searchResult = await getGames({ search: recommendedGame.name, limit: 1 });
                if (searchResult.games.length > 0) {
                    // If found, return its details along with the reason from the AI
                    return { ...searchResult.games[0], reason: recommendedGame.reason };
                }
                 return null; // Return null if not found
            } catch (searchError) {
                console.error(`Error fetching details for game "${recommendedGame.name}":`, searchError);
                return null; // Ignore games that fail to fetch
            }
        });

        // Wait for all searches to complete and filter out any null results
        const gamesWithDetails = (await Promise.all(gamePromises)).filter((g): g is Game & { reason: string } => g !== null);
        
        // If after all searches, no games were found, return the intro text with an empty array
        // This prevents the generic error and gives a better user experience.
        if (gamesWithDetails.length === 0) {
            return { intro: "L'IA a fait des suggestions, mais nous n'avons pas trouvé de correspondances exactes dans notre base de données. Voici ce que l'IA a dit : " + aiResult.recommendationText, games: [] };
        }
        
        // If we have games, return them with the original intro text.
        return { intro: aiResult.recommendationText, games: gamesWithDetails };

    } catch (error) {
        console.error('Error in findGamesAction:', error);
        // This will now only catch major errors, like the AI service being down.
        throw new Error('Une erreur est survenue lors de la communication avec le service IA.');
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


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
        
        if (!aiResult) {
            return { intro: "Désolé, l'IA n'a pas pu traiter votre demande. Veuillez réessayer.", games: [] };
        }
        
        if (!aiResult.games || aiResult.games.length === 0) {
            return { intro: aiResult.recommendationText || "L'IA n'a trouvé aucune recommandation pour votre recherche. Essayez d'être plus précis !", games: [] };
        }

        const gamePromises = aiResult.games.map(async (recommendedGame) => {
            try {
                const searchResult = await getGames({ search: recommendedGame.name, limit: 1 });
                if (searchResult.games.length > 0) {
                    return { ...searchResult.games[0], reason: recommendedGame.reason };
                }
                 return null;
            } catch (searchError) {
                console.error(`Error fetching details for game "${recommendedGame.name}":`, searchError);
                return null;
            }
        });

        const gamesWithDetails = (await Promise.all(gamePromises)).filter((g): g is Game & { reason: string } => g !== null);
        
        const introText = aiResult.recommendationText || "Voici quelques recommandations basées sur votre recherche :";

        if (gamesWithDetails.length === 0) {
            return { intro: "L'IA a fait des suggestions, mais nous n'avons pas trouvé de correspondances dans notre base de données. Voici son message : \"" + introText + "\"", games: [] };
        }
        
        return { intro: introText, games: gamesWithDetails };

    } catch (error) {
        console.error('Error in findGamesAction:', error);
        throw new Error("Une erreur de communication est survenue avec l'assistant IA. Veuillez réessayer.");
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

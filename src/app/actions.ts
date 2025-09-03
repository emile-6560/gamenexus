
'use server';

import { aggregatePrices } from '@/ai/flows/aggregate-game-prices';
import type { AggregateGamePricesInput, AggregateGamePricesOutput } from '@/lib/price-aggregator-types';
import { findGamesFlow } from '@/ai/flows/find-games';
import type { FindGamesInput, FindGamesOutput } from '@/lib/game-discovery-types';
import { chatFlow } from '@/ai/flows/chat';
import type { ChatInput, ChatMessage } from '@/lib/chat-types';
import { doc, setDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Game, GameStatus, UserGame } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { getGameDetails, getGames } from '@/lib/igdb-api';

export async function findPricesAction(gameName: string): Promise<AggregateGamePricesOutput> {
  try {
    const result = await aggregatePrices({ gameName });
    return result;

  } catch (error) {
    console.error('Error in findPricesAction:', error);
    throw new Error('Failed to fetch game prices.');
  }
}

export async function findGamesAction(query: string): Promise<{ intro: string; games: Game[] }> {
    try {
        const aiResult = await findGamesFlow({ query });

        if (!aiResult || !aiResult.games) {
            return {
                intro: aiResult?.recommendationText || "Désolé, je n'ai rien trouvé. Essayez une autre recherche !",
                games: []
            };
        }
        
        if (aiResult.games.length === 0) {
            return { 
                intro: aiResult.recommendationText || "Je n'ai pas trouvé de jeux correspondant à votre recherche. Essayez d'être plus précis !", 
                games: [] 
            };
        }

        const gamePromises = aiResult.games.map(async (recommendedGame) => {
            try {
                const searchResult = await getGames({ search: recommendedGame.name, limit: 1 });
                if (searchResult.games.length > 0) {
                    return { ...searchResult.games[0], reason: recommendedGame.reason };
                }
                console.warn(`No game found in DB for AI recommendation: "${recommendedGame.name}"`);
                return null;
            } catch (searchError) {
                console.error(`Error fetching details for game "${recommendedGame.name}":`, searchError);
                return null;
            }
        });

        const gamesWithDetails = (await Promise.all(gamePromises)).filter((g): g is Game & { reason: string } => g !== null);
        
        const introText = aiResult.recommendationText || "Voici quelques recommandations basées sur votre recherche :";
        
        if (gamesWithDetails.length === 0) {
             return { 
                intro: aiResult.recommendationText || "Je n'ai pas trouvé de jeux correspondants dans notre base de données pour les suggestions de l'IA. Essayez une autre recherche !", 
                games: [] 
            };
        }

        return { intro: introText, games: gamesWithDetails };

    } catch (error) {
        console.error('Error in findGamesAction (AI communication or processing):', error);
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

export async function chatAction(history: ChatMessage[]): Promise<string> {
    try {
        const result = await chatFlow({ history });
        return result.text;
    } catch (error) {
        console.error("Error in chatAction:", error);
        throw new Error("Une erreur de communication est survenue avec l'assistant IA. Veuillez réessayer.");
    }
}

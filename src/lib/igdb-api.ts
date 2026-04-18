'use server';

import type { Game, Platform, Franchise, Studio } from './types';

const IGDB_API_URL = 'https://api.igdb.com/v4';
const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN;

/**
 * Fonction de fetch optimisée avec gestion d'erreurs robuste
 */
async function fetchFromIGDB(endpoint: string, query: string) {
  if (!CLIENT_ID || !ACCESS_TOKEN) {
    console.error('CRITICAL: IGDB API credentials missing in Environment Variables.');
    return null;
  }

  try {
    const response = await fetch(`${IGDB_API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Client-ID': CLIENT_ID,
        'Authorization': `Bearer ${ACCESS_TOKEN.trim()}`,
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
      },
      body: query,
      // On évite le cache agressif pour les tests, tu pourras remettre revalidate plus tard
      next: { revalidate: 0 } 
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`IGDB API Error [${response.status}]:`, errorData);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Network Error fetching from IGDB:', error);
    return null;
  }
}

// --- Helpers de formatage ---

function formatCoverUrl(url?: string) {
  return url ? `https:${url.replace('t_thumb', 't_cover_big_2x')}` : '/placeholder.jpg';
}

function formatScreenshotUrl(url?: string) {
  return url ? `https:${url.replace('t_thumb', 't_screenshot_huge')}` : '/placeholder.jpg';
}

function formatLogoUrl(url?: string) {
  return url ? `https:${url.replace('t_thumb', 't_logo_med')}` : '/placeholder.jpg';
}

function mapGame(game: any): Game {
  const developers = (game.involved_companies || [])
    .filter((c: any) => c.developer)
    .map((c: any) => c.company).filter(Boolean);

  const publishers = (game.involved_companies || [])
    .filter((c: any) => c.publisher)
    .map((c: any) => c.company).filter(Boolean);

  return {
    id: game.id,
    name: game.name,
    description: game.summary,
    coverUrl: formatCoverUrl(game.cover?.url),
    platforms: game.platforms || [],
    rating: game.total_rating || 0,
    screenshots: (game.screenshots || []).map((ss: any) => ({
      id: ss.id,
      url: formatScreenshotUrl(ss.url)
    })),
    releaseDate: game.first_release_date,
    genres: game.genres || [],
    themes: game.themes || [],
    franchises: game.franchises || [],
    gameModes: game.game_modes || [],
    videos: game.videos || [],
    developers: developers,
    publishers: publishers,
  };
}

// --- Fonctions Exportées ---

type GetGamesOptions = {
  search?: string;
  platform?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export async function getGames({ 
  search = '', 
  platform, 
  page = 1, 
  limit = 20, 
  sortBy = 'total_rating_count desc' 
}: GetGamesOptions = {}): Promise<{ games: Game[], totalCount: number }> {
  
  let whereClauses = [
    'total_rating > 0',
    'total_rating_count > 0',
    'version_parent = null',
    'parent_game = null',
    'first_release_date != null',
  ];

  if (search) whereClauses.push(`name ~ *"${search}"*`);
  if (platform) whereClauses.push(`platforms.name = "${platform}"`);

  const whereString = whereClauses.join(' & ');
  const offset = (page - 1) * limit;

  // Récupération du compte total
  const countResult = await fetchFromIGDB('games/count', `where ${whereString};`);
  const totalCount = countResult?.count || 0;

  // Récupération des jeux (Protection : si games est null, on utilise un tableau vide)
  const gamesData = await fetchFromIGDB('games', `
    fields name, cover.url, platforms.name, total_rating, first_release_date, involved_companies.developer, involved_companies.publisher, involved_companies.company.name;
    where ${whereString};
    sort ${sortBy};
    limit ${limit};
    offset ${offset};
  `);

  const formattedGames = (gamesData || []).map(mapGame);

  return { games: formattedGames, totalCount: Math.min(totalCount, 5000) };
}

export async function getGameDetails(id: number): Promise<Game | null> {
  const query = `
    fields name, summary, cover.url, platforms.name, total_rating, screenshots.url, first_release_date, 
    genres.name, themes.name, franchises.name, game_modes.name, videos.video_id, 
    involved_companies.company.name, involved_companies.developer, involved_companies.publisher;
    where id = ${id};
  `;
  const games = await fetchFromIGDB('games', query);
  if (!games || games.length === 0) return null;
  return mapGame(games[0]);
}

export async function getPlatforms(): Promise<Platform[]> {
  const popularIds = [6, 48, 49, 130, 167, 169]; 
  const query = `fields name; where id = (${popularIds.join(',')}); limit 10;`;
  const platforms = await fetchFromIGDB('platforms', query);

  const platformMap = new Map<string, Platform>();
  (platforms || []).forEach((p: any) => {
    let name = p.name;
    if (name.includes('PlayStation')) name = 'PlayStation';
    if (name.includes('Xbox')) name = 'Xbox';
    if (name.includes('PC')) name = 'PC';
    if (name.includes('Nintendo Switch')) name = 'Nintendo Switch';
    platformMap.set(name, { id: p.id, name });
  });

  return Array.from(platformMap.values());
}

export async function getFranchises({ page = 1, limit = 20, search = '' } = {}): Promise<{ franchises: Franchise[], totalCount: number }> {
  const offset = (page - 1) * limit;
  let where = 'games > 0';
  if (search) where += ` & name ~ *"${search}"*`;

  const countRes = await fetchFromIGDB('franchises/count', `where ${where};`);
  const franchisesData = await fetchFromIGDB('franchises', `
    fields name, games.name, games.cover.url;
    where ${where}; sort name asc; limit ${limit}; offset ${offset};
  `);

  const finalFranchises = (franchisesData || []).map((f: any) => {
    const gameWithCover = f.games?.find((g: any) => g.cover?.url);
    return {
      id: f.id,
      name: f.name,
      coverUrl: gameWithCover ? formatCoverUrl(gameWithCover.cover.url) : '/placeholder.jpg',
      games: f.games || [],
    };
  });

  return { franchises: finalFranchises, totalCount: countRes?.count || 0 };
}

'use server';

import type { Game, Platform, Franchise, Studio } from './types';

const IGDB_API_URL = 'https://api.igdb.com/v4';
const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN;

/**
 * Moteur de requête centralisé avec gestion d'erreurs 401 et 404
 */
async function fetchFromIGDB(endpoint: string, query: string) {
  if (!CLIENT_ID || !ACCESS_TOKEN) {
    console.error('ERREUR : Clés API manquantes dans les variables d\'environnement Vercel.');
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
      next: { revalidate: 3600 } // Cache d'une heure pour la performance
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`IGDB API Error [${response.status}] sur ${endpoint}:`, errorData);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur réseau IGDB:', error);
    return null;
  }
}

// --- Helpers de formatage d'images ---
const formatImg = (url?: string, size: string = 't_cover_big_2x') => 
  url ? `https:${url.replace('t_thumb', size)}` : '/placeholder.jpg';

// --- Mapping universel des données ---
function mapGame(game: any): Game {
  return {
    id: game.id,
    name: game.name,
    description: game.summary,
    coverUrl: formatImg(game.cover?.url),
    platforms: game.platforms || [],
    rating: game.total_rating || 0,
    screenshots: (game.screenshots || []).map((ss: any) => ({ id: ss.id, url: formatImg(ss.url, 't_screenshot_huge') })),
    releaseDate: game.first_release_date,
    genres: game.genres || [],
    themes: game.themes || [],
    franchises: game.franchises || [],
    gameModes: game.game_modes || [],
    videos: (game.videos || []).map((v: any) => ({ id: v.id, videoId: v.video_id })),
    developers: (game.involved_companies || []).filter((c: any) => c.developer).map((c: any) => c.company?.name).filter(Boolean),
    publishers: (game.involved_companies || []).filter((c: any) => c.publisher).map((c: any) => c.company?.name).filter(Boolean),
  };
}

// --- 1. SECTION JEUX (TRI ET FILTRES FIXÉS) ---
export async function getGames({ 
  search = '', 
  platform = '', 
  page = 1, 
  limit = 20, 
  sortBy = 'total_rating_count:desc' // Format IGDB : champ:ordre
} = {}) {
  
  let whereClauses = [
    'version_parent = null',
    'parent_game = null',
    'first_release_date != null',
    'cover.url != null'
  ];

  // Si pas de recherche, on filtre les jeux sans note pour avoir de la qualité
  if (!search) {
    whereClauses.push('total_rating > 0');
  } else {
    whereClauses.push(`name ~ *"${search}"*`);
  }

  // Filtre Plateforme (Correction : on vérifie que ce n'est pas "all")
  if (platform && platform !== 'all') {
    whereClauses.push(`platforms.name = "${platform}"`);
  }

  const whereString = whereClauses.join(' & ');
  const offset = (page - 1) * limit;

  // Construction du tri (On nettoie le sortBy pour être sûr du format)
  const cleanSort = sortBy.replace(' ', ':'); 

  // Requête vers IGDB
  const countRes = await fetchFromIGDB('games/count', `where ${whereString};`);
  const gamesData = await fetchFromIGDB('games', `
    fields name, summary, cover.url, platforms.name, total_rating, total_rating_count, first_release_date;
    where ${whereString};
    ${search ? '' : `sort ${cleanSort};`}
    limit ${limit};
    offset ${offset};
  `);

  return { 
    games: (gamesData || []).map(mapGame), 
    totalCount: countRes?.count || 0 
  };
}

// --- 2. SECTION FRANCHISES ---
export async function getFranchises({ page = 1, limit = 20, search = '' } = {}) {
  const offset = (page - 1) * limit;
  let where = 'games > 0';
  if (search) where += ` & name ~ *"${search}"*`;

  const countRes = await fetchFromIGDB('franchises/count', `where ${where};`);
  const franchisesData = await fetchFromIGDB('franchises', `
    fields name, games.name, games.cover.url;
    where ${where}; sort name asc; limit ${limit}; offset ${offset};
  `);

  const formatted = (franchisesData || []).map((f: any) => {
    const gameWithCover = f.games?.find((g: any) => g.cover?.url);
    return {
      id: f.id,
      name: f.name,
      coverUrl: formatImg(gameWithCover?.cover?.url),
      games: f.games || [],
    };
  });

  return { franchises: formatted, totalCount: countRes?.count || 0 };
}

// --- 3. SECTION STUDIOS ---
export async function getStudios({ page = 1, limit = 20, search = '' } = {}) {
  const offset = (page - 1) * limit;
  let where = 'developed != null & logo != null';
  if (search) where += ` & name ~ *"${search}"*`;

  const countRes = await fetchFromIGDB('companies/count', `where ${where};`);
  const studiosData = await fetchFromIGDB('companies', `
    fields name, logo.url, developed.name;
    where ${where}; sort name asc; limit ${limit}; offset ${offset};
  `);

  const formatted = (studiosData || []).map((s: any) => ({
    id: s.id,
    name: s.name,
    logoUrl: formatImg(s.logo?.url, 't_logo_med'),
    developed: (s.developed || []).slice(0, 5), // On limite à 5 jeux pour l'affichage
  }));

  return { studios: formatted, totalCount: countRes?.count || 0 };
}

// --- 4. DÉTAILS D'UN JEU ---
export async function getGameDetails(id: number) {
  const data = await fetchFromIGDB('games', `
    fields name, summary, cover.url, platforms.name, total_rating, screenshots.url, 
    first_release_date, genres.name, themes.name, involved_companies.company.name, 
    involved_companies.developer, involved_companies.publisher, videos.video_id; 
    where id = ${id};
  `);
  return data && data.length > 0 ? mapGame(data[0]) : null;
}

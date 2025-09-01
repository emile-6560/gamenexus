'use server';

import type { Game, Platform, GameImage } from './types';

const IGDB_API_URL = 'https://api.igdb.com/v4';
const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN;

async function fetchFromIGDB(endpoint: string, query: string) {
  if (!CLIENT_ID || !ACCESS_TOKEN || CLIENT_ID === 'your_client_id_here') {
    console.error('IGDB API credentials are not configured.');
    // Return empty array or throw error if not configured
    if (endpoint === 'games') return [];
    if (endpoint === 'platforms') return [];
    return null;
  }
  
  try {
    const response = await fetch(`${IGDB_API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Client-ID': CLIENT_ID,
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Accept': 'application/json',
      },
      body: query,
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      console.error(`IGDB API error: ${response.status} ${response.statusText}`, await response.json());
      throw new Error('Failed to fetch from IGDB API');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching from IGDB:', error);
    throw error;
  }
}

function formatCoverUrl(url?: string) {
  return url ? `https:${url.replace('t_thumb', 't_cover_big_2x')}` : '/placeholder.jpg';
}

function formatScreenshotUrl(url?: string) {
    return url ? `https:${url.replace('t_thumb', 't_screenshot_huge')}` : '/placeholder.jpg';
}


export async function getGames(): Promise<Game[]> {
  const query = `
    fields name, cover.url, platforms.name, total_rating;
    where total_rating > 80 & total_rating_count > 100 & version_parent = null & parent_game = null;
    sort total_rating_count desc;
    limit 200;
  `;
  const games = await fetchFromIGDB('games', query);
  
  if (!games) return [];

  return games.map((game: any) => ({
    id: game.id,
    name: game.name,
    coverUrl: formatCoverUrl(game.cover?.url),
    platforms: game.platforms || [],
    rating: game.total_rating || 0,
    description: '', // Not fetched in list view
    screenshots: [], // Not fetched in list view
  }));
}

export async function getGameDetails(id: number): Promise<Game | null> {
    const query = `
      fields name, summary, cover.url, platforms.name, total_rating, screenshots.url;
      where id = ${id};
    `;
    const games = await fetchFromIGDB('games', query);

    if (!games || games.length === 0) return null;

    const game = games[0];

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
    };
}


export async function getPlatforms(): Promise<Platform[]> {
    const popularPlatformIds = [6, 48, 49, 130, 167, 169]; // PC, PS4, PS5, Switch, Xbox One, Xbox Series X/S
    const query = `
        fields name;
        where id = (${popularPlatformIds.join(',')});
        limit 10;
    `;
    const platforms = await fetchFromIGDB('platforms', query);

    const platformMap = new Map<string, Platform>();

    if(platforms) {
        platforms.forEach((p: any) => {
            let name = p.name;
            if (name.includes('PlayStation')) name = 'PlayStation';
            if (name.includes('Xbox')) name = 'Xbox';
            if (name.includes('PC')) name = 'PC';

            if(!platformMap.has(name)) {
                platformMap.set(name, { id: p.id, name });
            }
        });
    }
    
    // Ensure base platforms are present if not fetched
    if (!platformMap.has('PC')) platformMap.set('PC', {id: 6, name: 'PC'});
    if (!platformMap.has('PlayStation')) platformMap.set('PlayStation', {id: 48, name: 'PlayStation'});
    if (!platformMap.has('Xbox')) platformMap.set('Xbox', {id: 49, name: 'Xbox'});


    return Array.from(platformMap.values());
}

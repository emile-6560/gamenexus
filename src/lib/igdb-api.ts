
'use server';

import type { Game, Platform, GameImage } from './types';

const IGDB_API_URL = 'https://api.igdb.com/v4';
const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN;

async function fetchFromIGDB(endpoint: string, query: string) {
  if (!CLIENT_ID || !ACCESS_TOKEN || CLIENT_ID === 'your_client_id_here') {
    console.error('IGDB API credentials are not configured.');
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

type GetGamesOptions = {
    limit?: number;
    offset?: number;
    search?: string;
    platform?: string;
}

export async function getGames({ limit = 50, offset = 0, search = '', platform }: GetGamesOptions = {}): Promise<Game[]> {
  let whereClauses = [
    'total_rating > 80',
    'total_rating_count > 100',
    'version_parent = null',
    'parent_game = null'
  ];

  if (search) {
    whereClauses.push(`name ~ *"${search}"*`);
  }

  if (platform) {
    whereClauses.push(`platforms.name = "${platform}"`);
  }
  
  const whereString = whereClauses.join(' & ');
  
  const query = `
    fields name, cover.url, platforms.name, total_rating;
    where ${whereString};
    sort total_rating_count desc;
    limit ${limit};
    offset ${offset};
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
            if (name.includes('Nintendo Switch')) name = 'Nintendo Switch';
            if (name.includes('macOS')) name = 'macOS';

            if(!platformMap.has(name) && popularPlatformIds.includes(p.id)) {
                platformMap.set(name, { id: p.id, name });
            }
        });
    }
    
    // Ensure base platforms are present if not fetched
    if (!platformMap.has('PC')) platformMap.set('PC', {id: 6, name: 'PC'});
    if (!platformMap.has('PlayStation')) platformMap.set('PlayStation', {id: 48, name: 'PlayStation'});
    if (!platformMap.has('Xbox')) platformMap.set('Xbox', {id: 49, name: 'Xbox'});
    if (!platformMap.has('Nintendo Switch')) platformMap.set('Nintendo Switch', {id: 130, name: 'Nintendo Switch'});
    if (!platformMap.has('macOS')) platformMap.set('macOS', {id: 14, name: 'macOS'});


    return Array.from(platformMap.values());
}

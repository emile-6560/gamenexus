
'use server';

import type { Game, Platform, Franchise } from './types';

const IGDB_API_URL = 'https://api.igdb.com/v4';
const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN;

async function fetchFromIGDB(endpoint: string, query: string) {
  if (!CLIENT_ID || !ACCESS_TOKEN || CLIENT_ID === 'your_client_id_here') {
    console.error('IGDB API credentials are not configured.');
    if (endpoint.endsWith('/count')) return { count: 0 };
    if (endpoint === 'games') return [];
    if (endpoint === 'platforms') return [];
    if (endpoint === 'franchises') return [];
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
    search?: string;
    platform?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
}

export async function getGames({ search = '', platform, page = 1, limit = 100, sortBy = 'total_rating_count desc' }: GetGamesOptions = {}): Promise<{ games: Game[], totalCount: number }> {
  
  const targetPlatformIds = [6, 48, 49, 130, 167, 169]; // PC, PS4, Xbox One, Switch, PS5, Xbox Series X/S

  let whereClauses = [
    'total_rating > 0',
    'total_rating_count > 0',
    'version_parent = null',
    'parent_game = null',
    `platforms = (${targetPlatformIds.join(',')})`,
    'first_release_date != null',
  ];

  if (search) {
    whereClauses.push(`name ~ *"${search}"*`);
  }

  if (platform) {
    whereClauses.push(`platforms.name = "${platform}"`);
  }

  const whereString = whereClauses.join(' & ');
  const offset = (page - 1) * limit;

  // Fetch total count
  const countQuery = `where ${whereString};`;
  const countResult = await fetchFromIGDB('games/count', countQuery);
  const totalCount = countResult?.count || 0;

  // Fetch games for the current page
  const gamesQuery = `
      fields name, cover.url, platforms.name, total_rating, first_release_date;
      where ${whereString};
      sort ${sortBy};
      limit ${limit};
      offset ${offset};
  `;
    
  const games = await fetchFromIGDB('games', gamesQuery);

  const formattedGames = games.map((game: any) => ({
      id: game.id,
      name: game.name,
      coverUrl: formatCoverUrl(game.cover?.url),
      platforms: game.platforms || [],
      rating: game.total_rating || 0,
      description: '', // Not fetched in list view
      screenshots: [], // Not fetched in list view
      releaseDate: game.first_release_date,
      genres: [],
      franchises: [],
      gameModes: [],
      themes: [],
      videos: [],
      developers: [],
      publishers: [],
  }));

  return { games: formattedGames, totalCount: Math.min(totalCount, 10000) };
}


export async function getGameDetails(id: number): Promise<Game | null> {
    const query = `
      fields 
        name, 
        summary, 
        cover.url, 
        platforms.name, 
        total_rating, 
        screenshots.url, 
        first_release_date,
        genres.name,
        themes.name,
        franchises.name,
        game_modes.name,
        videos.video_id,
        involved_companies.company.name,
        involved_companies.developer,
        involved_companies.publisher;
      where id = ${id};
    `;
    const games = await fetchFromIGDB('games', query);

    if (!games || games.length === 0) return null;

    const game = games[0];

    const developers = (game.involved_companies || [])
        .filter((c: any) => c.developer)
        .map((c: any) => c.company);

    const publishers = (game.involved_companies || [])
        .filter((c: any) => c.publisher)
        .map((c: any) => c.company);

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


export async function getPlatforms(): Promise<Platform[]> {
    const popularPlatformIds = [6, 48, 49, 130, 167, 169]; // PC, PS4, Xbox One, Switch, PS5, Xbox Series X/S
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


    return Array.from(platformMap.values());
}

export async function getFranchises(): Promise<Franchise[]> {
  const query = `
    fields name, games.name, games.cover.url;
    where games.count > 5;
    limit 50;
  `;
  const franchises = await fetchFromIGDB('franchises', query);
  
  if (!franchises) return [];

  return franchises.map((franchise: any) => ({
    id: franchise.id,
    name: franchise.name,
    coverUrl: franchise.games && franchise.games.length > 0 && franchise.games[0].cover ? formatCoverUrl(franchise.games[0].cover.url) : '/placeholder.jpg',
    games: franchise.games || [],
  }));
}

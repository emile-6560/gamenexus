
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Gamepad, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GameCard, GameCardSkeleton } from '@/components/game-card';
import { getGames, getPlatforms } from '@/lib/igdb-api';
import type { Game, Platform } from '@/lib/types';
import { useDebounce } from '@/hooks/use-debounce';

const GAMES_PER_PAGE = 50;

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const loaderRef = useRef(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const loadGames = useCallback(async (reset = false) => {
    if (isLoading || (!hasMore && !reset)) return;
    setIsLoading(true);

    const currentPage = reset ? 0 : page;
    const newGames = await getGames({
      limit: GAMES_PER_PAGE,
      offset: currentPage * GAMES_PER_PAGE,
      search: debouncedSearchQuery,
      platform: selectedPlatform === 'all' ? undefined : selectedPlatform,
    });
    
    setGames(prev => reset ? newGames : [...prev, ...newGames]);
    setPage(currentPage + 1);
    setHasMore(newGames.length === GAMES_PER_PAGE);
    setIsLoading(false);
    if(isInitialLoad) setIsInitialLoad(false);
  }, [isLoading, hasMore, page, debouncedSearchQuery, selectedPlatform, isInitialLoad]);

  useEffect(() => {
    setIsClient(true);
    const fetchPlatforms = async () => {
      const platformsData = await getPlatforms();
      setPlatforms(platformsData);
    };
    fetchPlatforms();
  }, []);
  
  useEffect(() => {
    setGames([]);
    setPage(0);
    setHasMore(true);
    loadGames(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, selectedPlatform]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore && !isInitialLoad) {
          loadGames();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isLoading, hasMore, loadGames, isInitialLoad]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-6 px-4 sm:px-6 md:px-8 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Gamepad className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground tracking-tight">GameFinder</h1>
          </Link>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {isClient ? (
            <>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for a game..."
                  className="pl-10 h-12 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedPlatform} onValueChange={(value) => setSelectedPlatform(value)}>
                <SelectTrigger className="w-full sm:w-[200px] h-12 text-lg">
                  <SelectValue placeholder="Filter by platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {platforms.map(platform => (
                    <SelectItem key={platform.id} value={platform.name}>
                      {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          ) : (
            <>
              <div className="relative flex-1 h-12 bg-muted rounded-md" />
              <div className="w-full sm:w-[200px] h-12 bg-muted rounded-md" />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {games.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
        
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
             {Array.from({ length: GAMES_PER_PAGE / 2 }).map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        )}
        
        <div ref={loaderRef} />

        {!isLoading && !hasMore && games.length > 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <p>You've reached the end of the list.</p>
          </div>
        )}

        {!isLoading && games.length === 0 && !isInitialLoad &&(
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-2">No Games Found</h2>
            <p className="text-muted-foreground">Try adjusting your search or filter.</p>
          </div>
        )}
      </main>
    </div>
  );
}

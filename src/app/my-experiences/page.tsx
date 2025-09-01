
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GameCard, GameCardSkeleton } from '@/components/game-card';
import type { Game, UserGame } from '@/lib/types';
import { getUserGames } from '@/app/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MyExperiencesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchGames = async () => {
        setLoading(true);
        const userGames = await getUserGames(user.uid);
        setGames(userGames);
        setLoading(false);
      };
      fetchGames();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
                {Array.from({ length: 10 }).map((_, i) => (
                <GameCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
  }

  const playingGames = games.filter(g => (g as any).status === 'playing');
  const playedGames = games.filter(g => (g as any).status === 'played');

  const GameList = ({ games, status }: { games: Game[], status: string }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
                {Array.from({ length: 5 }).map((_, i) => (
                <GameCardSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (games.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold mb-2">Aucun jeu {status}</h2>
                <p className="text-muted-foreground">Revenez quand vous aurez mis à jour le statut de quelques jeux.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
            {games.map(game => (
                <GameCard key={game.id} game={game} />
            ))}
        </div>
    )
  }


  return (
    <main className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
        <h1 className="text-4xl font-extrabold tracking-tighter mb-8">Mes Expériences</h1>
        <Tabs defaultValue="playing">
            <TabsList>
                <TabsTrigger value="playing">Commencé ({playingGames.length})</TabsTrigger>
                <TabsTrigger value="played">Terminé ({playedGames.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="playing">
                <GameList games={playingGames} status="commencé" />
            </TabsContent>
            <TabsContent value="played">
                <GameList games={playedGames} status="terminé" />
            </TabsContent>
        </Tabs>
    </main>
  );
}

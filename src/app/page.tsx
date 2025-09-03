
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { findGamesAction } from '@/app/actions';
import { Game } from '@/lib/types';
import { Loader2, Wand2 } from 'lucide-react';
import { AiGameCard, AiGameCardSkeleton } from '@/components/ai-game-card';

export default function AiSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ intro: string; games: Game[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResults(null);
    try {
      const searchResult = await findGamesAction(query);
      setResults(searchResult);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur IA',
        description: error.message || "Une erreur est survenue lors de la recherche.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
      <div className="text-center my-8 md:my-16">
        <div className="inline-block bg-primary/10 text-primary p-3 rounded-full mb-4">
            <Wand2 className="h-8 w-8" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: Un RPG post-apocalyptique avec du craft..."
            className="flex-1 h-14 text-lg"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !query.trim()} size="lg" className="h-14">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Rechercher'}
          </Button>
        </form>
      </div>

      <div className="mt-12">
        {loading && (
            <div>
                <p className="text-center text-muted-foreground animate-pulse mb-6">L'IA réfléchit à ses meilleures suggestions...</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <AiGameCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        )}
        
        {results && (
            <div className="animate-in fade-in-50">
                <p className="text-center text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">{results.intro}</p>
                
                {results.games.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {results.games.map(game => (
                            <AiGameCard key={game.id} game={game} />
                        ))}
                    </div>
                ) : (
                    !loading && (
                        <div className="text-center py-10 bg-muted rounded-lg">
                             <p className="text-xl font-semibold">Aucun jeu correspondant trouvé.</p>
                        </div>
                    )
                )}
            </div>
        )}
      </div>
    </main>
  );
}

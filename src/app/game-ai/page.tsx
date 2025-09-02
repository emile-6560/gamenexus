
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { findGamesAction } from '@/app/actions';
import { Loader2, Wand2, Bot, Sparkles } from 'lucide-react';
import type { Game } from '@/lib/types';
import { GameCard, GameCardSkeleton } from '@/components/game-card';

export default function GameAiPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ intro: string; games: (Game & {reason?: string})[] } | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Veuillez décrire ce que vous recherchez.' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const response = await findGamesAction(query);
      setResult(response);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erreur', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const ResultDisplay = () => {
    if (loading) {
      return (
        <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
                {Array.from({ length: 5 }).map((_, i) => (
                    <GameCardSkeleton key={i} />
                ))}
            </div>
        </div>
      )
    }

    if (!result) return null;

    return (
      <div className="mt-8 animate-in fade-in-50 duration-500">
        <div className="text-center mb-6">
            <Sparkles className="mx-auto h-8 w-8 text-primary mb-2" />
            <p className="text-xl text-muted-foreground">{result.intro}</p>
        </div>
        
        {result.games.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {result.games.map(game => (
                    <div key={game.id} className="flex flex-col gap-2">
                        <GameCard game={game} />
                        {game.reason && <p className="text-sm text-center text-muted-foreground p-2 bg-muted/50 rounded-md">"{game.reason}"</p>}
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-10">
                <p className="text-lg font-semibold">Aucun jeu trouvé pour votre recherche.</p>
            </div>
        )}
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                <Bot className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter">Votre Assistant de Jeu IA</h1>
            <p className="text-lg text-muted-foreground mt-2">
            Décrivez le jeu de vos rêves, et laissez notre IA vous trouver des pépites !
            </p>
            <p className="text-sm text-muted-foreground mt-1">Propulsé par Gemini 2.5 Flash</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Que recherchez-vous ?</CardTitle>
                <CardDescription>
                  Soyez aussi précis que possible. Ex: "un RPG en monde ouvert avec une bonne histoire comme The Witcher", 
                  "un jeu de course fun pour jouer avec des amis", "les meilleurs jeux de stratégie de 2023"...
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                        placeholder="Ex: Un jeu de survie post-apocalyptique où les animaux ont muté et parlent..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        rows={3}
                        className="text-lg"
                    />
                    <Button type="submit" disabled={loading} size="lg" className="w-full">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Trouver mon prochain jeu
                    </Button>
                </form>
            </CardContent>
        </Card>

        <ResultDisplay />
      </div>
    </main>
  );
}

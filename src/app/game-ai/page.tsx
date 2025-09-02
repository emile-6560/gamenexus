
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateGameConceptAction } from '@/app/actions';
import { Loader2, Wand2, Gamepad2, Feather, FileText, Bot } from 'lucide-react';
import type { GenerateGameConceptOutput } from '@/ai/flows/generate-game-concept';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function GameAiPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateGameConceptOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Veuillez entrer une idée de jeu.' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const response = await generateGameConceptAction(prompt);
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
        <Card className="mt-8">
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-1/4" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-2/3" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-4/5" />
                </div>
            </CardContent>
        </Card>
      )
    }

    if (!result) return null;

    return (
      <Card className="mt-8 animate-in fade-in-50 duration-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl">
            <Feather className="w-8 h-8 text-primary" /> {result.title}
          </CardTitle>
          <CardDescription>
            <Badge variant="secondary" className="text-md">{result.genre}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><FileText className="w-5 h-5" /> Description</h3>
            <p className="text-muted-foreground">{result.description}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Gamepad2 className="w-5 h-5" /> Mécaniques de jeu</h3>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              {result.gameplayMechanics.map((mechanic, index) => (
                <li key={index}>{mechanic}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
            <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                <Bot className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter">Générateur d'Idées de Jeux</h1>
            <p className="text-lg text-muted-foreground mt-2">
            Vous avez une idée de génie ? Laissez notre IA la transformer en un concept de jeu complet !
            </p>
            <p className="text-sm text-muted-foreground mt-1">Propulsé par Gemini 2.5 Flash</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Votre Idée</CardTitle>
                <CardDescription>Décrivez votre idée de jeu dans la zone de texte ci-dessous. Soyez aussi bref ou détaillé que vous le souhaitez.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                        placeholder="Ex: Un jeu de survie post-apocalyptique où les animaux ont muté et parlent..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                        className="text-lg"
                    />
                    <Button type="submit" disabled={loading} size="lg" className="w-full">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Générer le concept
                    </Button>
                </form>
            </CardContent>
        </Card>

        <ResultDisplay />
      </div>
    </main>
  );
}

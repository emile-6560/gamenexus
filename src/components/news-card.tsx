import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { NewsArticle } from '@/lib/types';
import { Button } from './ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const publishedDate = new Date(article.publishedAt * 1000).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1">
      <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="aspect-video relative">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint="news article"
          />
        </div>
      </a>
      <CardHeader>
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            <CardTitle className="text-xl leading-tight">{article.title}</CardTitle>
        </a>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground line-clamp-4">{article.summary}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge variant="outline" className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>{publishedDate}</span>
        </Badge>
        <Button asChild variant="ghost" size="sm">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Lire la suite
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function NewsCardSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <Skeleton className="aspect-video w-full" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-2 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-32" />
      </CardFooter>
    </Card>
  );
}

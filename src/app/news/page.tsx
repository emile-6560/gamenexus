import { getNews } from '@/lib/igdb-api';
import { NewsCard, NewsCardSkeleton } from '@/components/news-card';
import type { NewsArticle } from '@/lib/types';
import { Suspense } from 'react';

async function NewsList() {
    const news = await getNews();

    if (!news || news.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold mb-2">Aucune actualité trouvée</h2>
                <p className="text-muted-foreground">Impossible de charger les actualités pour le moment.</p>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article) => (
                <NewsCard key={article.id} article={article} />
            ))}
        </div>
    );
}

function NewsListSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
                <NewsCardSkeleton key={i} />
            ))}
        </div>
    );
}


export default function NewsPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
       <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tighter">Dernières Actualités</h1>
          <p className="text-lg text-muted-foreground mt-2">Les dernières nouvelles du monde du jeu vidéo, via IGDB.</p>
        </div>
      <Suspense fallback={<NewsListSkeleton />}>
        <NewsList />
      </Suspense>
    </main>
  );
}

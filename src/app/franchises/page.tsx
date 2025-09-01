
import { getFranchises } from '@/lib/igdb-api';
import { FranchiseCard, FranchiseCardSkeleton } from '@/components/franchise-card';

export default async function FranchisesPage() {
  const franchises = await getFranchises();

  return (
    <main className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tighter">Franchises de jeux</h1>
        <p className="text-lg text-muted-foreground mt-2">Découvrez les plus grandes sagas du jeu vidéo.</p>
      </div>

      {franchises.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {franchises.map(franchise => (
            <FranchiseCard key={franchise.id} franchise={franchise} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 15 }).map((_, i) => (
            <FranchiseCardSkeleton key={i} />
          ))}
        </div>
      )}
    </main>
  );
}

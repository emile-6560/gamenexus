
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Franchise } from '@/lib/types';
import { Badge } from './ui/badge';

interface FranchiseCardProps {
  franchise: Franchise;
}

export function FranchiseCard({ franchise }: FranchiseCardProps) {
  return (
    <Link href="#" className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/20 group-hover:-translate-y-1 flex flex-col">
        <div className="aspect-[4/3] relative">
          <Image
            src={franchise.coverUrl}
            alt={franchise.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
            data-ai-hint="game franchise cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <CardContent className="p-4 bg-background/95 backdrop-blur-sm flex-1 flex flex-col justify-between">
            <div>
                <CardTitle className="text-lg leading-tight">{franchise.name}</CardTitle>
            </div>
            <div className="mt-2">
                <Badge variant="secondary">{franchise.games.length} Jeux</Badge>
            </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function FranchiseCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-[3/4] rounded-lg" />
    </div>
  );
}

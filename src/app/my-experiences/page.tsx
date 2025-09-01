
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MyExperiencesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  return (
    <main className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
      <div className="text-center py-20">
        <h1 className="text-4xl font-extrabold tracking-tighter mb-4">Mes Expériences</h1>
        <p className="text-lg text-muted-foreground">Cette page est en cours de construction.</p>
        <p className="text-muted-foreground mt-2">Vous pourrez bientôt voir ici les jeux que vous avez marqués comme "terminé" ou "commencé".</p>
      </div>
    </main>
  );
}

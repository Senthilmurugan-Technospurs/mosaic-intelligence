'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Legacy dashboard route → unified hub. */
export default function RecommendationsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/recommendations/all');
  }, [router]);
  return null;
}

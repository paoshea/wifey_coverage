'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">Something went wrong!</h1>
        <p className="text-muted-foreground">
          An error occurred while processing your request.
        </p>
        <div className="space-x-4">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

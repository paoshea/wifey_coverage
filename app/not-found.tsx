import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CoverageSearchProps {
  onSearch: (query: string) => void;
}

export function CoverageSearch({ onSearch }: CoverageSearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Card className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] p-2">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Input
          placeholder="Search location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-80"
        />
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
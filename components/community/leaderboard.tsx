'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const contributors = [
  {
    id: 1,
    name: 'Alice Chen',
    avatar: 'AC',
    contributions: 156,
    points: 2340,
    rank: 1,
  },
  {
    id: 2,
    name: 'Bob Smith',
    avatar: 'BS',
    contributions: 142,
    points: 2130,
    rank: 2,
  },
  // Add more contributors as needed
];

export function LeaderboardTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Contributions</TableHead>
          <TableHead>Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contributors.map((contributor) => (
          <TableRow key={contributor.id}>
            <TableCell className="font-medium">#{contributor.rank}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{contributor.avatar}</AvatarFallback>
                </Avatar>
                <span>{contributor.name}</span>
              </div>
            </TableCell>
            <TableCell>{contributor.contributions}</TableCell>
            <TableCell>{contributor.points}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
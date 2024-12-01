'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

const updates = [
  {
    id: 1,
    user: 'Alice Chen',
    avatar: 'AC',
    action: 'reported a coverage issue',
    location: 'Downtown Area',
    time: '5 minutes ago',
  },
  {
    id: 2,
    user: 'Bob Smith',
    avatar: 'BS',
    action: 'completed a speed test',
    location: 'Suburban District',
    time: '15 minutes ago',
  },
  // Add more updates as needed
];

export function CommunityFeed() {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {updates.map((update) => (
          <div
            key={update.id}
            className="flex items-start space-x-4 border-b pb-4"
          >
            <Avatar>
              <AvatarFallback>{update.avatar}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">{update.user}</p>
              <p className="text-sm text-muted-foreground">
                {update.action} in {update.location}
              </p>
              <p className="text-xs text-muted-foreground">{update.time}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
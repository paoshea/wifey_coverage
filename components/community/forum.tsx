'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ThumbsUp } from 'lucide-react';

const topics = [
  {
    id: 1,
    title: 'Best provider for rural areas?',
    author: 'Alice Chen',
    replies: 23,
    likes: 45,
    tags: ['Discussion', 'Rural'],
    time: '2 hours ago',
  },
  {
    id: 2,
    title: 'Tips for improving 5G reception',
    author: 'Bob Smith',
    replies: 15,
    likes: 32,
    tags: ['Guide', '5G'],
    time: '4 hours ago',
  },
  // Add more topics as needed
];

export function ForumList() {
  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <Card key={topic.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="font-semibold">{topic.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>by {topic.author}</span>
                <span>•</span>
                <span>{topic.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                {topic.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{topic.replies}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{topic.likes}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
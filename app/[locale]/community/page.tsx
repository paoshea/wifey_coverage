'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunityFeed } from '@/components/community/feed';
import { LeaderboardTable } from '@/components/community/leaderboard';
import { ForumList } from '@/components/community/forum';

export default function CommunityPage() {
  return (
    <div className="container mx-auto p-4 pt-16">
      <h1 className="text-2xl font-bold mb-6">Community Hub</h1>
      
      <Tabs defaultValue="feed" className="space-y-4">
        <TabsList>
          <TabsTrigger value="feed">Updates Feed</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="forum">Forum</TabsTrigger>
        </TabsList>

        <TabsContent value="feed">
          <Card className="p-6">
            <CommunityFeed />
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card className="p-6">
            <LeaderboardTable />
          </Card>
        </TabsContent>

        <TabsContent value="forum">
          <Card className="p-6">
            <ForumList />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
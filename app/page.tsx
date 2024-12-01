'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Signal, Map, Activity, Wifi } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: Signal,
      title: 'Network Coverage',
      description: 'Track and visualize network coverage in real-time',
      href: '/coverage'
    },
    {
      icon: Wifi,
      title: 'Offline Mode',
      description: 'Continue tracking even without internet connection',
      href: '/offline'
    },
    {
      icon: Activity,
      title: 'Analytics',
      description: 'Analyze network performance and trends',
      href: '/analytics'
    },
    {
      icon: Map,
      title: 'Coverage Maps',
      description: 'Interactive maps showing network strength',
      href: '/coverage'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Network Coverage Tracker</h1>
        <p className="text-xl text-muted-foreground">
          Monitor and analyze network coverage in real-time
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Card key={feature.href} className="p-6">
            <feature.icon className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
            <p className="text-muted-foreground mb-4">{feature.description}</p>
            <Button
              className="w-full"
              onClick={() => router.push(feature.href)}
            >
              Get Started
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
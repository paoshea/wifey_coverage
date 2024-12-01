'use client';

import { Signal, Wifi, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'mobile';
}

export function Logo({ className, size = 'md', variant = 'default' }: LogoProps) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <Signal className={cn(sizes[size], 'text-primary absolute')} />
        <Wifi 
          className={cn(
            sizes[size], 
            'text-primary/50 rotate-45 absolute'
          )} 
        />
        <Activity className={cn(sizes[size], 'text-primary/80')} />
      </div>
      {variant === 'default' && (
        <span className={cn(
          'font-bold tracking-tight',
          textSizes[size]
        )}>
          Coverage Tracker
        </span>
      )}
    </div>
  );
}
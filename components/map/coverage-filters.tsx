'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Filter, Signal, Wifi } from 'lucide-react';

interface CoverageFiltersProps {
  onFilterChange: (filters: CoverageFilters) => void;
}

export interface CoverageFilters {
  minStrength: number;
  networkType: string;
  provider: string;
  timeRange: number; // hours
}

export function CoverageFilters({ onFilterChange }: CoverageFiltersProps) {
  const [filters, setFilters] = useState<CoverageFilters>({
    minStrength: 0,
    networkType: 'all',
    provider: 'all',
    timeRange: 24,
  });

  const handleFilterChange = (key: keyof CoverageFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Card className="absolute top-4 left-4 z-[1000] p-4 w-72">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <h3 className="font-semibold">Coverage Filters</h3>
        </div>

        <div className="space-y-2">
          <Label>Minimum Signal Strength</Label>
          <div className="flex items-center space-x-2">
            <Slider
              value={[filters.minStrength]}
              onValueChange={([value]) => handleFilterChange('minStrength', value)}
              max={100}
              step={10}
            />
            <span className="w-12 text-sm">{filters.minStrength}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Network Type</Label>
          <Select
            value={filters.networkType}
            onValueChange={(value) => handleFilterChange('networkType', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="cellular">
                <div className="flex items-center">
                  <Signal className="mr-2 h-4 w-4" />
                  Cellular
                </div>
              </SelectItem>
              <SelectItem value="wifi">
                <div className="flex items-center">
                  <Wifi className="mr-2 h-4 w-4" />
                  WiFi
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Provider</Label>
          <Select
            value={filters.provider}
            onValueChange={(value) => handleFilterChange('provider', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              <SelectItem value="provider-a">Provider A</SelectItem>
              <SelectItem value="provider-b">Provider B</SelectItem>
              <SelectItem value="provider-c">Provider C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Time Range</Label>
          <Select
            value={filters.timeRange.toString()}
            onValueChange={(value) => handleFilterChange('timeRange', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24">Last 24 Hours</SelectItem>
              <SelectItem value="72">Last 3 Days</SelectItem>
              <SelectItem value="168">Last Week</SelectItem>
              <SelectItem value="720">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
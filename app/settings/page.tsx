'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AppSettings {
  autoStart: boolean;
  trackingInterval: number;
  mapZoomLevel: number;
  mapStyle: 'streets' | 'satellite' | 'dark';
  heatmapRadius: number;
  heatmapBlur: number;
  dataRetention: number;
  exportFormat: 'json' | 'csv' | 'geojson';
  notificationsEnabled: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  autoStart: false,
  trackingInterval: 30,
  mapZoomLevel: 13,
  mapStyle: 'streets',
  heatmapRadius: 25,
  heatmapBlur: 15,
  dataRetention: 30,
  exportFormat: 'json',
  notificationsEnabled: true,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    setIsLoading(false);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully');
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem('appSettings', JSON.stringify(DEFAULT_SETTINGS));
      toast.success('Settings reset to defaults');
    }
  };

  const exportData = () => {
    const coveragePoints = localStorage.getItem('coveragePoints');
    if (!coveragePoints) {
      toast.error('No data to export');
      return;
    }

    const data = JSON.parse(coveragePoints);
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coverage-data-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-[400px] bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Application Settings</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={resetSettings}>
            Reset to Defaults
          </Button>
          <Button onClick={saveSettings}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Start Tracking</Label>
                <p className="text-sm text-muted-foreground">
                  Start tracking automatically when the app opens
                </p>
              </div>
              <Switch
                checked={settings.autoStart}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, autoStart: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Tracking Interval (seconds)</Label>
              <div className="pt-2">
                <Slider
                  value={[settings.trackingInterval]}
                  onValueChange={(value) => 
                    setSettings({ ...settings, trackingInterval: value[0] })
                  }
                  min={5}
                  max={300}
                  step={5}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5s</span>
                  <span>{settings.trackingInterval}s</span>
                  <span>300s</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                value={theme}
                onValueChange={(value) => setTheme(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Map Settings</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Default Map Style</Label>
              <Select
                value={settings.mapStyle}
                onValueChange={(value: 'streets' | 'satellite' | 'dark') => 
                  setSettings({ ...settings, mapStyle: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select map style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="streets">Streets</SelectItem>
                  <SelectItem value="satellite">Satellite</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Default Zoom Level</Label>
              <div className="pt-2">
                <Slider
                  value={[settings.mapZoomLevel]}
                  onValueChange={(value) => 
                    setSettings({ ...settings, mapZoomLevel: value[0] })
                  }
                  min={1}
                  max={20}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>World</span>
                  <span>Level {settings.mapZoomLevel}</span>
                  <span>Street</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Heatmap Radius</Label>
              <div className="pt-2">
                <Slider
                  value={[settings.heatmapRadius]}
                  onValueChange={(value) => 
                    setSettings({ ...settings, heatmapRadius: value[0] })
                  }
                  min={10}
                  max={50}
                  step={1}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Heatmap Blur</Label>
              <div className="pt-2">
                <Slider
                  value={[settings.heatmapBlur]}
                  onValueChange={(value) => 
                    setSettings({ ...settings, heatmapBlur: value[0] })
                  }
                  min={0}
                  max={30}
                  step={1}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Data Management</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Data Retention (days)</Label>
              <Select
                value={settings.dataRetention.toString()}
                onValueChange={(value) => 
                  setSettings({ ...settings, dataRetention: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select retention period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select
                value={settings.exportFormat}
                onValueChange={(value: 'json' | 'csv' | 'geojson') => 
                  setSettings({ ...settings, exportFormat: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select export format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="geojson">GeoJSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={exportData}
            >
              Export Coverage Data
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts about network changes and tracking status
                </p>
              </div>
              <Switch
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, notificationsEnabled: checked })
                }
              />
            </div>

            <div className="space-y-4 text-sm text-muted-foreground">
              <p>You will be notified about:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Significant network changes</li>
                <li>Connection loss</li>
                <li>Tracking status updates</li>
                <li>Data storage warnings</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

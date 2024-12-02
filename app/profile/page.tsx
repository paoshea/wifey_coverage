'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserSettings {
  username: string;
  email: string;
  trackingInterval: number;
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
  dataRetention: '1week' | '1month' | '3months' | '6months' | '1year';
}

const DEFAULT_SETTINGS: UserSettings = {
  username: '',
  email: '',
  trackingInterval: 30,
  notifications: true,
  theme: 'system',
  dataRetention: '1month'
};

export default function ProfilePage() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    setIsLoading(false);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully');
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
      <h1 className="text-3xl font-bold">Profile Settings</h1>

      <Card className="p-6">
        <form onSubmit={(e) => {
          e.preventDefault();
          saveSettings();
        }} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={settings.username}
                onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                placeholder="Enter your username"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Tracking Settings</h2>
            
            <div className="grid gap-2">
              <Label htmlFor="trackingInterval">Tracking Interval (seconds)</Label>
              <Input
                id="trackingInterval"
                type="number"
                min="5"
                max="300"
                value={settings.trackingInterval}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  trackingInterval: parseInt(e.target.value) 
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts about network changes
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, notifications: checked })
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Preferences</h2>

            <div className="grid gap-2">
              <Label>Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value: 'light' | 'dark' | 'system') => 
                  setSettings({ ...settings, theme: value })
                }
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

            <div className="grid gap-2">
              <Label>Data Retention</Label>
              <Select
                value={settings.dataRetention}
                onValueChange={(value: '1week' | '1month' | '3months' | '6months' | '1year') => 
                  setSettings({ ...settings, dataRetention: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select data retention period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1week">1 Week</SelectItem>
                  <SelectItem value="1month">1 Month</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Settings</Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Data Management</h2>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Manage your collected network coverage data
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                if (confirm('Are you sure you want to clear all coverage data? This action cannot be undone.')) {
                  localStorage.removeItem('coveragePoints');
                  toast.success('Coverage data cleared successfully');
                }
              }}
            >
              Clear Coverage Data
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.clear();
                toast.success('All data cleared successfully');
              }}
            >
              Reset All Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

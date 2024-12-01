'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  Signal, 
  Wifi, 
  BarChart2, 
  Gauge, 
  FileText, 
  Navigation2, 
  User, 
  Users, 
  Settings, 
  Scale,
  Menu,
  X 
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/brand/logo';
import { ThemeToggle } from '@/components/brand/theme-toggle';

const navigation = [
  { name: 'Coverage', href: '/coverage', icon: Signal },
  { name: 'Offline Mode', href: '/offline', icon: Wifi },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Speed Test', href: '/speedtest', icon: Gauge },
  { name: 'Report', href: '/report', icon: FileText },
  { name: 'Navigate', href: '/navigate', icon: Navigation2 },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Compare', href: '/compare', icon: Scale }
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const NavLink = ({ item }: { item: typeof navigation[0] }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
        )}
        onClick={() => setIsOpen(false)}
      >
        <Icon className="mr-2 h-4 w-4" />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <Logo size="sm" />
                </div>
                <div className="flex-1 overflow-auto">
                  <div className="flex flex-col space-y-1 p-2">
                    {navigation.map((item) => (
                      <NavLink key={item.href} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="hidden md:block">
            <Logo />
          </Link>
        </div>

        <div className="hidden md:flex md:flex-1 md:gap-2 md:px-4">
          {navigation.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
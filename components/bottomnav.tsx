'use client';

import { useEffect, useState } from 'react';
import {
  CalendarDays,
  Gift,
  Heart,
  Image,
  MessageCircle,
  Users2,
} from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { useInvitation } from '@/components/invitation-context';
import { getWeddingData } from '@/lib/data';

export default function BottomNav() {
  const { isOpen } = useInvitation();
  const data = getWeddingData();
  
  const navItems = [
    { label: data.navigation.items[0].label, href: data.navigation.items[0].href, icon: Users2 },
    { label: data.navigation.items[1].label, href: data.navigation.items[1].href, icon: CalendarDays },
    { label: data.navigation.items[2].label, href: data.navigation.items[2].href, icon: Gift },
    { label: data.navigation.items[3].label, href: data.navigation.items[3].href, icon: MessageCircle },
  ];
  
  const [active, setActive] = useState(navItems[0]?.href ?? '');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || navItems[0]?.href || '';
      setActive(hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setActive(href);
    
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      // Update URL hash without triggering scroll
      window.history.pushState(null, '', href);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <NavigationMenu className="pointer-events-none w-full max-w-xl">
        <NavigationMenuList className="pointer-events-auto w-full items-stretch justify-between rounded-2xl border border-[#f0ded1] bg-[#f9f2ea]/95 px-2 py-2 shadow-lg shadow-[#6b1b1b]/10 backdrop-blur-sm">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = active === href;

            return (
              <NavigationMenuItem
                key={href}
                className="flex-1"
              >
                <NavigationMenuLink asChild>
                  <a
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className={cn(
                      'flex h-full flex-col items-center gap-1 rounded-xl px-2 py-2 text-center text-[#9f8472] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b0000] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
                      isActive && 'text-[#8b0000]'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#b18f7d] transition-all duration-200',
                        isActive &&
                          'bg-[#8b0000] text-white shadow-[0_8px_12px_-6px_rgba(139,0,0,0.6)]'
                      )}
                    >
                      <Icon size={20} strokeWidth={1.6} />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em]">
                      {label}
                    </span>
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}


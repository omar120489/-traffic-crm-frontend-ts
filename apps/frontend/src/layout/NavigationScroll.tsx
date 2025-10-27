import { useEffect, type ReactElement } from 'react';

interface NavigationScrollProps {
  children: ReactElement | null;
}

export default function NavigationScroll({ children }: NavigationScrollProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return children ?? null;
}

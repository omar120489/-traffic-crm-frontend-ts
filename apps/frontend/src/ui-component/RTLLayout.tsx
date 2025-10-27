import { useEffect, type ReactNode } from 'react';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';

import { ThemeDirection } from 'config';
import useConfig from 'hooks/useConfig';

interface RTLLayoutProps {
  children: ReactNode;
}

const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
});

const ltrCache = createCache({
  key: 'mui',
});

export default function RTLLayout({ children }: RTLLayoutProps) {
  const {
    state: { themeDirection },
  } = useConfig();

  useEffect(() => {
    document.dir = themeDirection;
  }, [themeDirection]);

  return (
    <CacheProvider value={themeDirection === ThemeDirection.RTL ? rtlCache : ltrCache}>
      {children}
    </CacheProvider>
  );
}

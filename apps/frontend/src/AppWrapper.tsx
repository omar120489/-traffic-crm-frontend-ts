import type { ReactNode } from 'react';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { Provider } from 'react-redux';

import 'mapbox-gl/dist/mapbox-gl.css';

import NavigationScroll from 'layout/NavigationScroll';
import { ConfigProvider } from 'contexts/ConfigContext';
import Locales from 'ui-component/Locales';
import Notistack from 'ui-component/third-party/Notistack';
import Snackbar from 'ui-component/extended/Snackbar';
import ThemeCustomization from 'themes';
import { store } from 'store';
import { DEFAULT_THEME_MODE } from 'config';
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';

interface AppWrapperProps {
  children: ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  return (
    <>
      <InitColorSchemeScript
        modeStorageKey="theme-mode"
        attribute="data-color-scheme"
        defaultMode={DEFAULT_THEME_MODE}
      />
      <Provider store={store}>
        <ConfigProvider>
          <ThemeCustomization>
            <Locales>
              <NavigationScroll>
                <AuthProvider>
                  <Notistack>
                    <Snackbar />
                    {children}
                  </Notistack>
                </AuthProvider>
              </NavigationScroll>
            </Locales>
          </ThemeCustomization>
        </ConfigProvider>
      </Provider>
    </>
  );
}

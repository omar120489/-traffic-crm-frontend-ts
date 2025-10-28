import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { IntlProvider } from 'react-intl';

import useConfig from 'hooks/useConfig';

type LocaleKey = 'en' | 'fr' | 'ro' | 'zh' | (string & {});
type LocaleMessages = Record<string, string>;

async function loadLocaleData(locale: LocaleKey): Promise<LocaleMessages> {
  switch (locale) {
    case 'fr':
      return (await import('utils/locales/fr.json')).default as LocaleMessages;
    case 'ro':
      return (await import('utils/locales/ro.json')).default as LocaleMessages;
    case 'zh':
      return (await import('utils/locales/zh.json')).default as LocaleMessages;
    case 'en':
    default:
      return (await import('utils/locales/en.json')).default as LocaleMessages;
  }
}

interface LocalesProps {
  children: ReactNode;
}

export default function Locales({ children }: LocalesProps) {
  const {
    state: { i18n }
  } = useConfig();

  const [messages, setMessages] = useState<LocaleMessages | null>(null);

  const localeLoader = useMemo(() => loadLocaleData(i18n as LocaleKey), [i18n]);

  useEffect(() => {
    let mounted = true;
    localeLoader.then((loaded) => {
      if (mounted) {
        setMessages(loaded);
      }
    });

    return () => {
      mounted = false;
    };
  }, [localeLoader]);

  return (
    <IntlProvider locale={i18n} defaultLocale="en" messages={messages ?? {}}>
      {children}
    </IntlProvider>
  );
}

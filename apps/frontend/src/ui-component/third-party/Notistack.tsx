import type { ReactNode } from 'react';

import { SnackbarProvider } from 'notistack';

import {
  IconAlertCircle,
  IconCircleCheck,
  IconInfoCircle,
  IconSquareRoundedX,
} from '@tabler/icons-react';

import { useSelector } from 'store';

interface NotistackProps {
  children: ReactNode;
}

export default function Notistack({ children }: NotistackProps) {
  const snackbar = useSelector((state) => state.snackbar);
  const iconStyle = { marginRight: 8, fontSize: '1.15rem' };

  const iconVariant =
    snackbar.iconVariant === 'useemojis'
      ? {
          success: <IconCircleCheck style={iconStyle} />,
          error: <IconSquareRoundedX style={iconStyle} />,
          warning: <IconInfoCircle style={iconStyle} />,
          info: <IconAlertCircle style={iconStyle} />,
        }
      : undefined;

  return (
    <SnackbarProvider
      maxSnack={snackbar.maxStack}
      dense={snackbar.dense}
      iconVariant={iconVariant}
      hideIconVariant={snackbar.iconVariant === 'hide' || snackbar.hideIconVariant}
    >
      {children}
    </SnackbarProvider>
  );
}

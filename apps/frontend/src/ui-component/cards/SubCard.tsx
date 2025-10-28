import type { ReactNode } from 'react';

import Card, { type CardProps } from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

import { ThemeMode } from 'config';

interface SubCardProps {
  children: ReactNode | string | null;
  content?: boolean;
  className?: string;
  contentClass?: string;
  darkTitle?: boolean;
  secondary?: ReactNode | string;
  contentSX?: SxProps<Theme>;
  footerSX?: SxProps<Theme>;
  title?: ReactNode | string;
  actions?: ReactNode | string;
  sx?: CardProps['sx'];
  cardProps?: CardProps;
}

export default function SubCard({
  children,
  className,
  content = true,
  contentClass,
  darkTitle,
  secondary,
  sx,
  contentSX,
  footerSX,
  title,
  actions,
  cardProps
}: SubCardProps) {
  const { colorScheme } = useColorScheme();
  const defaultShadow =
    colorScheme === ThemeMode.DARK
      ? '0 2px 14px 0 rgb(33 150 243 / 10%)'
      : '0 2px 14px 0 rgb(32 40 45 / 8%)';

  const { sx: cardSx, ...restCardProps } = cardProps ?? {};

  return (
    <Card
      sx={(theme) => ({
        border: '1px solid',
        borderColor: 'divider',
        ':hover': { boxShadow: defaultShadow },
        ...(typeof sx === 'function' ? sx(theme) : sx),
        ...(typeof cardSx === 'function' ? cardSx(theme) : cardSx)
      })}
      className={className}
      {...restCardProps}
    >
      {!darkTitle && title && (
        <CardHeader
          sx={{ p: 2.5 }}
          title={<Typography variant="h5">{title}</Typography>}
          action={secondary}
        />
      )}
      {darkTitle && title && (
        <CardHeader
          sx={{ p: 2.5 }}
          title={<Typography variant="h4">{title}</Typography>}
          action={secondary}
        />
      )}

      {title && <Divider />}

      {content && (
        <CardContent sx={{ p: 2.5, ...contentSX }} className={contentClass ?? ''}>
          {children}
        </CardContent>
      )}
      {!content && children}

      {actions && <Divider />}

      {actions && <CardActions sx={{ p: 2.5, ...footerSX }}>{actions}</CardActions>}
    </Card>
  );
}

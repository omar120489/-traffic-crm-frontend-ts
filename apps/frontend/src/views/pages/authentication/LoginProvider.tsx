import { Link as RouterLink, useSearchParams } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import { APP_AUTH, AuthProvider } from 'config';

import jwtIcon from 'assets/images/icons/jwt.svg';
import firebaseIcon from 'assets/images/icons/firebase.svg';
import auth0Icon from 'assets/images/icons/auth0.svg';
import awsIcon from 'assets/images/icons/aws.svg';
import supabaseIcon from 'assets/images/icons/supabase.svg';

type ProviderKey = 'jwt' | 'firebase' | 'auth0' | 'aws' | 'supabase';

interface LoginProviderProps {
  currentLoginWith?: ProviderKey | AuthProvider | string;
}

interface ProviderButton {
  name: ProviderKey;
  icon: string;
  url: string;
}

const AUTH_PROVIDER_TO_KEY: Record<AuthProvider, ProviderKey> = {
  [AuthProvider.JWT]: 'jwt',
  [AuthProvider.FIREBASE]: 'firebase',
  [AuthProvider.AUTH0]: 'auth0',
  [AuthProvider.AWS]: 'aws',
  [AuthProvider.SUPABASE]: 'supabase',
};

const ICONS: Record<ProviderKey, string> = {
  jwt: jwtIcon,
  firebase: firebaseIcon,
  auth0: auth0Icon,
  aws: awsIcon,
  supabase: supabaseIcon,
};

export default function LoginProvider({ currentLoginWith }: LoginProviderProps) {
  const theme = useTheme();
  const downLG = useMediaQuery((muiTheme) => muiTheme.breakpoints.down('lg'));
  const [searchParams] = useSearchParams();
  const authParam = searchParams.get('auth') as ProviderKey | null;

  const normalizeKey = (value: string | undefined | null): ProviderKey | null => {
    if (!value) {
      return null;
    }

    const lower = value.toLowerCase() as ProviderKey;
    return ['jwt', 'firebase', 'auth0', 'aws', 'supabase'].includes(lower)
      ? lower
      : null;
  };

  const appAuthKey = normalizeKey(APP_AUTH) ?? AUTH_PROVIDER_TO_KEY[AuthProvider.JWT];
  const currentKey = normalizeKey(currentLoginWith) ?? appAuthKey;
  const paramKey = normalizeKey(authParam);

  const buildLoginUrl = (key: ProviderKey): string => {
    if (AUTH_PROVIDER_TO_KEY[AuthProvider.JWT] === key && appAuthKey === 'jwt') {
      return '/login';
    }
    return `/login?auth=${key}`;
  };

  const buttons: ProviderButton[] = (['jwt', 'firebase', 'auth0', 'aws', 'supabase'] as ProviderKey[]).map(
    (name) => ({
      name,
      icon: ICONS[name],
      url: appAuthKey === name ? '/login' : buildLoginUrl(name),
    })
  );

  const shouldRender = (button: ProviderButton) => {
    if (paramKey) {
      return button.name !== paramKey;
    }
    return button.name !== currentKey;
  };

  return (
    <Stack
      direction="row"
      sx={{
        gap: 1,
        justifyContent: 'center',
        '& .MuiButton-startIcon': {
          mr: { xs: 0, md: 1 },
          ml: { xs: 0, sm: -0.5, md: 1 },
        },
      }}
    >
      {buttons.filter(shouldRender).map((button) => (
        <Tooltip title={button.name} key={button.name}>
          <Button
            sx={{
              borderColor: theme.vars.palette.grey[300],
              color: theme.vars.palette.grey[900],
              '&:hover': {
                borderColor: theme.vars.palette.primary[400],
                backgroundColor: theme.vars.palette.primary[100],
              },
            }}
            variant="outlined"
            color="secondary"
            startIcon={<CardMedia component="img" src={button.icon} alt={button.name} />}
            component={RouterLink}
            to={button.url}
            target="_blank"
          >
            {!downLG && button.name}
          </Button>
        </Tooltip>
      ))}
    </Stack>
  );
}

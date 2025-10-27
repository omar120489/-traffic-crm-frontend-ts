import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState, type ComponentType } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import LoginProvider from './LoginProvider';
import ViewOnlyAlert from './ViewOnlyAlert';

import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';

import useAuth from 'hooks/useAuth';
import { APP_AUTH } from 'config';

type AuthKey = 'firebase' | 'jwt' | 'aws' | 'auth0' | 'supabase';

const authLoginImports: Record<AuthKey, () => Promise<{ default: ComponentType }>> = {
  firebase: () => import('./firebase/AuthLogin.jsx'),
  jwt: () => import('./jwt/AuthLogin.jsx'),
  aws: () => import('./aws/AuthLogin.jsx'),
  auth0: () => import('./auth0/AuthLogin.jsx'),
  supabase: () => import('./supabase/AuthLogin.jsx'),
};

export default function Login() {
  const { isLoggedIn } = useAuth();
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [AuthLoginComponent, setAuthLoginComponent] = useState<ComponentType | null>(null);

  const [searchParams] = useSearchParams();
  const authParam = (searchParams.get('auth') ?? '') as AuthKey | '';

  useEffect(() => {
    let mounted = true;
    const selectedAuth = (authParam || APP_AUTH) as AuthKey;
    const importer = authLoginImports[selectedAuth] ?? authLoginImports.jwt;

    importer()
      .then((module) => {
        if (mounted) {
          setAuthLoginComponent(() => module.default);
        }
      })
      .catch((error) => {
        console.error(`Failed to load ${selectedAuth} AuthLogin`, error);
        if (mounted) {
          setAuthLoginComponent(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, [authParam]);

  return (
    <AuthWrapper1>
      <Stack sx={{ justifyContent: 'flex-end', minHeight: '100vh' }}>
        <Stack
          sx={{ justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 68px)' }}
        >
          <Box sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
            {!isLoggedIn && <ViewOnlyAlert />}
            <AuthCardWrapper>
              <Stack sx={{ alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Box sx={{ mb: 3 }}>
                  <Link to="#" aria-label="logo">
                    <Logo />
                  </Link>
                </Box>
                <Stack sx={{ alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography variant={downMD ? 'h3' : 'h2'} sx={{ color: 'secondary.main' }}>
                    Hi, Welcome Back
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: '16px', textAlign: { xs: 'center', md: 'inherit' } }}
                  >
                    Enter your credentials to continue
                  </Typography>
                </Stack>
                <Box sx={{ width: 1 }}>
                  {AuthLoginComponent ? <AuthLoginComponent /> : null}
                </Box>
                <Divider sx={{ width: 1 }} />
                <Stack sx={{ alignItems: 'center' }}>
                  <Typography
                    component={Link}
                    to={
                      isLoggedIn
                        ? '/pages/register/register3'
                        : authParam
                          ? `/register?auth=${authParam}`
                          : '/register'
                    }
                    variant="subtitle1"
                    sx={{ textDecoration: 'none' }}
                  >
                    Don&apos;t have an account?
                  </Typography>
                </Stack>
              </Stack>
            </AuthCardWrapper>
            {!isLoggedIn && (
              <Box
                sx={{
                  maxWidth: { xs: 400, lg: 475 },
                  margin: { xs: 2.5, md: 3 },
                  '& > *': { flexGrow: 1, flexBasis: '50%' },
                }}
              >
                <LoginProvider currentLoginWith={APP_AUTH} />
              </Box>
            )}
          </Box>
        </Stack>
        <Box sx={{ px: 3, my: 3 }}>
          <AuthFooter />
        </Box>
      </Stack>
    </AuthWrapper1>
  );
}

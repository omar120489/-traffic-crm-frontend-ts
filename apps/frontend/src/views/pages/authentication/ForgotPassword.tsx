import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState, type ComponentType } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import ViewOnlyAlert from './ViewOnlyAlert';
import LoginProvider from './LoginProvider';

import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';

import useAuth from 'hooks/useAuth';
import { APP_AUTH } from 'config';

type AuthKey = 'firebase' | 'jwt' | 'aws' | 'auth0' | 'supabase';

const authForgotPasswordImports: Record<AuthKey, () => Promise<{ default: ComponentType }>> = {
  firebase: () => import('./firebase/AuthForgotPassword.jsx'),
  jwt: () => import('./jwt/AuthForgotPassword.jsx'),
  aws: () => import('./aws/AuthForgotPassword.jsx'),
  auth0: () => import('./auth0/AuthForgotPassword.jsx'),
  supabase: () => import('./supabase/AuthForgotPassword.jsx'),
};

export default function ForgotPassword() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { isLoggedIn } = useAuth();
  const [AuthForgotPasswordComponent, setAuthForgotPasswordComponent] = useState<ComponentType | null>(null);

  const [searchParams] = useSearchParams();
  const authParam = (searchParams.get('auth') ?? '') as AuthKey | '';

  useEffect(() => {
    let mounted = true;
    const selectedAuth = (authParam || APP_AUTH) as AuthKey;
    const importer = authForgotPasswordImports[selectedAuth] ?? authForgotPasswordImports.jwt;

    importer()
      .then((module) => {
        if (mounted) {
          setAuthForgotPasswordComponent(() => module.default);
        }
      })
      .catch((error) => {
        console.error(`Failed to load ${selectedAuth} AuthForgotPassword`, error);
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
              <Stack sx={{ gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ mb: 3 }}>
                  <Link to="#" aria-label="theme logo">
                    <Logo />
                  </Link>
                </Box>
                <Stack
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: 2,
                  }}
                >
                  <Typography
                    gutterBottom
                    variant={downMD ? 'h3' : 'h2'}
                    sx={{ color: 'secondary.main' }}
                  >
                    Forgot password?
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '16px', textAlign: 'center' }}>
                    Enter your email address below and we&apos;ll send you a password reset OTP.
                  </Typography>
                </Stack>
                <Box sx={{ width: '100%' }}>
                  {AuthForgotPasswordComponent ? <AuthForgotPasswordComponent /> : null}
                </Box>
                <Divider sx={{ width: 1 }} />
                <Typography
                  component={Link}
                  to={
                    isLoggedIn
                      ? '/pages/login/login3'
                      : authParam
                        ? `/login?auth=${authParam}`
                        : '/login'
                  }
                  variant="subtitle1"
                  sx={{ textDecoration: 'none' }}
                >
                  Already have an account?
                </Typography>
              </Stack>
            </AuthCardWrapper>
            {!isLoggedIn && (
              <Box
                sx={{
                  maxWidth: { xs: 400, lg: 475 },
                  margin: { xs: 2.5, md: 3 },
                  '& > *': {
                    flexGrow: 1,
                    flexBasis: '50%',
                  },
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

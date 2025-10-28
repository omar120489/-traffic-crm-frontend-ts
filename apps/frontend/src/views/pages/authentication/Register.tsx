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

// Helper function to dynamically import auth providers only when needed
const loadAuthProvider = async (authType: AuthKey) => {
  switch (authType) {
    case 'jwt':
      return import('./jwt/AuthRegister.jsx');
    case 'aws':
      return import('./aws/AuthRegister.jsx');
    case 'auth0':
      return import('./auth0/AuthRegister.jsx');
    case 'supabase':
      return import('./supabase/AuthRegister.jsx');
    case 'firebase':
      throw new Error('Firebase authentication is not configured');
    default:
      return import('./jwt/AuthRegister.jsx');
  }
};

export default function Register() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { isLoggedIn } = useAuth();
  const [AuthRegisterComponent, setAuthRegisterComponent] = useState<ComponentType | null>(null);

  const [searchParams] = useSearchParams();
  const authParam = (searchParams.get('auth') ?? '') as AuthKey | '';

  useEffect(() => {
    let mounted = true;
    const selectedAuth = (authParam || APP_AUTH) as AuthKey;

    loadAuthProvider(selectedAuth)
      .then((module) => {
        if (mounted) {
          setAuthRegisterComponent(() => module.default);
        }
      })
      .catch((error) => {
        console.error(`Failed to load ${selectedAuth} AuthRegister`, error);
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
                  <Link to="#" aria-label="theme logo">
                    <Logo />
                  </Link>
                </Box>
                <Stack sx={{ alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography
                    gutterBottom
                    variant={downMD ? 'h3' : 'h2'}
                    sx={{ color: 'secondary.main', mb: 0 }}
                  >
                    Sign up
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: '16px', textAlign: { xs: 'center', md: 'inherit' } }}
                  >
                    Enter your details to continue
                  </Typography>
                </Stack>
                <Box>{AuthRegisterComponent ? <AuthRegisterComponent /> : null}</Box>
                <Divider sx={{ width: 1 }} />
                <Stack sx={{ alignItems: 'center' }}>
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
              </Stack>
            </AuthCardWrapper>
            {!isLoggedIn && (
              <Box
                sx={{
                  maxWidth: { xs: 400, lg: 475 },
                  margin: { xs: 2.5, md: 3 },
                  '& > *': {
                    flexGrow: 1,
                    flexBasis: '50%'
                  }
                }}
              >
                <LoginProvider currentLoginWith={APP_AUTH} />
              </Box>
            )}
          </Box>
        </Stack>
        <Stack sx={{ px: 3, mb: 3, mt: 1 }}>
          <AuthFooter />
        </Stack>
      </Stack>
    </AuthWrapper1>
  );
}

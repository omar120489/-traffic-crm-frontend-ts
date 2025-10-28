import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

import { APP_AUTH } from 'config';

const DOC_LINKS: Record<string, string> = {
  auth0: 'https://codedthemes.gitbook.io/berry/authentication/auth0',
  firebase: 'https://codedthemes.gitbook.io/berry/authentication/firebase',
  aws: 'https://codedthemes.gitbook.io/berry/authentication/aws-cognito',
  supabase: 'https://codedthemes.gitbook.io/berry/authentication/supabase'
};

export default function ViewOnlyAlert() {
  const [searchParams] = useSearchParams();
  const authParam = searchParams.get('auth');

  const documentationLink = useMemo(() => {
    if (!authParam) {
      return 'https://codedthemes.gitbook.io/berry/authentication';
    }
    return DOC_LINKS[authParam] ?? 'https://codedthemes.gitbook.io/berry/authentication';
  }, [authParam]);

  const shouldRender = !authParam || authParam !== APP_AUTH;

  if (!shouldRender) {
    return null;
  }

  return (
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
      <Alert variant="outlined" severity="info" sx={{ alignItems: 'flex-start' }}>
        <Typography variant="h5">View Only</Typography>
        <Typography variant="h6">
          This page is view-only. To make it fully functional, please read the documentation
          provided{' '}
          <Link href={documentationLink} target="_blank" rel="noreferrer">
            here
          </Link>{' '}
          after purchasing the theme.
        </Typography>
      </Alert>
    </Box>
  );
}

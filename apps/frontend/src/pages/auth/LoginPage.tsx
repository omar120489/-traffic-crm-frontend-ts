/**
 * Login page
 * Sprint 3: FE-AUTH-01, FE-AUTH-04
 * 
 * Features:
 * - Email/password form
 * - Error handling
 * - Redirect to intended destination after login
 * - Loading state during submission
 */

import { useState, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Stack, Alert } from '@mui/material';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation() as { state: LocationState | null };
  
  // Redirect to the page they tried to visit, or /deals by default
  const from = location.state?.from?.pathname ?? '/deals';

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: 360, maxWidth: '95vw' }}>
        <Stack component="form" onSubmit={onSubmit} spacing={2}>
          <Typography variant="h5" fontWeight={700} textAlign="center">
            Sign in to Traffic CRM
          </Typography>
          
          <TextField
            label="Email"
            type="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            disabled={submitting}
          />
          
          <TextField
            label="Password"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            disabled={submitting}
          />
          
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting}
            fullWidth
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
          
          <Typography variant="caption" color="text.secondary" textAlign="center">
            Dev credentials: admin@acme.io / test
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

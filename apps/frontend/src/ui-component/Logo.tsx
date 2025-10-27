import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';

import logoLight from '../assets/images/logo.svg';
import logoDark from '../assets/images/logo-dark.svg';

type LogoVariant = 'auto' | 'light' | 'dark';

interface LogoProps {
  variant?: LogoVariant;
  height?: number;
}

/**
 * Minimal brand mark that adapts to the current theme. Falls back to the light
 * version when the color scheme context is unavailable.
 */
export default function Logo({ variant = 'auto', height = 32 }: LogoProps) {
  const { colorScheme } = useColorScheme();
  const isDark =
    variant === 'dark' || (variant === 'auto' && colorScheme ? colorScheme === 'dark' : false);
  const src = isDark ? logoDark : logoLight;

  return (
    <Box
      component="img"
      src={src}
      alt="Traffic CRM"
      sx={{ display: 'block', height, width: 'auto' }}
    />
  );
}

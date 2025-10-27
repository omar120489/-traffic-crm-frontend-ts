
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import type { SxProps, Theme } from '@mui/material/styles';

interface LoaderProps {
  /**
   * Optional MUI sx overrides so callers can tweak layout when needed.
   */
  sx?: SxProps<Theme>;
  /**
   * Circular progress size in pixels (defaults to 40 to match MUI docs).
   */
  size?: number;
}

export default function Loader({ sx, size = 40 }: LoaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '100%',
        py: 4,
        ...sx,
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
}


import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';

export interface AnimateButtonProps extends BoxProps {
  disableTapEffect?: boolean;
}

export default function AnimateButton({
  disableTapEffect = false,
  children,
  sx,
  ...boxProps
}: AnimateButtonProps) {
  return (
    <Box {...boxProps} sx={{ display: 'inline-flex', width: '100%', ...sx }}>
      <motion.div
        style={{ display: 'inline-flex', width: '100%' }}
        whileHover={{ scale: 1.02 }}
        whileTap={disableTapEffect ? undefined : { scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {children}
      </motion.div>
    </Box>
  );
}

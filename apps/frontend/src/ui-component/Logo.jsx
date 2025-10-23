import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import rioLogo from '@/assets/images/brand/rio-travels.png';

/**
 * RIO Travels Logo Component
 * Displays the company logo in the header
 */
export default function Logo({ height = 32, ...props }) {
  return (
    <Box
      component="img"
      src={rioLogo}
      alt="RIO Travels - Your Trusted Travel Partner"
      sx={{
        height,
        width: 'auto',
        display: 'inline-block',
        objectFit: 'contain'
      }}
      {...props}
    />
  );
}

Logo.propTypes = {
  height: PropTypes.number
};

import { type SyntheticEvent } from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import Zoom from '@mui/material/Zoom';
import type { SlideProps, SnackbarProps } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import { closeSnackbar } from 'store/slices/snackbar';
import { useDispatch, useSelector } from 'store';

type TransitionComponent = SnackbarProps['TransitionComponent'];

const slideUp = (props: SlideProps) => <Slide {...props} direction="up" />;
const transitions: Record<string, TransitionComponent> = {
  Fade,
  Grow,
  Slide: slideUp,
  Zoom
};

export default function AppSnackbar() {
  const dispatch = useDispatch();
  const snackbar = useSelector((state) => state.snackbar);

  const handleClose = (_event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackbar());
  };

  const TransitionComponent = transitions[snackbar.transition] ?? Fade;

  const action = (
    <>
      {snackbar.actionButton && (
        <Button size="small" onClick={handleClose}>
          UNDO
        </Button>
      )}
      {snackbar.close && (
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
          sx={{ mt: 0.25, mb: 0.5 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </>
  );

  if (snackbar.variant === 'default') {
    return (
      <Snackbar
        open={snackbar.open}
        autoHideDuration={1500}
        message={snackbar.message}
        anchorOrigin={snackbar.anchorOrigin}
        onClose={handleClose}
        TransitionComponent={TransitionComponent}
        action={action}
      />
    );
  }

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={1500}
      anchorOrigin={snackbar.anchorOrigin}
      onClose={handleClose}
      TransitionComponent={TransitionComponent}
    >
      <Alert
        severity={snackbar.severity}
        variant={snackbar.variant === 'outlined' ? 'outlined' : 'filled'}
        action={action}
        onClose={snackbar.close ? handleClose : undefined}
        icon={snackbar.hideIconVariant ? false : undefined}
        sx={{
          '.MuiAlert-action': { mb: 0.5 },
          ...(snackbar.variant === 'outlined' && { bgcolor: 'background.paper' })
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}

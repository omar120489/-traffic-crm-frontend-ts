import Alert from '@mui/material/Alert';

export default function AuthLogin() {
  return (
    <Alert severity="warning">
      Firebase authentication is not configured for this project. Update `APP_AUTH` in `config.ts`
      or provide a Firebase implementation to enable this login form.
    </Alert>
  );
}

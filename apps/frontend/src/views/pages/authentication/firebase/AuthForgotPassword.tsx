import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';

// third party
import * as Yup from 'yup';
import { Formik, FormikErrors, FormikTouched } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomFormControl from 'ui-component/extended/Form/CustomFormControl';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';

import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

// ========================|| FIREBASE - FORGOT PASSWORD ||======================== //

interface FormValues {
  email: string;
  submit: string | null;
}

interface Props {
  [key: string]: unknown;
}

export default function AuthForgotPassword({ ...others }: Props) {
  const scriptedRef = useScriptRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, resetPassword } = useAuth();

  return (
    <Formik<FormValues>
      initialValues={{
        email: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
      })}
      onSubmit={async (
        values: FormValues,
        {
          setErrors,
          setStatus,
          setSubmitting
        }: {
          setErrors: (errors: FormikErrors<FormValues>) => void;
          setStatus: (status: { success: boolean }) => void;
          setSubmitting: (isSubmitting: boolean) => void;
        }
      ) => {
        try {
          await resetPassword?.(values.email).then(
            () => {
              setStatus({ success: true });
              setSubmitting(false);
              dispatch(
                openSnackbar({
                  open: true,
                  message: 'Check mail for reset password link',
                  variant: 'alert',
                  alert: {
                    color: 'success'
                  },
                  close: false
                })
              );
              setTimeout(() => {
                navigate(isLoggedIn ? '/auth/check-mail' : '/check-mail', { replace: true });
              }, 1500);
            },
            (err: Error) => {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          );
        } catch (err) {
          console.error(err);
          if (scriptedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: (err as Error).message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }: {
        errors: FormikErrors<FormValues> & { submit?: string };
        handleBlur: (e: React.FocusEvent) => void;
        handleChange: (e: React.ChangeEvent) => void;
        handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
        isSubmitting: boolean;
        touched: FormikTouched<FormValues>;
        values: FormValues;
      }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <CustomFormControl fullWidth error={Boolean(touched.email && errors.email)}>
            <InputLabel htmlFor="outlined-adornment-email-forgot">
              Email Address / Username
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-email-forgot"
              type="email"
              value={values.email}
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              label="Email Address / Username"
            />
            {touched.email && errors.email && (
              <FormHelperText error id="standard-weight-helper-text-email-forgot">
                {errors.email}
              </FormHelperText>
            )}
          </CustomFormControl>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button
                disableElevation
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="secondary"
              >
                Send Mail
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
}

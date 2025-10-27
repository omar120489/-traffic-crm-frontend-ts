
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import type { FormControlProps } from '@mui/material/FormControl';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
}));

export type CustomFormControlProps = FormControlProps;

export default function CustomFormControl(props: CustomFormControlProps) {
  return <StyledFormControl {...props} />;
}

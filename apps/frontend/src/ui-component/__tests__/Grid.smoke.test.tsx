import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Grid from '@mui/material/Grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const theme = createTheme();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('Grid v2 smoke tests', () => {
  it('renders responsive card grid with size prop', () => {
    render(
      <TestWrapper>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography>Card 1</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography>Card 2</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography>Card 3</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TestWrapper>
    );

    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
    expect(screen.getByText('Card 3')).toBeInTheDocument();
  });

  it('renders form layout with numeric size shorthand', () => {
    render(
      <TestWrapper>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h5">Form Title</Typography>
          </Grid>
          <Grid size={6}>
            <Typography>Left Field</Typography>
          </Grid>
          <Grid size={6}>
            <Typography>Right Field</Typography>
          </Grid>
        </Grid>
      </TestWrapper>
    );

    expect(screen.getByText('Form Title')).toBeInTheDocument();
    expect(screen.getByText('Left Field')).toBeInTheDocument();
    expect(screen.getByText('Right Field')).toBeInTheDocument();
  });

  it('renders auto-sized grid items with size="auto"', () => {
    render(
      <TestWrapper>
        <Grid container spacing={1}>
          <Grid size="auto">
            <Typography>Auto 1</Typography>
          </Grid>
          <Grid size="auto">
            <Typography>Auto 2</Typography>
          </Grid>
          <Grid size="grow">
            <Typography>Grow Item</Typography>
          </Grid>
        </Grid>
      </TestWrapper>
    );

    expect(screen.getByText('Auto 1')).toBeInTheDocument();
    expect(screen.getByText('Auto 2')).toBeInTheDocument();
    expect(screen.getByText('Grow Item')).toBeInTheDocument();
  });

  it('renders nested grid containers', () => {
    render(
      <TestWrapper>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Grid container spacing={1}>
              <Grid size={4}>
                <Typography>Nested A</Typography>
              </Grid>
              <Grid size={4}>
                <Typography>Nested B</Typography>
              </Grid>
              <Grid size={4}>
                <Typography>Nested C</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </TestWrapper>
    );

    expect(screen.getByText('Nested A')).toBeInTheDocument();
    expect(screen.getByText('Nested B')).toBeInTheDocument();
    expect(screen.getByText('Nested C')).toBeInTheDocument();
  });

  it('applies spacing and alignment props correctly', () => {
    const { container } = render(
      <TestWrapper>
        <Grid
          container
          spacing={3}
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          data-testid="grid-container"
        >
          <Grid size={6}>
            <Typography>Left</Typography>
          </Grid>
          <Grid size={6}>
            <Typography>Right</Typography>
          </Grid>
        </Grid>
      </TestWrapper>
    );

    const gridContainer = container.querySelector('[data-testid="grid-container"]');
    expect(gridContainer).toBeInTheDocument();
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });

  it('renders columns prop for explicit grid column count', () => {
    render(
      <TestWrapper>
        <Grid container columns={12} spacing={2}>
          <Grid size={3}>
            <Typography>Quarter</Typography>
          </Grid>
          <Grid size={9}>
            <Typography>Three Quarters</Typography>
          </Grid>
        </Grid>
      </TestWrapper>
    );

    expect(screen.getByText('Quarter')).toBeInTheDocument();
    expect(screen.getByText('Three Quarters')).toBeInTheDocument();
  });
});

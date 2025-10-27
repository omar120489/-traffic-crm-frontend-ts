
import { Fragment } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

function buildPaths(pathSegments: string[]): string[] {
  const paths: string[] = [];
  pathSegments.reduce((prev, segment) => {
    const next = `${prev}/${segment}`;
    paths.push(next);
    return next;
  }, '');
  return paths;
}

export default function AppBreadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const paths = buildPaths(pathSegments);

  if (paths.length === 0) {
    return null;
  }

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      <Link component={RouterLink} underline="hover" color="inherit" to="/">
        Home
      </Link>
      {paths.map((path, index) => {
        const label = pathSegments[index];
        const isLast = index === paths.length - 1;
        return (
          <Fragment key={path}>
            {isLast ? (
              <Typography color="text.primary" textTransform="capitalize">
                {label}
              </Typography>
            ) : (
              <Link
                component={RouterLink}
                underline="hover"
                color="inherit"
                to={path}
                textTransform="capitalize"
              >
                {label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </Breadcrumbs>
  );
}

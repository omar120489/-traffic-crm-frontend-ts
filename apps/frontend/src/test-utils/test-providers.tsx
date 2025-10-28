import React from 'react';
import { render } from '@testing-library/react';

const TestProvider = ({ children }) => {
  return <>{children}</>;
};

const renderWithProviders = (ui, options) => {
  return render(ui, { wrapper: TestProvider, ...options });
};

export * from '@testing-library/react';
export { renderWithProviders as render };

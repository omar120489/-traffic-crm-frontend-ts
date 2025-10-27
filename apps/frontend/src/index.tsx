import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container element with id "root" was not found.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);

import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';

import AppWrapper from './AppWrapper';
import Loader from 'ui-component/Loader';
import router from './routes';

export default function App() {
  return (
    <AppWrapper>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </AppWrapper>
  );
}

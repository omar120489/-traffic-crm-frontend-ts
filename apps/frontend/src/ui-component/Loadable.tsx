
import { Suspense, type ComponentType, type LazyExoticComponent } from 'react';

import Loader from './Loader';

/**
 * Small helper to wrap lazily loaded routes with a consistent loader UI.
 */
export default function Loadable<P extends Record<string, unknown>>(
  Component: LazyExoticComponent<ComponentType<P>>
): ComponentType<P> {
  const LoadableComponent: ComponentType<P> = (props) => (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );

  return LoadableComponent;
}

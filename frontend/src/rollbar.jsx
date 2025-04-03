import React from 'react';
import { Provider, ErrorBoundary } from '@rollbar/react';
import Rollbar from 'rollbar';

const rollbarConfig = {
  accessToken: 'ee86184aecad46618f55d7f30fd11831',
  environment: 'production',
};

const rollbar = new Rollbar(rollbarConfig);

function TestError() {
  const a = null;
  return a.hello();
}

export default function RollBarrApp() {
  return (
    <Provider instance={rollbar}>
      <ErrorBoundary>
        <TestError />
      </ErrorBoundary>
    </Provider>
  );
}
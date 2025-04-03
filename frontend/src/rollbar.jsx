import React from 'react';
import { Provider, ErrorBoundary } from '@rollbar/react'; // Provider imports 'rollbar'

const rollbarConfig = {
  accessToken: 'b25db05a1112481a9bdeae84a6b8f938',
  environment: 'testenv',
};

function TestError() {
  const a = null;
  return a.hello();
}

export default function App() {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <TestError />
      </ErrorBoundary>
    </Provider>
  );
}
import React from 'react';
import { Provider, ErrorBoundary } from '@rollbar/react'; // Provider imports 'rollbar'

const rollbarConfig = {
  accessToken: '4d2ab63177044cc0ad2572c2314d9f09',
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
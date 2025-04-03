import React from 'react';
import { Provider, ErrorBoundary } from '@rollbar/react';

const rollbarConfig = {
  accessToken: 'b07976a7afab4a6699308626b0985add',
  environment: 'testenv',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

function ThrowInRender() {
  throw new Error('🔥 Ошибка: throw прямо в render() для теста Rollbar');
}

export default function RollbarDemo() {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <ThrowInRender />
      </ErrorBoundary>
    </Provider>
  );
}

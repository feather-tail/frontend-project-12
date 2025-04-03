import React from 'react';
import { Provider, ErrorBoundary } from '@rollbar/react';

const rollbarConfig = {
  accessToken: '4d2ab63177044cc0ad2572c2314d9f09',
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

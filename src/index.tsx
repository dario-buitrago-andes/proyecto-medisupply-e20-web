import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/forms.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Initialize MSW in development or when running E2E tests
// E2E tests need MSW to mock API calls
const shouldUseMSW = 
  (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MSW === 'true') ||
  process.env.REACT_APP_E2E_TEST === 'true';

if (shouldUseMSW) {
  import('./mocks/browser').then(({ worker }) => {
    worker.start({
      onUnhandledRequest: 'warn', // Warn instead of bypass for E2E tests
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    }).then(() => {
      console.log('✅ MSW started successfully for E2E tests');
    }).catch((error) => {
      console.warn('⚠️ MSW failed to start:', error);
    });
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/forms.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Initialize MSW in development (optional, for API mocking during dev)
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MSW === 'true') {
  import('./mocks/browser').then(({ worker }) => {
    worker.start({
      onUnhandledRequest: 'bypass',
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

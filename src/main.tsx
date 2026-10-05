import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Add this import to register the PWA service worker
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/push-sw.js')
    .then((reg) => console.log('Push SW registered!', reg))
    .catch((err) => console.error('Push SW failed', err));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
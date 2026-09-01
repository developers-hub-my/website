import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import './index.css';

// Every route is prerendered to a real HTML file by scripts/prerender.mjs, so
// the markup is already in the document — hydrate it rather than replacing it.
// Using createRoot here would throw the server-rendered content away on first
// paint and undo the whole point of the prerender step.
hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

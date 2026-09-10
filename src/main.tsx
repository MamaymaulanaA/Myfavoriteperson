import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Base tokens and resets load first so component styles can override them.
import './styles/globals.css';
import App from './app/App';
import { AssetAudit } from './dev/AssetAudit';
import { hangatkanHuruf } from './lib/fonts';

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root');

// Development-only contact sheet for the imported animations: /?audit=1
const auditing =
  import.meta.env.DEV && new URLSearchParams(window.location.search).has('audit');

createRoot(container).render(
  <StrictMode>{auditing ? <AssetAudit /> : <App />}</StrictMode>,
);

// Sisa hurufnya diambil diam-diam setelah layar pertama selesai, supaya
// babak-babak berikutnya nggak sempat digambar pakai huruf cadangan.
hangatkanHuruf();

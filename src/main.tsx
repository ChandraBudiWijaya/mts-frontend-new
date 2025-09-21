import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// 1. Impor QueryClient dan QueryClientProvider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'leaflet/dist/leaflet.css';
import './styles/index.css';
import App from './app/App';

// 2. Buat instance dari QueryClient
// Ini adalah tempat cache akan disimpan
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);

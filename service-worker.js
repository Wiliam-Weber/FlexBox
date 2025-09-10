
const CACHE_NAME = 'agricultura-familiar-v1';

const assetsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/imagens/logo-agricultura.png',
    '/imagens/fazenda.jpg',
    '/imagens/cesta.jpg',
    '/imagens/sementes.jpg',
    '/imagens/familia.jpg',
    '/imagens/icon-192.png',
    '/imagens/icon-512.png',
    'https://www.svgrepo.com/show/508781/download-circle.svg' 
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Colocando arquivos essenciais no cache');
        return cache.addAll(assetsToCache);
      })
      .catch((err) => {
        console.error('[Service Worker] Falha ao abrir o cache', err);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log(`[Service Worker] Servindo do cache: ${event.request.url}`);
          return response;
        }
        
        console.log(`[Service Worker] Buscando da rede: ${event.request.url}`);
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`[Service Worker] Limpando cache antigo: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
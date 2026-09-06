self.addEventListener('install', (event) => {
  console.log('Service Worker installé');
});

self.addEventListener('fetch', (event) => {
  // Laisse le navigateur gérer les requêtes normalement
});

import { defineConfig } from '@playwright/test';

// Ruta de la aplicación bajo prueba (El Rincón del Café v3, carpeta app/).
const RUTA_APP = '../app';
const URL_APP = process.env.URL_APP || 'http://localhost:3000';

export default defineConfig({
  testDir: './tests',
  // Los saldos de puntos son globales en el servidor: las pruebas reinician los datos
  // antes de cada caso, así que deben correr una a la vez para no pisarse.
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: URL_APP,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
  // Levanta la app automáticamente si no está corriendo.
  webServer: {
    command: 'npm start',
    cwd: RUTA_APP,
    url: URL_APP,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});

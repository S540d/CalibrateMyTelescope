import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/CalibrateMyTelescope/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'CalibrateMyTelescope',
        short_name: 'CalibrateMyTelescope',
        description: 'Schrittweise Teleskop-Kalibrierung mit Sternempfehlung',
        theme_color: '#0A0A0A',
        background_color: '#0A0A0A',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts/,
            handler: 'CacheFirst'
          }
        ]
      }
    })
  ],
  test: {
    environment: 'jsdom'
  }
});

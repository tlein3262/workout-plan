import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // './' = อ้างไฟล์แบบ relative ใช้ได้กับ GitHub Pages ทุกชื่อ repo โดยไม่ต้องแก้ตรงนี้
  base: './',
  plugins: [
    react(),
    // PWA: ติดตั้งเป็นแอปบนมือถือได้ + เปิดได้แม้ไม่มีเน็ต
    VitePWA({
      registerType: 'autoUpdate', // มีเวอร์ชันใหม่ อัปเดตให้เองตอนเปิดแอปครั้งถัดไป
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'icon.svg'],
      manifest: {
        name: 'ตารางออกกำลังกาย',
        short_name: 'Workout',
        description: 'วันนี้เล่นอะไร กินอะไร ดูได้ในที่เดียว',
        lang: 'th',
        start_url: './',
        scope: './',
        display: 'standalone',
        theme_color: '#f5f5f5',
        background_color: '#f5f5f5',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // ไฟล์จากเว็บอื่นที่ให้เก็บไว้ในเครื่อง: รูปท่าออกกำลังกาย + ฟอนต์
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.hostname === 'raw.githubusercontent.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'exercise-images',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) =>
              url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})

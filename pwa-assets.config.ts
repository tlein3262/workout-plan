import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

// สร้างไอคอนแอปทุกขนาดจาก public/icon.svg — รันใหม่ด้วย npx pwa-assets-generator
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: '#0074e2' } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: '#0074e2' } },
  },
  images: ['public/icon.svg'],
})

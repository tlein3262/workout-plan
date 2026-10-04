import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // './' = อ้างไฟล์แบบ relative ใช้ได้กับ GitHub Pages ทุกชื่อ repo โดยไม่ต้องแก้ตรงนี้
  base: './',
})

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

// ลงทะเบียน service worker (ใช้ออฟไลน์) — มีเวอร์ชันใหม่เมื่อไหร่ หน้าเว็บรีโหลดให้เองทันที
// และเช็กเวอร์ชันใหม่ทุกครั้งที่กลับมาเปิดแอป
registerSW({
  immediate: true,
  onRegisteredSW(_url, registration) {
    if (!registration) return
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') void registration.update()
    })
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

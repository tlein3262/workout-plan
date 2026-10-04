import { useEffect, useState } from 'react'

// 📘 เหมือน useState ทุกอย่าง แต่จำค่าไว้ใน localStorage ของเบราว์เซอร์
// ปิดเว็บแล้วเปิดใหม่ ค่ายังอยู่ (อยู่แค่ในเครื่อง/เบราว์เซอร์นี้)
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // โหมดไม่ระบุตัวตนบางเบราว์เซอร์เขียนไม่ได้ — ไม่เป็นไร ใช้แค่ในหน่วยความจำ
    }
  }, [key, value])

  // as const ทำให้ TypeScript รู้ว่าเป็น [ค่า, ฟังก์ชันตั้งค่า] เหมือน useState
  return [value, setValue] as const
}

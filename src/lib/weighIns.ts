import type { WeighIn } from '../data/plan'

// วันที่แบบ 2026-10-04 ตามเวลาเครื่อง
export const dateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// รวมข้อมูลจากไฟล์ plan.ts กับที่กรอกบนเว็บ — วันเดียวกัน ใช้ของที่กรอกบนเว็บ
export function mergeWeighIns(...lists: WeighIn[][]): WeighIn[] {
  const byDate = new Map<string, WeighIn>()
  for (const list of lists) for (const w of list) byDate.set(w.date, w)
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))
}

// ตรวจว่าข้อมูลที่นำเข้าจากไฟล์หน้าตาถูกต้อง (กันไฟล์เสียหรือไฟล์ผิด)
export function isWeighIn(x: unknown): x is WeighIn {
  if (typeof x !== 'object' || x === null) return false
  const w = x as Record<string, unknown>
  return (
    typeof w.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(w.date) &&
    typeof w.kg === 'number' &&
    w.kg >= 30 &&
    w.kg <= 300 &&
    (w.waist === undefined || typeof w.waist === 'number')
  )
}

// ดาวน์โหลดเป็นไฟล์ .json เก็บไว้สำรอง
export function downloadBackup(list: WeighIn[]) {
  const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `weigh-ins-${dateKey(new Date())}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// ขอให้เบราว์เซอร์ไม่ลบข้อมูลของเว็บนี้เองตอนพื้นที่เต็ม (ได้หรือไม่ได้แล้วแต่เบราว์เซอร์)
export function requestPersistentStorage() {
  void navigator.storage?.persist?.()
}

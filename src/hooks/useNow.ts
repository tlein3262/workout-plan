import { useEffect, useState } from 'react'

// 📘 Custom Hook = ฟังก์ชันที่ชื่อขึ้นต้นด้วย use และเรียก hook อื่นข้างใน
// ใช้รวม logic ที่ใช้ซ้ำได้หลายที่ — อันนี้คืน "เวลาปัจจุบัน" ที่อัปเดตเองทุกๆ intervalMs
export function useNow(intervalMs = 60_000) {
  // 📘 useState: เก็บค่าที่เปลี่ยนได้ — พอค่าเปลี่ยน React จะวาดหน้าจอใหม่ให้เอง
  const [now, setNow] = useState(() => new Date())

  // 📘 useEffect: โค้ดที่ทำงาน "หลัง" วาดหน้าจอเสร็จ เหมาะกับงานนอก React เช่น ตั้งเวลา
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    // ฟังก์ชันที่ return ออกไป = cleanup จะถูกเรียกตอน component หายไป (กันตัวจับเวลาค้าง)
    return () => clearInterval(id)
  }, [intervalMs]) // 📘 dependency array: effect จะรันใหม่เมื่อค่าในนี้เปลี่ยน

  return now
}

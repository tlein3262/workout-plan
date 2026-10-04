import type { CSSProperties } from 'react'

// พลุฉลองตอนเล่นครบทุกท่า — เป็น CSS ล้วน React แค่สร้างชิ้นกระดาษขึ้นมา
// ตำแหน่ง/ความเร็วคำนวณจาก index (ไม่ใช้ Math.random) ให้ทุกครั้งที่วาดได้ผลเหมือนเดิม
const PIECES = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 37) % 100,
  delay: ((i * 13) % 10) / 20,
  duration: 1.4 + ((i * 7) % 10) / 10,
  rotate: (i * 47) % 360,
  shape: i % 3,
}))

export function Confetti() {
  return (
    <div className="confetti" aria-hidden>
      {PIECES.map((p, i) => (
        <span
          key={i}
          className={`piece shape-${p.shape}`}
          style={
            {
              '--x': `${p.x}%`,
              '--delay': `${p.delay}s`,
              '--dur': `${p.duration}s`,
              '--rot': `${p.rotate}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

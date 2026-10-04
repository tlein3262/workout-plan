import { useEffect } from 'react'
import { useNow } from '../hooks/useNow'
import { beep } from '../lib/sound'

type Props = {
  endsAt: number // เวลาที่หมดพัก (มิลลิวินาที)
  total: number // พักทั้งหมดกี่วินาที ใช้วาดแถบความคืบหน้า
  onClose: () => void
}

// ตัวจับเวลาพักระหว่างเซ็ต — ลอยอยู่ด้านล่างจอ
export function RestTimer({ endsAt, total, onClose }: Props) {
  // ใช้ custom hook ตัวเดียวกับหน้าหลัก แต่ให้อัปเดตถี่ขึ้น (ทุก 0.25 วิ)
  const now = useNow(250)
  const left = Math.max(0, Math.ceil((endsAt - now.getTime()) / 1000))
  const finished = left === 0

  useEffect(() => {
    if (!finished) return
    // หมดเวลา: สั่นมือถือ (ถ้าเครื่องรองรับ) + ปี๊บ แล้วปิดตัวเองใน 4 วิ
    navigator.vibrate?.([200, 100, 200])
    beep()
    const id = setTimeout(onClose, 4000)
    return () => clearTimeout(id)
  }, [finished, onClose])

  const progress = finished ? 1 : 1 - left / total

  return (
    <div className={`rest-timer${finished ? ' finished' : ''}`} role="status">
      <div className="rest-bar" style={{ transform: `scaleX(${progress})` }} />
      <div className="rest-content">
        <span className="rest-label">{finished ? 'หมดเวลาพัก — ลุย! 💪' : 'พักอยู่'}</span>
        {!finished && (
          <span className="rest-time">
            {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}
          </span>
        )}
        <button className="rest-close" onClick={onClose} aria-label="ปิดตัวจับเวลา">
          ✕
        </button>
      </div>
    </div>
  )
}

import { useNow } from '../hooks/useNow'

type Props = {
  target: Date
  kgToLose: number
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

// 📘 แยกตัวนับถอยหลังเป็น component ของตัวเอง เพราะต้องอัปเดตทุกวินาที
// ถ้าไปใส่ useNow(1000) ที่ App ทั้งหน้าจะถูกวาดใหม่ทุกวินาที — แยกออกมา = วาดใหม่แค่ส่วนนี้
export function Countdown({ target, kgToLose }: Props) {
  const now = useNow(SECOND)
  const left = Math.max(0, target.getTime() - now.getTime())

  const parts = [
    { value: Math.floor(left / DAY), label: 'วัน' },
    { value: Math.floor((left % DAY) / HOUR), label: 'ชม.' },
    { value: Math.floor((left % HOUR) / MINUTE), label: 'นาที' },
    { value: Math.floor((left % MINUTE) / SECOND), label: 'วินาที' },
  ]

  const weeks = left / (7 * DAY)
  const perWeek = weeks > 0 ? kgToLose / weeks : 0

  return (
    <div className="countdown">
      <div className="countdown-tiles">
        {parts.map((p) => (
          <div key={p.label} className="tile">
            {/* 📘 key={p.value}: ตัวเลขเปลี่ยน = React สร้าง span ใหม่ → animation เด้งเล่นใหม่ทุกครั้ง */}
            <b key={p.value}>{String(p.value).padStart(2, '0')}</b>
            <span>{p.label}</span>
          </div>
        ))}
      </div>
      {perWeek > 0 && (
        <p className="countdown-hint">
          เหลือ ~{Math.ceil(weeks)} สัปดาห์ · ต้องลดเฉลี่ย <b>{perWeek.toFixed(1)} กก./สัปดาห์</b>
        </p>
      )}
    </div>
  )
}

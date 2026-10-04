import { useCallback, useState } from 'react'
import './App.css'
import { DayTabs } from './components/DayTabs'
import { GoalCard } from './components/GoalCard'
import { RestTimer } from './components/RestTimer'
import { TimelineRow } from './components/TimelineRow'
import { WorkoutCard } from './components/WorkoutCard'
import { week } from './data/plan'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useNow } from './hooks/useNow'

// วันที่แบบ 2026-10-04 (เวลาเครื่อง) ใช้แยกการติ๊กของแต่ละวัน
const dateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

type Rest = { endsAt: number; total: number }

function App() {
  const now = useNow()
  const today = now.getDay()

  // ---------- state ทั้งหมดของแอปอยู่ตรงนี้ ----------
  // 📘 "Lifting state up": เก็บ state ไว้ที่ component แม่ที่อยู่สูงสุดที่ต้องใช้มัน
  // แล้วส่งลงไปให้ลูกผ่าน props — ลูกหลายตัวจึงเห็นค่าเดียวกัน
  const [selected, setSelected] = useState(today)
  const [doneLog, setDoneLog] = useLocalStorage<{ date: string; ids: string[] }>('done', { date: '', ids: [] })
  const [rest, setRest] = useState<Rest | null>(null)

  const day = week[selected]
  const isToday = selected === today
  const todayKey = dateKey(now)
  // ข้ามวันแล้ว รายการติ๊กของเมื่อวานไม่นับ
  const doneToday = doneLog.date === todayKey ? doneLog.ids : []

  const toggleDone = (id: string) => {
    const ids = doneToday.includes(id) ? doneToday.filter((x) => x !== id) : [...doneToday, id]
    setDoneLog({ date: todayKey, ids })
  }

  // 📘 useCallback: จำฟังก์ชันไว้ไม่สร้างใหม่ทุกครั้งที่วาด
  // จำเป็นตรงนี้เพราะ RestTimer ใช้ onClose ใน dependency ของ useEffect
  const closeRest = useCallback(() => setRest(null), [])

  const nowMin = now.getHours() * 60 + now.getMinutes()
  const nowIndex = isToday ? day.timeline.findLastIndex((i) => i.start <= nowMin) : -1

  const proteinTotal = day.timeline
    .filter((i) => i.meal && !i.optional)
    .reduce((sum, i) => sum + (i.meal?.protein ?? 0), 0)

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-top">
          <div className="hero-date">
            {isToday && <span className="live-dot" />}
            {isToday ? 'วันนี้ · ' : ''}
            {now.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* 📘 key เปลี่ยน = React มองว่าเป็นชิ้นใหม่ → animation เริ่มเล่นใหม่ทุกครั้งที่เปลี่ยนวัน */}
        <div key={selected} className="hero-title">
          <h1>{day.name}</h1>
          <div className="hero-focus">
            {day.workout ? (
              <>
                <strong>{day.workout.title}</strong>
                <span>{day.workout.focus}</span>
              </>
            ) : (
              <span>วันพัก — ให้ร่างกายได้ฟื้นตัว 😴</span>
            )}
          </div>
        </div>

        <GoalCard proteinToday={proteinTotal} />
      </header>

      <DayTabs selected={selected} today={today} onSelect={setSelected} />

      <ol key={selected} className="timeline">
        {day.timeline.map((item, i) => (
          <TimelineRow key={i} item={item} index={i} isNow={i === nowIndex}>
            {item.kind === 'workout' && day.workout && (
              <WorkoutCard
                workout={day.workout}
                done={isToday ? doneToday : null}
                onToggleDone={toggleDone}
                onRest={(seconds) => setRest({ endsAt: Date.now() + seconds * 1000, total: seconds })}
              />
            )}
          </TimelineRow>
        ))}
      </ol>

      <footer className="foot">
        ทุกเซ็ตเหลือแรงไว้ 1–2 ครั้ง · ถ้าทำได้ครบจำนวนครั้งสูงสุดทุกเซ็ต สัปดาห์หน้าเพิ่มน้ำหนัก
      </footer>

      {/* key = endsAt ให้กดพักใหม่แล้วตัวจับเวลาเริ่มใหม่หมด */}
      {rest && <RestTimer key={rest.endsAt} endsAt={rest.endsAt} total={rest.total} onClose={closeRest} />}
    </div>
  )
}

export default App

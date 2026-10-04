import { useCallback, useState } from 'react'
import './App.css'
import { DayTabs } from './components/DayTabs'
import { GoalCard } from './components/GoalCard'
import { RestTimer } from './components/RestTimer'
import { TimelineRow } from './components/TimelineRow'
import { BottomSheet } from './components/BottomSheet'
import { WeightChart } from './components/WeightChart'
import { WeightSummary } from './components/WeightSummary'
import { WorkoutCard } from './components/WorkoutCard'
import { week, weighIns, type WeighIn } from './data/plan'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useNow } from './hooks/useNow'
import { unlockAudio } from './lib/sound'
import { dateKey, mergeWeighIns, requestPersistentStorage } from './lib/weighIns'

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
  // popup น้ำหนัก: ปิด / เปิดดูกราฟ / เปิดพร้อมฟอร์มบันทึก
  const [weightSheet, setWeightSheet] = useState<'closed' | 'view' | 'add'>('closed')
  // น้ำหนักที่กรอกบนเว็บ (เก็บในเครื่อง) — รวมกับที่เขียนไว้ใน plan.ts
  const [localWeighIns, setLocalWeighIns] = useLocalStorage<WeighIn[]>('weigh-ins', [])
  const allWeighIns = mergeWeighIns(weighIns, localWeighIns)

  const saveWeighIn = (entry: WeighIn) => {
    requestPersistentStorage()
    // 📘 state ห้ามแก้ตรงๆ (push/splice) — สร้าง array ใหม่เสมอ React ถึงจะรู้ว่าค่าเปลี่ยน
    setLocalWeighIns(mergeWeighIns(localWeighIns, [entry]))
  }
  const deleteWeighIn = (date: string) => setLocalWeighIns(localWeighIns.filter((w) => w.date !== date))
  const importWeighIns = (list: WeighIn[]) => setLocalWeighIns(mergeWeighIns(localWeighIns, list))

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

        <GoalCard proteinToday={proteinTotal} currentKg={allWeighIns[allWeighIns.length - 1].kg} />
        <WeightSummary entries={allWeighIns} onOpen={() => setWeightSheet('view')} onAdd={() => setWeightSheet('add')} />
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
                onRest={(seconds) => {
                  unlockAudio() // ต้องเรียกตอนผู้ใช้กดปุ่ม ไม่งั้น iPhone ไม่ยอมเล่นเสียง
                  setRest({ endsAt: Date.now() + seconds * 1000, total: seconds })
                }}
              />
            )}
          </TimelineRow>
        ))}
      </ol>

      <footer className="foot">
        ทุกเซ็ตเหลือแรงไว้ 1–2 ครั้ง · ถ้าทำได้ครบจำนวนครั้งสูงสุดทุกเซ็ต สัปดาห์หน้าเพิ่มน้ำหนัก
        <div className="build">
          อัปเดตล่าสุด{' '}
          {new Date(__BUILD_TIME__).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}
        </div>
      </footer>

      <BottomSheet open={weightSheet !== 'closed'} title="📉 น้ำหนัก" onClose={() => setWeightSheet('closed')}>
        <WeightChart
          entries={allWeighIns}
          localDates={localWeighIns.map((w) => w.date)}
          onSave={saveWeighIn}
          onDelete={deleteWeighIn}
          onImport={importWeighIns}
          startWithForm={weightSheet === 'add'}
        />
      </BottomSheet>

      {/* key = endsAt ให้กดพักใหม่แล้วตัวจับเวลาเริ่มใหม่หมด */}
      {rest && <RestTimer key={rest.endsAt} endsAt={rest.endsAt} total={rest.total} onClose={closeRest} />}
    </div>
  )
}

export default App

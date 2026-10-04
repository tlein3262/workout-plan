import { exerciseId, type Workout } from '../data/plan'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useWakeLock, wakeLockSupported } from '../hooks/useWakeLock'
import { BlockSection } from './BlockSection'
import { Confetti } from './Confetti'

type Props = {
  workout: Workout
  // null = ไม่ใช่วันนี้ ไม่ต้องให้ติ๊ก
  done: string[] | null
  onToggleDone: (id: string) => void
  onRest: (seconds: number) => void
}

export function WorkoutCard({ workout, done, onToggleDone, onRest }: Props) {
  const allIds = workout.blocks.flatMap((b) => b.exercises.map((ex) => exerciseId(b.label, ex.name)))
  const doneCount = done ? allIds.filter((id) => done.includes(id)).length : 0
  const percent = Math.round((doneCount / allIds.length) * 100)

  // จอไม่ดับ: ทำงานเฉพาะตอนดูตารางวันนี้ (done ไม่ใช่ null) และเปิดสวิตช์ไว้
  const [keepAwake, setKeepAwake] = useLocalStorage('keep-awake', true)
  useWakeLock(done !== null && keepAwake)

  return (
    <div className="workout">
      {percent === 100 && <Confetti />}

      {done && wakeLockSupported && (
        <button className={`awake-toggle${keepAwake ? ' on' : ''}`} onClick={() => setKeepAwake(!keepAwake)}>
          <span className="awake-switch" />
          📱 จอไม่ดับระหว่างเล่น
        </button>
      )}

      {done && (
        <div className={`progress${percent === 100 ? ' complete' : ''}`}>
          <div className="progress-text">
            <span>ความคืบหน้าวันนี้</span>
            <b>
              {doneCount}/{allIds.length} ท่า {percent === 100 && '🎉'}
            </b>
          </div>
          <div className="progress-track">
            {/* 📘 style รับเป็น object — ใช้ทำค่าที่เปลี่ยนตามข้อมูล เช่น ความกว้างแถบ */}
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}

      {workout.note && <p className="workout-note">{workout.note}</p>}

      {workout.blocks.map((block) => (
        <BlockSection key={block.label} block={block} done={done} onToggleDone={onToggleDone} onRest={onRest} />
      ))}
    </div>
  )
}

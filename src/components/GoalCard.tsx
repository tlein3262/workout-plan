import { goal, weighIns } from '../data/plan'
import { Countdown } from './Countdown'

type Props = {
  proteinToday: number
}

export function GoalCard({ proteinToday }: Props) {
  // น้ำหนักล่าสุดจากบันทึก — ยังไม่เคยชั่งก็ใช้น้ำหนักเริ่มต้น
  const current = weighIns.at(-1)?.kg ?? goal.start
  const steps = [
    { kg: current, label: 'ตอนนี้' },
    { kg: goal.mid, label: goal.midLabel },
    { kg: goal.final, label: 'เป้าหมาย' },
  ]

  return (
    <section className="card goal">
      <div className="goal-track">
        {/* 📘 .map() แปลง array เป็นรายการ JSX — ทุกชิ้นต้องมี key ไม่ซ้ำกัน */}
        {steps.map((s, i) => (
          <div key={s.kg} className="goal-part">
            {i > 0 && <div className="goal-line" />}
            <div className={`goal-step${i === steps.length - 1 ? ' final' : ''}`}>
              <b>{s.kg}</b>
              <span>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="section-title">⏳ นับถอยหลังสู่ {goal.mid} กก. ({goal.midLabel})</div>
      <Countdown target={goal.midDate} kgToLose={Math.max(0, current - goal.mid)} />

      <div className="stats">
        <div className="stat">
          <b>{goal.protein}g</b>
          <span>เป้าโปรตีน</span>
        </div>
        <div className="stat">
          <b>~{proteinToday}g</b>
          <span>ตามตารางวันนี้</span>
        </div>
        <div className="stat">
          <b>{goal.water}L</b>
          <span>น้ำ/วัน</span>
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { exerciseId, formatRest, type Block } from '../data/plan'
import { ExerciseCard } from './ExerciseCard'

type Props = {
  block: Block
  // null = ไม่ใช่วันนี้ ไม่ต้องให้ติ๊ก
  done: string[] | null
  onToggleDone: (id: string) => void
  onRest: (seconds: number) => void
}

const STEP = ['①', '②', '③', '④']

export function BlockSection({ block, done, onToggleDone, onRest }: Props) {
  // 📘 ตัวนับรอบเป็น state ของบล็อกนี้เอง — แต่ละบล็อกนับแยกกัน
  const [round, setRound] = useState(0)

  const hasRounds = block.rounds > 1
  const finished = round >= block.rounds
  const isLastRound = round === block.rounds - 1
  const order = block.exercises.map((_, i) => STEP[i]).join(' → ')

  const finishRound = () => {
    // 📘 ส่งฟังก์ชันเข้า setState ได้: รับค่าเดิม คืนค่าใหม่ — ปลอดภัยกว่าเวลาค่าใหม่ขึ้นกับค่าเดิม
    setRound((r) => r + 1)
    // รอบสุดท้ายไม่ต้องพัก ไปบล็อกถัดไปได้เลย
    if (!isLastRound && block.rest > 0) onRest(block.rest)
  }

  return (
    <section className={`block${finished ? ' finished' : ''}`}>
      <div className="block-head">
        <span className="block-label">{block.label}</span>
        <div className="block-info">
          {hasRounds ? (
            <>
              <b>{block.rounds} รอบ</b>
              <span>
                {block.exercises.length > 1 ? `เล่น ${order} ต่อกัน แล้วพัก ` : 'เล่นจบแล้วพัก '}
                <b>{formatRest(block.rest)}</b>
              </span>
            </>
          ) : (
            <span>{block.note ?? 'เล่นครั้งเดียว ไม่ต้องวนรอบ'}</span>
          )}
        </div>
      </div>

      {block.exercises.map((ex, i) => {
        const id = exerciseId(block.label, ex.name)
        return (
          <ExerciseCard
            key={id}
            ex={ex}
            step={block.exercises.length > 1 ? STEP[i] : undefined}
            done={done?.includes(id) ?? false}
            onToggleDone={done ? () => onToggleDone(id) : undefined}
          />
        )
      })}

      {hasRounds && (
        <div className="round-bar">
          <div className="round-dots" aria-label={`เล่นไปแล้ว ${round} จาก ${block.rounds} รอบ`}>
            {/* 📘 Array.from สร้าง array ตามจำนวนรอบ เพื่อวาดจุดทีละจุด */}
            {Array.from({ length: block.rounds }, (_, i) => (
              <button
                key={i}
                className={`round-dot${i < round ? ' filled' : ''}`}
                // กดจุดเพื่อแก้จำนวนรอบ (เผื่อกดผิด)
                onClick={() => setRound(i < round ? i : i + 1)}
                aria-label={`รอบที่ ${i + 1}`}
              />
            ))}
          </div>

          {finished ? (
            <span className="round-done">✓ ครบแล้ว ไปบล็อกถัดไป</span>
          ) : (
            <button className="round-btn" onClick={finishRound}>
              {isLastRound ? '✓ จบรอบสุดท้าย' : `⏱ จบรอบ ${round + 1} · พัก ${formatRest(block.rest)}`}
            </button>
          )}
        </div>
      )}
    </section>
  )
}

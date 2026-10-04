import { useState } from 'react'
import { imgUrl, youtubeUrl, type Exercise } from '../data/plan'

type Props = {
  ex: Exercise
  done: boolean
  // ใส่ ? = ไม่บังคับส่ง — วันที่ไม่ใช่วันนี้จะไม่มีปุ่มติ๊ก
  onToggleDone?: () => void
  step?: string // ลำดับในบล็อก เช่น ①
}

export function ExerciseCard({ ex, step, done, onToggleDone }: Props) {
  // 📘 state เฉพาะของการ์ดใบนี้ — การ์ดแต่ละใบมี state แยกกันเอง
  const [open, setOpen] = useState(false)
  const [imgOk, setImgOk] = useState(true)

  return (
    <article className={`card exercise${open ? ' open' : ''}${done ? ' done' : ''}`}>
      {/* กดที่การ์ด = กาง/หุบ */}
      <div className="exercise-main" onClick={() => setOpen(!open)}>
        {ex.img && imgOk && (
          <div className="exercise-img">
            <img src={imgUrl(ex.img, 0)} alt={ex.name} loading="lazy" onError={() => setImgOk(false)} />
            <img src={imgUrl(ex.img, 1)} alt="" loading="lazy" className="frame-2" />
          </div>
        )}
        <div className="exercise-body">
          <div className="exercise-name">
            {step && <span className="step">{step}</span>}
            {ex.name}
          </div>
          <div className="exercise-th">{ex.th}</div>
          <div className="exercise-sets">{ex.sets}</div>
        </div>

        {onToggleDone && (
          <button
            className="check"
            aria-label={done ? 'ยกเลิกติ๊ก' : 'ติ๊กว่าเล่นเสร็จ'}
            onClick={(e) => {
              // 📘 กันไม่ให้การกดปุ่มนี้ไปทำให้การ์ดกาง/หุบด้วย (event ส่งต่อขึ้นไปหาแม่)
              e.stopPropagation()
              onToggleDone()
            }}
          >
            {done ? '✓' : ''}
          </button>
        )}
      </div>

      {/* 📘 Conditional rendering: แสดงส่วนนี้เฉพาะตอน open เป็น true */}
      {open && (
        <div className="exercise-more">
          {ex.img && imgOk && (
            <div className="frames">
              <figure>
                <img src={imgUrl(ex.img, 0)} alt="ท่าเริ่ม" />
                <figcaption>ท่าเริ่ม</figcaption>
              </figure>
              <figure>
                <img src={imgUrl(ex.img, 1)} alt="ท่าจบ" />
                <figcaption>ท่าจบ</figcaption>
              </figure>
            </div>
          )}
          {ex.tip && <p className="exercise-tip">💡 {ex.tip}</p>}
          <a className="pill-link" href={youtubeUrl(ex.name)} target="_blank" rel="noreferrer">
            ▶ ดูวิดีโอใน YouTube
          </a>
        </div>
      )}
    </article>
  )
}

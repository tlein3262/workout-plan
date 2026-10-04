import { useState, type CSSProperties, type ReactNode } from 'react'
import type { TimelineItem } from '../data/plan'

type Props = {
  item: TimelineItem
  isNow: boolean
  index: number
  // 📘 children = สิ่งที่วางไว้ระหว่างแท็กเปิด-ปิด <TimelineRow>...</TimelineRow>
  // ทำให้แม่ยัดเนื้อหาอะไรเข้ามาก็ได้ (ในที่นี้คือการ์ดเวท)
  children?: ReactNode
}

export function TimelineRow({ item, isNow, index, children }: Props) {
  const [showSwaps, setShowSwaps] = useState(false)
  const swaps = item.meal?.swaps

  const classes = ['tl-item', `kind-${item.kind}`]
  if (isNow) classes.push('is-now')
  if (item.optional) classes.push('is-optional')

  return (
    // --i ใช้ใน CSS ให้แต่ละแถวค่อยๆ โผล่ขึ้นมาทีละอัน
    <li className={classes.join(' ')} style={{ '--i': index } as CSSProperties}>
      <div className="tl-time">{item.time}</div>
      <div className="tl-dot" aria-hidden>
        {item.icon}
      </div>

      <div className="tl-content">
        <div className="tl-title">
          {item.title}
          {isNow && <span className="badge now">ตอนนี้</span>}
          {item.optional && <span className="badge">ไม่บังคับ</span>}
        </div>
        {item.detail && <div className="tl-detail">{item.detail}</div>}

        {item.meal && (
          <div className="card meal">
            <div className="meal-row">
              <span>{item.meal.menu}</span>
              {item.meal.protein > 0 && <span className="protein">{item.meal.protein}g</span>}
            </div>
            {swaps && (
              <>
                <button className="swap-btn" onClick={() => setShowSwaps(!showSwaps)}>
                  {showSwaps ? '− ซ่อนเมนูแทน' : '+ เมนูอื่นแทนได้'}
                </button>
                {showSwaps && (
                  <ul className="swaps">
                    {swaps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        )}

        {children}
      </div>
    </li>
  )
}

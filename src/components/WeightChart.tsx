import { useRef, useState, type ChangeEvent } from 'react'
import { goal, type WeighIn } from '../data/plan'
import { downloadBackup, isWeighIn } from '../lib/weighIns'
import { WeighInForm } from './WeighInForm'

// ขนาดพื้นที่วาดใน SVG (หน่วยสมมติ — viewBox จะยืดให้พอดีความกว้างจอเอง)
const W = 340
const H = 190
const PAD = { top: 16, right: 44, bottom: 24, left: 30 }

const DAY = 24 * 60 * 60 * 1000
const parseDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const shortDate = (d: Date) => d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })

type Props = {
  entries: WeighIn[] // ข้อมูลทั้งหมด (จากไฟล์ + ที่กรอกบนเว็บ) เรียงตามวันที่แล้ว
  localDates: string[] // วันที่ที่กรอกบนเว็บ — ลบได้เฉพาะพวกนี้
  onSave: (entry: WeighIn) => void
  onDelete: (date: string) => void
  onImport: (list: WeighIn[]) => void
  startWithForm?: boolean // เปิดมาพร้อมฟอร์มบันทึกเลย (กดปุ่ม + บันทึก)
}

export function WeightChart({ entries, localDates, onSave, onDelete, onImport, startWithForm = false }: Props) {
  // 📘 state สำหรับ hover: เก็บแค่ "จุดไหนกำลังถูกชี้" — ที่เหลือคำนวณจากข้อมูลทั้งหมด
  const [active, setActive] = useState<number | null>(null)
  const [formOpen, setFormOpen] = useState(startWithForm)
  const [message, setMessage] = useState('')
  // 📘 useRef: อ้างถึง element จริงบนหน้า (ที่นี่คือช่องเลือกไฟล์ที่ซ่อนอยู่) โดยไม่ทำให้วาดใหม่
  const fileInput = useRef<HTMLInputElement>(null)

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // เลือกไฟล์เดิมซ้ำได้
    if (!file) return
    try {
      const data: unknown = JSON.parse(await file.text())
      const list = Array.isArray(data) ? data.filter(isWeighIn) : []
      if (list.length === 0) throw new Error('empty')
      onImport(list)
      setMessage(`นำเข้า ${list.length} รายการแล้ว ✓`)
    } catch {
      setMessage('ไฟล์ไม่ถูกต้อง — ใช้ไฟล์ที่ได้จากปุ่มสำรองข้อมูลเท่านั้น')
    }
  }

  const points = entries.map((w) => ({ ...w, d: parseDate(w.date) }))
  const latest = points[points.length - 1]
  const prev = points.length > 1 ? points[points.length - 2] : null
  const lost = goal.start - latest.kg
  const percent = Math.max(0, Math.min(100, (lost / (goal.start - goal.mid)) * 100))

  // ---------- สเกล: แปลง วันที่/น้ำหนัก → ตำแหน่งบนจอ ----------
  const x0 = goal.startDate.getTime()
  // แกน x ยาวถึงสิ้นปี หรือถึงวันที่ล่าสุดถ้าเลยสิ้นปีไปแล้ว
  const x1 = Math.max(goal.midDate.getTime(), latest.d.getTime())
  const kgs = points.map((p) => p.kg)
  const yMin = Math.floor(Math.min(goal.mid, ...kgs) - 2)
  const yMax = Math.ceil(Math.max(goal.start, ...kgs) + 1)
  const x = (d: Date) => PAD.left + ((d.getTime() - x0) / (x1 - x0)) * (W - PAD.left - PAD.right)
  const y = (kg: number) => PAD.top + ((yMax - kg) / (yMax - yMin)) * (H - PAD.top - PAD.bottom)

  const yTicks = [95, 100, 105, 110].filter((t) => t >= yMin && t <= yMax)
  // วันที่ 1 ของแต่ละเดือนระหว่างวันเริ่มถึงสิ้นปี
  const xTicks: Date[] = []
  for (let d = new Date(goal.startDate.getFullYear(), goal.startDate.getMonth() + 1, 1); d.getTime() <= x1; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    xTicks.push(d)
  }

  // 📘 สร้างเส้นจาก array ของจุด: "x1,y1 x2,y2 ..." ส่งให้ <polyline>
  const linePoints = points.map((p) => `${x(p.d)},${y(p.kg)}`).join(' ')
  const activePoint = active !== null ? points[active] : null

  return (
    <div className="weight">
      <div className="weight-head">
        <div>
          <div className="section-label">น้ำหนักล่าสุด</div>
          <div className="weight-now">
            <b>{latest.kg.toFixed(1)}</b> กก.
            {prev && (
              <span className={`delta${latest.kg <= prev.kg ? ' down' : ' up'}`}>
                {latest.kg <= prev.kg ? '▼' : '▲'} {Math.abs(latest.kg - prev.kg).toFixed(1)} จากครั้งก่อน
              </span>
            )}
          </div>
        </div>
        <div className="weight-lost">
          <b>{lost > 0 ? `−${lost.toFixed(1)}` : '0'}</b>
          <span>ลดไปแล้ว (กก.)</span>
        </div>
      </div>

      <div className="mini-progress" aria-label={`ไปแล้ว ${Math.round(percent)}% ของเป้าสิ้นปี`}>
        <div className="mini-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="mini-caption">
        {Math.round(percent)}% ของเป้าสิ้นปี ({goal.start} → {goal.mid})
      </div>

      {formOpen ? (
        <WeighInForm
          lastKg={latest.kg}
          onCancel={() => setFormOpen(false)}
          onSave={(entry) => {
            onSave(entry)
            setFormOpen(false)
            setMessage(`บันทึก ${entry.kg} กก. แล้ว ✓`)
          }}
        />
      ) : (
        <button className="btn primary add-weight" onClick={() => setFormOpen(true)}>
          + บันทึกน้ำหนัก
        </button>
      )}
      {message && <p className="form-message">{message}</p>}

      <div className="chart-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="กราฟน้ำหนักเทียบเส้นเป้าหมาย">
          {/* เส้นตาราง */}
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="grid" />
              <text x={PAD.left - 6} y={y(t)} className="axis-label" textAnchor="end" dominantBaseline="middle">
                {t}
              </text>
            </g>
          ))}
          {xTicks.map((d) => (
            <text key={d.getTime()} x={x(d)} y={H - 6} className="axis-label" textAnchor="middle">
              {d.toLocaleDateString('th-TH', { month: 'short' })}
            </text>
          ))}

          {/* เส้นเป้า: เส้นตรงจาก 110 วันเริ่ม → 95 สิ้นปี */}
          <line x1={x(goal.startDate)} y1={y(goal.start)} x2={x(goal.midDate)} y2={y(goal.mid)} className="target-line" />
          <text x={x(goal.midDate) + 4} y={y(goal.mid)} className="target-label" dominantBaseline="middle">
            เป้า {goal.mid}
          </text>

          {/* เส้นน้ำหนักจริง */}
          {points.length > 1 && <polyline points={linePoints} className="actual-line" />}
          {points.map((p, i) => (
            <circle key={p.date} cx={x(p.d)} cy={y(p.kg)} r={i === active ? 6 : 4.5} className="actual-dot" />
          ))}

          {/* ป้ายเฉพาะจุดล่าสุด */}
          <text x={x(latest.d) + 8} y={y(latest.kg) - 8} className="point-label">
            {latest.kg}
          </text>

          {/* พื้นที่รับการชี้/แตะ ใหญ่กว่าจุดจริง กดง่ายบนมือถือ */}
          {points.map((p, i) => (
            <circle
              key={`hit-${p.date}`}
              cx={x(p.d)}
              cy={y(p.kg)}
              r={14}
              className="hit"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(active === i ? null : i)}
            />
          ))}
        </svg>

        {activePoint && (
          <div
            className="chart-tip"
            style={{ left: `${(x(activePoint.d) / W) * 100}%`, top: `${(y(activePoint.kg) / H) * 100}%` }}
          >
            <b>{activePoint.kg} กก.</b>
            <span>{shortDate(activePoint.d)}</span>
            {activePoint.waist && <span>เอว {activePoint.waist} ซม.</span>}
          </div>
        )}
      </div>

      <div className="chart-legend">
        <span>
          <i className="key actual" /> น้ำหนักจริง
        </span>
        <span>
          <i className="key target" /> เส้นเป้า (ลดเฉลี่ย {(((goal.start - goal.mid) / (x1 - x0)) * 7 * DAY).toFixed(1)} กก./สัปดาห์)
        </span>
      </div>

      <details className="weight-table">
        <summary>ดูตารางบันทึก ({points.length} ครั้ง)</summary>
        <table>
          <thead>
            <tr>
              <th>วันที่</th>
              <th>น้ำหนัก</th>
              <th>เปลี่ยน</th>
              <th>เอว</th>
              <th aria-label="ลบ" />
            </tr>
          </thead>
          <tbody>
            {/* แสดงล่าสุดก่อน: copy array ก่อน reverse เพื่อไม่ให้ข้อมูลต้นฉบับถูกแก้ */}
            {[...points].reverse().map((p, i, arr) => {
              const before = arr[i + 1]
              const diff = before ? p.kg - before.kg : null
              return (
                <tr key={p.date}>
                  <td>{shortDate(p.d)}</td>
                  <td>{p.kg.toFixed(1)}</td>
                  <td>{diff === null ? '–' : `${diff > 0 ? '+' : ''}${diff.toFixed(1)}`}</td>
                  <td>{p.waist ?? '–'}</td>
                  <td>
                    {localDates.includes(p.date) && (
                      <button
                        className="row-delete"
                        aria-label={`ลบ ${p.date}`}
                        onClick={() => {
                          if (confirm(`ลบน้ำหนักวันที่ ${shortDate(p.d)} ?`)) onDelete(p.date)
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="weight-hint">
          ข้อมูลที่กรอกเก็บอยู่ในมือถือเครื่องนี้เท่านั้น — กดสำรองไว้เป็นระยะ กันข้อมูลหายตอนล้างเบราว์เซอร์/ลบแอป
        </p>
        <div className="backup-row">
          <button className="btn ghost" onClick={() => downloadBackup(entries)}>
            ⬇ สำรองข้อมูล
          </button>
          <button className="btn ghost" onClick={() => fileInput.current?.click()}>
            ⬆ นำเข้า
          </button>
          <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={handleImport} />
        </div>
      </details>
    </div>
  )
}

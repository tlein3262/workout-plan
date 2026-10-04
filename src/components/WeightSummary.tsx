import { goal, type WeighIn } from '../data/plan'

type Props = {
  entries: WeighIn[]
  onOpen: () => void
  onAdd: () => void
}

// แถบสรุปน้ำหนักบนหน้าหลัก — กดเพื่อเปิดกราฟ/บันทึกใน popup
export function WeightSummary({ entries, onOpen, onAdd }: Props) {
  const latest = entries[entries.length - 1]
  const prev = entries.length > 1 ? entries[entries.length - 2] : null
  const lost = goal.start - latest.kg

  return (
    <section className="card weight-summary">
      <button className="summary-main" onClick={onOpen}>
        <span className="summary-icon" aria-hidden>
          📉
        </span>
        <span className="summary-text">
          <span className="summary-label">น้ำหนักล่าสุด</span>
          <span className="summary-value">
            <b>{latest.kg.toFixed(1)}</b> กก.
            {prev && (
              <span className={`delta${latest.kg <= prev.kg ? ' down' : ' up'}`}>
                {latest.kg <= prev.kg ? '▼' : '▲'} {Math.abs(latest.kg - prev.kg).toFixed(1)}
              </span>
            )}
            <span className="summary-lost">· ลดไปแล้ว {lost > 0 ? lost.toFixed(1) : 0}</span>
          </span>
        </span>
        <span className="summary-chevron" aria-hidden>
          ›
        </span>
      </button>
      <button className="btn primary summary-add" onClick={onAdd}>
        + บันทึก
      </button>
    </section>
  )
}

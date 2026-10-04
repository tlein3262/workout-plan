import { week } from '../data/plan'

// week เรียงตาม Date.getDay() (0 = อาทิตย์) แต่บนจอเรียง จันทร์ → อาทิตย์ ให้เสาร์-อาทิตย์อยู่ติดกัน
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0]

type Props = {
  selected: number
  today: number
  onSelect: (index: number) => void
}

export function DayTabs({ selected, today, onSelect }: Props) {
  return (
    <nav className="days">
      {DISPLAY_ORDER.map((i) => {
        const d = week[i]
        // 📘 ประกอบ className ตามเงื่อนไข — วิธีทำ "สไตล์ที่เปลี่ยนตาม state" ที่ง่ายที่สุด
        const classes = ['day-tab']
        if (i === selected) classes.push('active')
        if (i === today) classes.push('today')
        return (
          <button key={d.short} className={classes.join(' ')} onClick={() => onSelect(i)}>
            <span className="day-short">{d.short}</span>
            <span className="day-kind">{d.workout?.title.split(' ')[0].replace('วัน', '') ?? 'พัก'}</span>
          </button>
        )
      })}
    </nav>
  )
}

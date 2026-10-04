import { useState, type FormEvent } from 'react'
import type { WeighIn } from '../data/plan'
import { dateKey } from '../lib/weighIns'

const formatThaiDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

type Props = {
  lastKg: number
  onSave: (entry: WeighIn) => void
  onCancel: () => void
}

export function WeighInForm({ lastKg, onSave, onCancel }: Props) {
  // 📘 Controlled input: ค่าในช่องกรอกเก็บใน state — React เป็นคนคุมว่าช่องแสดงอะไร
  // เก็บเป็น string เพราะระหว่างพิมพ์อาจเป็น "108." ซึ่งยังไม่ใช่ตัวเลขสมบูรณ์
  const [date, setDate] = useState(() => dateKey(new Date()))
  const [kg, setKg] = useState('')
  const [waist, setWaist] = useState('')

  const kgNum = Number(kg)
  const kgValid = kg !== '' && kgNum >= 30 && kgNum <= 300
  const waistValid = waist === '' || (Number(waist) >= 40 && Number(waist) <= 250)
  const canSave = kgValid && waistValid && date !== ''

  const handleSubmit = (e: FormEvent) => {
    // 📘 ฟอร์ม HTML ปกติจะโหลดหน้าใหม่ตอนกดส่ง — preventDefault หยุดไว้ให้ React จัดการเอง
    e.preventDefault()
    if (!canSave) return
    onSave({
      date,
      kg: Math.round(kgNum * 10) / 10,
      ...(waist !== '' && { waist: Number(waist) }),
    })
  }

  return (
    <form className="weigh-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label className="field grow">
          <span>น้ำหนัก (กก.)</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            placeholder={lastKg.toFixed(1)}
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            autoFocus
            required
          />
        </label>
        <label className="field">
          <span>รอบเอว (ซม.)</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.5"
            placeholder="ไม่ใส่ก็ได้"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
          />
        </label>
      </div>
      <label className="field">
        <span>วันที่</span>
        {/* ช่องวันที่ของ iPhone คุมขนาดยาก — วาดกล่องเอง แล้ววาง input จริงแบบโปร่งใสทับไว้
            แตะแล้วยังได้ตัวเลือกวันที่ของระบบเหมือนเดิม */}
        <div className="date-field">
          <span>{date ? formatThaiDate(date) : 'เลือกวันที่'}</span>
          <span aria-hidden>📅</span>
          <input
            type="date"
            className="date-native"
            value={date}
            max={dateKey(new Date())}
            onChange={(e) => setDate(e.target.value)}
            // คอมพิวเตอร์: คลิกตรงไหนก็เปิดปฏิทิน
            onClick={(e) => e.currentTarget.showPicker?.()}
            required
          />
        </div>
      </label>

      {kg !== '' && !kgValid && <p className="form-error">น้ำหนักควรอยู่ระหว่าง 30–300 กก.</p>}
      {!waistValid && <p className="form-error">รอบเอวควรอยู่ระหว่าง 40–250 ซม.</p>}

      <div className="form-actions">
        <button type="button" className="btn ghost" onClick={onCancel}>
          ยกเลิก
        </button>
        <button type="submit" className="btn primary" disabled={!canSave}>
          บันทึก
        </button>
      </div>
    </form>
  )
}

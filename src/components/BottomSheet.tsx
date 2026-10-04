import { useEffect, useRef, type ReactNode } from 'react'

type Props = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

// แผ่นเด้งขึ้นจากด้านล่างจอ — ใช้แท็ก <dialog> ของ HTML ซึ่งมีฉากหลังมืด, กด Esc ปิด, ล็อกโฟกัสไว้ข้างในให้ฟรี
export function BottomSheet({ open, title, onClose, children }: Props) {
  // 📘 useRef + useEffect: สั่งงาน element จริงที่ React ไม่ได้คุมให้ (showModal/close เป็นคำสั่งของเบราว์เซอร์)
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()

    if (!open) return
    // ล็อกไม่ให้หน้าหลักเลื่อนตามตอนปัดใน popup (iPhone)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      className="sheet"
      // กด Esc หรือปุ่มย้อนกลับของ Android → เบราว์เซอร์ปิด dialog เอง แจ้ง state ให้ตรงกัน
      onClose={onClose}
      // แตะฉากหลังมืด (นอกแผ่น) = ปิด
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="sheet-body">
        <div className="sheet-handle" aria-hidden />
        <header className="sheet-head">
          <h2>{title}</h2>
          <button className="sheet-close" onClick={onClose} aria-label="ปิด">
            ✕
          </button>
        </header>
        {/* ไม่วาดเนื้อหาตอนปิด — เปิดใหม่ทุกครั้งฟอร์มจะเริ่มจากค่าว่าง */}
        {open && children}
      </div>
    </dialog>
  )
}

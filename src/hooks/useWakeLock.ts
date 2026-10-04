import { useEffect } from 'react'

export const wakeLockSupported = typeof navigator !== 'undefined' && 'wakeLock' in navigator

// สั่งให้จอมือถือไม่ดับ ตราบใดที่ enabled เป็น true
export function useWakeLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled || !wakeLockSupported) return

    let sentinel: WakeLockSentinel | null = null
    let cancelled = false

    const request = async () => {
      try {
        const s = await navigator.wakeLock.request('screen')
        if (cancelled) void s.release()
        else sentinel = s
      } catch {
        // แบตต่ำหรือเบราว์เซอร์ไม่ยอม — ข้ามไป
      }
    }

    // สลับไปแอปอื่นแล้วกลับมา ระบบจะปล่อย wake lock เอง ต้องขอใหม่
    const onVisible = () => {
      if (document.visibilityState === 'visible') void request()
    }

    void request()
    document.addEventListener('visibilitychange', onVisible)

    // 📘 cleanup: ปิดสวิตช์หรือออกจากหน้านี้ = ปล่อยให้จอดับได้ตามปกติ
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
      void sentinel?.release()
    }
  }, [enabled])
}

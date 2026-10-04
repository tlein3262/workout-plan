// เสียงเตือนสร้างด้วย Web Audio API — ไม่ต้องมีไฟล์เสียง
// iPhone จะยอมให้เล่นเสียงก็ต่อเมื่อผู้ใช้เคยแตะหน้าจอก่อน จึงต้องเรียก unlockAudio() ตอนกดปุ่ม
let ctx: AudioContext | null = null

export function unlockAudio() {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
  } catch {
    // เบราว์เซอร์ไม่รองรับ — ไม่มีเสียงก็ไม่เป็นไร
  }
}

// ปี๊บ 3 ครั้ง
export function beep(times = 3) {
  if (!ctx) return
  const start = ctx.currentTime
  for (let i = 0; i < times; i++) {
    const t = start + i * 0.28
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = i === times - 1 ? 1320 : 880 // ครั้งสุดท้ายเสียงสูงขึ้น
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.4, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.22)
  }
}

// ข้อมูลตารางทั้งหมดอยู่ในไฟล์นี้ — อยากแก้ตารางให้แก้ที่นี่ที่เดียว

export type Exercise = {
  name: string
  th: string
  sets: string
  tip?: string
  img?: string // id จาก free-exercise-db
}

export type Block = {
  label: string
  rounds: number // วนกี่รอบ
  rest: number // พักกี่วินาทีหลังเล่นครบ 1 รอบ (0 = ไม่ต้องพัก)
  note?: string
  exercises: Exercise[]
}

export type Workout = {
  title: string
  focus: string
  time: string
  blocks: Block[]
  note?: string
}

export type Meal = {
  menu: string
  protein: number
  swaps?: string[]
}

export type TimelineItem = {
  time: string
  start: number // นาทีนับจากเที่ยงคืน ใช้หาช่วงเวลาปัจจุบัน
  icon: string
  title: string
  detail?: string
  kind: 'supp' | 'walk' | 'workout' | 'meal' | 'sleep' | 'rest'
  meal?: Meal
  optional?: boolean
}

export type DayPlan = {
  name: string
  short: string
  workout: Workout | null
  timeline: TimelineItem[]
}

export const goal = {
  start: 110,
  mid: 95,
  midLabel: 'สิ้นปี 69',
  midDate: new Date(2027, 0, 1), // เที่ยงคืนวันขึ้นปีใหม่ 2570
  final: 80,
  height: 185,
  protein: '160–180',
  water: '3',
}

const IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'
export const imgUrl = (id: string, frame: 0 | 1) => `${IMG_BASE}${id}/${frame}.jpg`
export const youtubeUrl = (name: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${name} วิธีเล่น`)}`

// id ของท่า = บล็อก + ชื่อท่า (ท่าเดียวกันอาจอยู่คนละบล็อกได้)
export const exerciseId = (block: string, name: string) => `${block}:${name}`

export const formatRest = (seconds: number) =>
  seconds >= 60 && seconds % 60 === 0 ? `${seconds / 60} นาที` : `${seconds} วิ`

const t = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

// ---------- อาหาร ----------

const proteinSwaps = [
  'อกไก่ → หมูสันใน / ปลากะพง / แซลมอน / กุ้ง / ทูน่ากระป๋องในน้ำแร่ / เต้าหู้แข็ง',
  'ข้าวกล้อง → มันหวาน / ข้าวไรซ์เบอร์รี่ / ข้าวโอ๊ต / ขนมปังโฮลวีต 2 แผ่น',
]

const meals = {
  whey: { menu: 'เวย์โปรตีน 1 สกูป', protein: 25 },
  breakfast: {
    menu: 'ข้าวกล้อง 150–200g + อกไก่ 100g + ไข่ต้ม 1 ฟอง',
    protein: 40,
    swaps: [
      ...proteinSwaps,
      'ร้านสะดวกซื้อ: ข้าวกล่องอกไก่ + ไข่ต้ม 2 ฟอง',
      'ข้าวมื้อนี้กินได้มากกว่ามื้ออื่น เพราะเพิ่งเล่นเวทเสร็จ',
    ],
  },
  lunch: {
    menu: 'ข้าวกล้อง 100g + อกไก่ 150g',
    protein: 48,
    swaps: [
      ...proteinSwaps,
      'ตามสั่ง: กะเพราไก่/ทะเล ข้าวครึ่ง ไม่เอาไข่ดาว',
      'สุกี้น้ำ / ข้าวมันไก่ต้ม (ไม่เอาหนัง) / ไก่ย่าง + ส้มตำ',
    ],
  },
  snack: { menu: 'เวย์โปรตีน 1 สกูป + ถั่วลิสง 20g', protein: 30 },
  dinner: {
    menu: 'อกไก่ 150g + สลัดผัก + ไข่ต้ม 1 ฟอง',
    protein: 50,
    swaps: [proteinSwaps[0], 'ร้านสะดวกซื้อ: อกไก่พร้อมทาน 2 ชิ้น + สลัด'],
  },
  bedtime: { menu: 'กรีกโยเกิร์ต 150g + อัลมอนด์ 10 เม็ด', protein: 18 },
} satisfies Record<string, Meal>

// ---------- ท่าเวท ----------

const calf: Exercise = {
  name: 'Standing Calf Raise',
  th: 'เขย่งน่อง',
  sets: '3 × 15',
  tip: 'ค้างบนสุด 1 วิ ลงให้สุด',
  img: 'Standing_Calf_Raises',
}

const kneeRaise: Exercise = {
  name: 'Hanging Knee Raise',
  th: 'โหนบาร์ยกเข่า',
  sets: '3 × 10–12',
  tip: 'ยกเข่าหาอก ไม่แกว่งตัว',
  img: 'Hanging_Leg_Raise',
}

const upperA: Workout = {
  title: 'Upper A',
  focus: 'อก · หลัง · ไหล่ · แขน',
  time: '06:30–07:30',
  blocks: [
    {
      label: 'A',
      rounds: 4,
      rest: 90,
      exercises: [
        { name: 'Bench Press', th: 'ดันบาร์นอนราบ', sets: '4 × 6–10', tip: 'บีบสะบัก เท้าวางแน่น ลดบาร์ลงกลางอก', img: 'Barbell_Bench_Press_-_Medium_Grip' },
        { name: 'Lat Pulldown', th: 'ดึงบาร์ลงหน้าอก', sets: '4 × 8–12', tip: 'ใช้ศอกนำ ดึงลงหาอกบน ไม่เหวี่ยงตัว', img: 'Wide-Grip_Lat_Pulldown' },
      ],
    },
    {
      label: 'B',
      rounds: 3,
      rest: 90,
      exercises: [
        { name: 'Dumbbell Shoulder Press', th: 'ดันดัมเบลเหนือศีรษะ', sets: '3 × 8–12', tip: 'เกร็งท้อง ไม่แอ่นหลัง', img: 'Dumbbell_Shoulder_Press' },
        { name: 'Seated Cable Row', th: 'นั่งดึงเคเบิล', sets: '3 × 8–12', tip: 'อกตั้ง ดึงศอกไปด้านหลัง บีบสะบัก', img: 'Seated_Cable_Rows' },
      ],
    },
    {
      label: 'C',
      rounds: 3,
      rest: 60,
      exercises: [
        { name: 'Lateral Raise', th: 'ยกดัมเบลด้านข้าง', sets: '3 × 12–15', tip: 'ยกถึงระดับไหล่ ใช้น้ำหนักเบา', img: 'Side_Lateral_Raise' },
        { name: 'Bicep Curl', th: 'ม้วนดัมเบล', sets: '3 × 12–15', tip: 'ศอกแนบลำตัว ลดลงช้าๆ', img: 'Dumbbell_Bicep_Curl' },
        { name: 'Tricep Pushdown', th: 'กดเคเบิลหลังแขน', sets: '3 × 12–15', tip: 'ศอกล็อกข้างลำตัว เหยียดให้สุด', img: 'Triceps_Pushdown' },
      ],
    },
  ],
}

const lowerA: Workout = {
  title: 'Lower A',
  focus: 'ขา · ก้น · แกนกลาง (เน้นสควอท)',
  time: '06:30–07:30',
  blocks: [
    {
      label: 'A',
      rounds: 4,
      rest: 90,
      exercises: [
        { name: 'Goblet Squat', th: 'สควอทถือดัมเบลหน้าอก', sets: '4 × 8–10', tip: 'อกตั้ง ดันเข่าออกตามแนวปลายเท้า', img: 'Goblet_Squat' },
        { name: 'Plank', th: 'แพลงก์', sets: '4 × 30–45 วิ', tip: 'ลำตัวตรง เกร็งท้องและก้น สะโพกไม่ตก', img: 'Plank' },
      ],
    },
    {
      label: 'B',
      rounds: 3,
      rest: 90,
      exercises: [
        { name: 'Romanian Deadlift', th: 'โรมาเนียนเดดลิฟต์', sets: '3 × 8–12', tip: 'ดันสะโพกไปด้านหลัง หลังตรง เข่างอนิดเดียว', img: 'Romanian_Deadlift' },
        { name: 'Leg Extension', th: 'เตะขาเครื่อง', sets: '3 × 8–12', tip: 'ค้างบนสุด 1 วิ ลงช้าๆ', img: 'Leg_Extensions' },
      ],
    },
    {
      label: 'C',
      rounds: 3,
      rest: 60,
      exercises: [
        { name: 'Reverse Lunge', th: 'ก้าวถอยหลังย่อ', sets: '3 × 10/ข้าง', tip: 'ก้าวถอยหลังจะถนอมเข่ากว่าก้าวหน้า', img: 'Dumbbell_Rear_Lunge' },
        calf,
      ],
    },
  ],
}

const coreDay: Workout = {
  title: 'Core + Recovery',
  focus: 'แกนกลาง · ยืดเหยียด (วันเบา)',
  time: '06:30–07:10',
  note: 'วันฟื้นตัว ไม่ต้องเหนื่อย จบเร็วได้',
  blocks: [
    {
      label: 'แกนกลาง',
      rounds: 3,
      rest: 45,
      exercises: [
        { name: 'Dead Bug', th: 'นอนหงายสลับแขนขา', sets: '3 × 10/ข้าง', tip: 'หลังล่างแนบพื้นตลอด', img: 'Dead_Bug' },
        { name: 'Side Plank', th: 'แพลงก์ด้านข้าง', sets: '3 × 30 วิ/ข้าง', tip: 'สะโพกยกสูง ลำตัวเป็นเส้นตรง', img: 'Side_Bridge' },
        kneeRaise,
      ],
    },
    {
      label: 'คาร์ดิโอเบา',
      rounds: 1,
      rest: 0,
      exercises: [
        { name: 'Stationary Bike', th: 'ปั่นจักรยานเบาๆ', sets: '15–20 นาที', tip: 'ระดับยังพูดคุยได้สบาย แล้วยืดเหยียดต่อ', img: 'Bicycling_Stationary' },
      ],
    },
  ],
}

const upperB: Workout = {
  title: 'Upper B',
  focus: 'ไหล่ · หลัง · อกบน · แขน',
  time: '06:30–07:30',
  blocks: [
    {
      label: 'A',
      rounds: 4,
      rest: 90,
      exercises: [
        { name: 'Incline Dumbbell Press', th: 'ดันดัมเบลม้านั่งเอียง', sets: '4 × 8–12', tip: 'ม้านั่งเอียง 30° ลดดัมเบลถึงระดับอก', img: 'Incline_Dumbbell_Press' },
        { name: 'Chest-supported Row', th: 'นอนคว่ำดึงดัมเบล', sets: '4 × 8–12', tip: 'อกพิงม้านั่ง หลังไม่ต้องรับแรง', img: 'Dumbbell_Incline_Row' },
      ],
    },
    {
      label: 'B',
      rounds: 3,
      rest: 90,
      exercises: [
        { name: 'Arnold Press', th: 'อาร์โนลด์เพรส', sets: '3 × 10–12', tip: 'หมุนข้อมือระหว่างดัน ไม่ต้องหนัก', img: 'Arnold_Dumbbell_Press' },
        { name: 'Close-grip Lat Pulldown', th: 'ดึงบาร์ลงมือแคบ', sets: '3 × 10–12', tip: 'ดึงลงหาอก บีบหลัง', img: 'Close-Grip_Front_Lat_Pulldown' },
      ],
    },
    {
      label: 'C',
      rounds: 3,
      rest: 60,
      exercises: [
        { name: 'Face Pull', th: 'ดึงเชือกเข้าหาหน้า', sets: '3 × 12–15', tip: 'ศอกสูง ดึงเชือกแยกออกข้างหู', img: 'Face_Pull' },
        { name: 'Hammer Curl', th: 'ม้วนดัมเบลแบบค้อน', sets: '3 × 12–15', tip: 'ฝ่ามือหันเข้าหากัน', img: 'Hammer_Curls' },
        { name: 'Skull Crusher', th: 'นอนเหยียดหลังแขน', sets: '3 × 12–15', tip: 'ศอกนิ่ง ลดบาร์ลงหาหน้าผากช้าๆ', img: 'EZ-Bar_Skullcrusher' },
      ],
    },
  ],
}

const lowerB: Workout = {
  title: 'Lower B',
  focus: 'ก้น · หลังขา · แกนกลาง (เน้นเดดลิฟต์)',
  time: '06:30–07:30',
  blocks: [
    {
      label: 'A',
      rounds: 4,
      rest: 120,
      exercises: [
        { name: 'Deadlift', th: 'เดดลิฟต์ (หรือ Trap Bar)', sets: '4 × 5–6', tip: 'บาร์ชิดหน้าแข้ง หลังตรงตลอด รู้สึกหลังงอให้หยุด', img: 'Barbell_Deadlift' },
        kneeRaise,
      ],
    },
    {
      label: 'B',
      rounds: 3,
      rest: 90,
      exercises: [
        { name: 'Leg Press', th: 'ถีบเครื่องเลกเพรส', sets: '3 × 10–12', tip: 'เท้ากว้างระดับไหล่ ไม่ล็อกเข่า', img: 'Leg_Press' },
        { name: 'Lying Leg Curl', th: 'นอนคว่ำพับขา', sets: '3 × 10–12', tip: 'ลงช้าๆ สะโพกแนบเบาะ', img: 'Lying_Leg_Curls' },
      ],
    },
    {
      label: 'C',
      rounds: 3,
      rest: 60,
      exercises: [
        { name: 'Dumbbell Step-up', th: 'ก้าวขึ้นกล่อง', sets: '3 × 10/ข้าง', tip: 'เริ่มจากกล่องเตี้ย ดันด้วยส้นเท้าขาบน', img: 'Dumbbell_Step_Ups' },
        calf,
      ],
    },
  ],
}

const flexDay: Workout = {
  title: 'วันยืดหยุ่น',
  focus: 'ชดเชยวันที่ขาด หรือ คาร์ดิโอยาว',
  time: 'เวลาไหนก็ได้',
  note: 'ถ้าเล่นครบทั้งสัปดาห์ เลือกเดินหรือปั่นยาวได้เลย · ถ้าขาด ให้ชดเชยวัน Lower ก่อน',
  blocks: [
    {
      label: 'ตัวเลือก',
      rounds: 1,
      rest: 0,
      exercises: [
        { name: 'Incline Walk / Bike', th: 'เดินชัน หรือ ปั่นจักรยาน', sets: '45–60 นาที', tip: 'ระดับยังพูดคุยได้', img: 'Walking_Treadmill' },
      ],
    },
  ],
}

// ---------- ไทม์ไลน์ ----------

const workdayTimeline = (workout: Workout): TimelineItem[] => [
  { time: '05:30', start: t('05:30'), icon: '💊', title: 'L-Carnitine', detail: 'VX L-Carnitine X500 · 1–2 เม็ด', kind: 'supp' },
  { time: '05:45', start: t('05:45'), icon: '🚶', title: 'เดินเช้า 30 นาที', detail: 'เดินเร็ว จนถึง 06:15', kind: 'walk' },
  { time: '06:30', start: t('06:30'), icon: '🏋️', title: `ยิม · ${workout.title}`, detail: workout.focus, kind: 'workout' },
  { time: '07:30', start: t('07:30'), icon: '🥤', title: 'หลังเวท', kind: 'meal', meal: meals.whey },
  { time: '08:15', start: t('08:15'), icon: '🍳', title: 'มื้อเช้า', detail: 'หิ้วไปกินที่ทำงานได้', kind: 'meal', meal: meals.breakfast },
  { time: '12:30', start: t('12:30'), icon: '🍛', title: 'มื้อเที่ยง', kind: 'meal', meal: meals.lunch },
  { time: '15:30', start: t('15:30'), icon: '🥜', title: 'ว่างบ่าย', kind: 'meal', meal: meals.snack },
  { time: '18:00', start: t('18:00'), icon: '🚶', title: 'เดินเย็น 30 นาที', detail: 'หลังเลิกงาน · เวลาไม่ตายตัว', kind: 'walk' },
  { time: '19:30', start: t('19:30'), icon: '🍗', title: 'มื้อเย็น', kind: 'meal', meal: meals.dinner },
  { time: '21:00', start: t('21:00'), icon: '🥛', title: 'ว่างก่อนนอน', detail: 'กินเมื่อหิวเท่านั้น', kind: 'meal', meal: meals.bedtime, optional: true },
  { time: '22:00', start: t('22:00'), icon: '😴', title: 'เข้านอน', detail: 'นอนให้ได้ 7 ชม.', kind: 'sleep' },
]

const saturdayTimeline: TimelineItem[] = [
  { time: 'เช้า', start: t('08:00'), icon: '🍳', title: 'มื้อเช้า', kind: 'meal', meal: meals.breakfast },
  { time: 'ว่าง', start: t('09:30'), icon: '🏋️', title: 'วันยืดหยุ่น', detail: flexDay.focus, kind: 'workout' },
  { time: 'หลังเล่น', start: t('11:00'), icon: '🥤', title: 'หลังออกกำลัง', kind: 'meal', meal: meals.whey },
  { time: '12:30', start: t('12:30'), icon: '🍛', title: 'มื้อเที่ยง', kind: 'meal', meal: meals.lunch },
  { time: '15:30', start: t('15:30'), icon: '🥜', title: 'ว่างบ่าย', kind: 'meal', meal: meals.snack },
  { time: '19:00', start: t('19:00'), icon: '🍗', title: 'มื้อเย็น', kind: 'meal', meal: meals.dinner },
  { time: '22:00', start: t('22:00'), icon: '😴', title: 'เข้านอน', kind: 'sleep' },
]

const sundayTimeline: TimelineItem[] = [
  { time: 'ทั้งวัน', start: 0, icon: '🛋️', title: 'วันพัก', detail: 'ให้กล้ามเนื้อได้ฟื้นตัว', kind: 'rest' },
  { time: 'เช้า', start: t('08:00'), icon: '🍳', title: 'มื้อเช้า', kind: 'meal', meal: meals.breakfast },
  { time: '12:30', start: t('12:30'), icon: '🍛', title: 'มื้อเที่ยง', kind: 'meal', meal: meals.lunch },
  { time: '17:30', start: t('17:30'), icon: '🚶', title: 'เดินเย็น', detail: 'ถ้าอยากเดิน · 30–60 นาที', kind: 'walk', optional: true },
  {
    time: '19:00',
    start: t('19:00'),
    icon: '🍕',
    title: 'Cheat Meal',
    detail: 'กินที่อยากกินได้ 1 มื้อ ไม่ใช่ทั้งวัน',
    kind: 'meal',
    meal: { menu: 'มื้ออิสระ 1 มื้อ', protein: 0 },
  },
  { time: '22:00', start: t('22:00'), icon: '😴', title: 'เข้านอน', detail: 'พรุ่งนี้ตื่น 05:15', kind: 'sleep' },
]

// index ตาม Date.getDay(): 0 = อาทิตย์
export const week: DayPlan[] = [
  { name: 'วันอาทิตย์', short: 'อา', workout: null, timeline: sundayTimeline },
  { name: 'วันจันทร์', short: 'จ', workout: upperA, timeline: workdayTimeline(upperA) },
  { name: 'วันอังคาร', short: 'อ', workout: lowerA, timeline: workdayTimeline(lowerA) },
  { name: 'วันพุธ', short: 'พ', workout: coreDay, timeline: workdayTimeline(coreDay) },
  { name: 'วันพฤหัสบดี', short: 'พฤ', workout: upperB, timeline: workdayTimeline(upperB) },
  { name: 'วันศุกร์', short: 'ศ', workout: lowerB, timeline: workdayTimeline(lowerB) },
  { name: 'วันเสาร์', short: 'ส', workout: flexDay, timeline: saturdayTimeline },
]

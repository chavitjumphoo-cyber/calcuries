# 🚀 วิธีการรันโปรเจกต์

## ขั้นตอนที่ 1: ติดตั้ง Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
# ติดตั้งแล้วใน root directory
npm install
```

## ขั้นตอนที่ 2: ตั้งค่า Environment Variables

### Backend
สร้างไฟล์ `.env` ใน `backend/`:
```bash
cd backend
cp .env.example .env
```

แก้ไขไฟล์ `backend/.env`:
```
MAXPLUS_API_KEY=ccsk-65bc685581553d9807b73737d17a62a6a0c11c7d044923340a09645e5a220fe2
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
PORT=3001
```

### Frontend
สร้างไฟล์ `.env` ใน root directory:
```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env`:
```
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-supabase-anon-key
```

## ขั้นตอนที่ 3: Setup Supabase

ดูวิธีการตั้งค่าใน `SUPABASE_SETUP.md`

## ขั้นตอนที่ 4: รันโปรเจกต์

### เปิด Terminal 2 หน้าต่าง:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend จะรันที่: http://localhost:3001

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend จะรันที่: http://localhost:3000

## 📱 ใช้งานบน iPhone

1. เปิด Safari ไปที่ `http://your-computer-ip:3000`
2. กด Share icon
3. เลือก "Add to Home Screen"
4. แอปจะปรากฏบนหน้าจอเหมือนแอปจริง!

## 🔧 Troubleshooting

### ถ้า frontend ไม่เชื่อมต่อ backend:
- ตรวจสอบว่า backend รันอยู่
- ตรวจสอบ `VITE_API_URL` ใน `.env`

### ถ้า AI ไม่ทำงาน:
- ตรวจสอบ MaxPlus API key ใน `backend/.env`
- ดู console log ใน terminal backend

### ถ้า database ไม่ทำงาน:
- ตรวจสอบว่าสร้างตารางใน Supabase แล้ว
- ตรวจสอบ `SUPABASE_URL` และ `SUPABASE_KEY`

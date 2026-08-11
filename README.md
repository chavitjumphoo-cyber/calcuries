# Calcuries 🍽️

แอปติดตามการกินอาหารด้วย AI - วิเคราะห์สารอาหารและแคลอรี่จากรูปภาพ

## ✨ Features

- 📸 ถ่ายรูปอาหาร → AI วิเคราะห์อัตโนมัติ
- 🔢 คำนวณแคลอรี่และสารอาหาร (โปรตีน, คาร์โบไฮเดรต, ไขมัน, ไฟเบอร์)
- 📊 Dashboard แสดงสรุปรายวัน/รายสัปดาห์
- 🎯 ตั้งเป้าหมายแคลอรี่
- 📱 PWA - ใช้งานบน iPhone ได้เหมือนแอปจริง

## 🛠️ Tech Stack

**Frontend:**
- React + Vite
- Tailwind CSS
- PWA Support

**Backend:**
- Node.js + Express
- MaxPlus AI (Food Recognition)
- Supabase (Database + Storage)

## 📁 Project Structure

```
Calcuries/
├── frontend/          # React PWA
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Node.js API
│   ├── src/
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## 🔑 Environment Variables

Create `.env` files in both frontend and backend:

**Backend `.env`:**
```
MAXPLUS_API_KEY=your-key-here
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
PORT=3001
```

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-supabase-anon-key
```

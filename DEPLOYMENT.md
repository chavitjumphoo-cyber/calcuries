# Deployment Guide

## 🚀 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (แนะนำ)

1. ไปที่ [vercel.com](https://vercel.com)
2. Login ด้วย GitHub account
3. คลิก "Add New Project"
4. Import repository `chavitjumphoo-cyber/calcuries`
5. ตั้งค่า Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_KEY=your-supabase-anon-key
   ```
6. คลิก Deploy

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

## 🔧 Deploy Backend to Vercel

Backend ยังต้อง deploy แยก:

### สร้าง `backend/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ],
  "env": {
    "MAXPLUS_API_KEY": "@maxplus_api_key",
    "SUPABASE_URL": "@supabase_url",
    "SUPABASE_KEY": "@supabase_key"
  }
}
```

### Deploy Backend:
```bash
cd backend
vercel
```

จดลิงก์ที่ได้ แล้วเอาไปใส่ใน `VITE_API_URL` ของ frontend

## 📱 หลังจาก Deploy

1. เปิด URL ที่ Vercel ให้มา (เช่น `https://calcuries.vercel.app`)
2. บน iPhone Safari: Share → Add to Home Screen
3. แอปพร้อมใช้งาน!

## 🔄 Auto Deploy

ทุกครั้งที่ push ไป GitHub, Vercel จะ auto-deploy ให้อัตโนมัติ

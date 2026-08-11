# Supabase Database Schema

สร้างตารางใน Supabase SQL Editor:

```sql
-- Create meals table
CREATE TABLE meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  portion TEXT,
  calories INTEGER DEFAULT 0,
  protein DECIMAL(10,2) DEFAULT 0,
  carbs DECIMAL(10,2) DEFAULT 0,
  fat DECIMAL(10,2) DEFAULT 0,
  fiber DECIMAL(10,2) DEFAULT 0,
  image_url TEXT,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_meals_created_at ON meals(created_at DESC);

-- Enable Row Level Security (Optional for future)
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for single user)
CREATE POLICY "Allow all operations" ON meals FOR ALL USING (true);
```

## Setup Steps:

1. ไปที่ [supabase.com](https://supabase.com)
2. สร้างโปรเจกต์ใหม่
3. ไปที่ SQL Editor และรันคำสั่งด้านบน
4. คัดลอก **Project URL** และ **anon public key**
5. เพิ่มใน `.env` file:
   - Backend: `SUPABASE_URL` และ `SUPABASE_KEY`
   - Frontend: `VITE_SUPABASE_URL` และ `VITE_SUPABASE_KEY`

## Storage Setup (สำหรับเก็บรูปภาพ):

1. ไปที่ Storage → Create new bucket
2. ตั้งชื่อว่า `meal-images`
3. ตั้งค่า public access ถ้าต้องการ

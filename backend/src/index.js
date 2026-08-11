import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Multer for image uploads
const upload = multer({ storage: multer.memoryStorage() });

// MaxPlus AI configuration
const MAXPLUS_API_KEY = process.env.MAXPLUS_API_KEY;
const MAXPLUS_API_URL = 'https://api.maxplus-ai.cc/v1';

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Analyze food image with MaxPlus AI
app.post('/api/analyze-food', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Convert image to base64
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    // Call MaxPlus AI Vision API
    // Note: Adjust this based on MaxPlus AI's actual API format
    const aiResponse = await axios.post(
      `${MAXPLUS_API_URL}/chat/completions`,
      {
        model: 'gpt-4o', // or appropriate vision model
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this food image and provide: 1) Food name in Thai, 2) Estimated portion size, 3) Calories, 4) Protein (g), 5) Carbs (g), 6) Fat (g), 7) Fiber (g). Return as JSON with keys: name, portion, calories, protein, carbs, fat, fiber'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${MAXPLUS_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Parse AI response
    const aiResult = aiResponse.data.choices[0].message.content;
    let foodData;

    try {
      foodData = JSON.parse(aiResult);
    } catch (e) {
      // If AI doesn't return JSON, create default structure
      foodData = {
        name: 'อาหารไม่ระบุ',
        portion: '1 จาน',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
      };
    }

    res.json({
      success: true,
      data: foodData
    });

  } catch (error) {
    console.error('Error analyzing food:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to analyze food image',
      details: error.response?.data || error.message
    });
  }
});

// Get daily meals
app.get('/api/meals/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

// Save meal
app.post('/api/meals', async (req, res) => {
  try {
    const { name, portion, calories, protein, carbs, fat, fiber, image_url, meal_type } = req.body;

    const { data, error } = await supabase
      .from('meals')
      .insert([
        {
          name,
          portion,
          calories,
          protein,
          carbs,
          fat,
          fiber,
          image_url,
          meal_type,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;

    res.json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Error saving meal:', error);
    res.status(500).json({ error: 'Failed to save meal' });
  }
});

// Get weekly summary
app.get('/api/meals/weekly', async (req, res) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .gte('created_at', weekAgo.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching weekly data:', error);
    res.status(500).json({ error: 'Failed to fetch weekly data' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

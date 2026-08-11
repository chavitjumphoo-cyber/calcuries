import { useState, useRef } from 'react';
import { Camera, X, Loader } from 'lucide-react';

const MAXPLUS_API_URL = 'https://api.maxplus-ai.cc/v1/chat/completions';
const MAXPLUS_API_KEY = 'ccsk-65bc685581553d9807b73737d17a62a6a0c11c7d044923340a09645e5a220fe2';

export default function AddMealModal({ onClose, onAdd }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    portion: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    meal_type: 'lunch'
  });
  const fileInputRef = useRef(null);

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target.result;
      setImagePreview(base64Image);

      // Auto-analyze with AI
      await analyzeImage(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64Image) => {
    setAnalyzing(true);
    try {
      const response = await fetch(MAXPLUS_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MAXPLUS_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'วิเคราะห์รูปอาหารนี้และให้ข้อมูล: 1) ชื่ออาหารภาษาไทย 2) ปริมาณโดยประมาณ 3) แคลอรี่ 4) โปรตีน (g) 5) คาร์โบไฮเดรต (g) 6) ไขมัน (g) 7) ไฟเบอร์ (g). ตอบเป็น JSON format: {"name": "...", "portion": "...", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0}'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: base64Image
                  }
                }
              ]
            }
          ],
          max_tokens: 500
        })
      });

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Try to parse JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const foodData = JSON.parse(jsonMatch[0]);
        setFormData(prev => ({
          ...prev,
          name: foodData.name || '',
          portion: foodData.portion || '',
          calories: foodData.calories || '',
          protein: foodData.protein || '',
          carbs: foodData.carbs || '',
          fat: foodData.fat || '',
          fiber: foodData.fiber || ''
        }));
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('ไม่สามารถวิเคราะห์รูปภาพได้ กรุณากรอกข้อมูลเอง');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      calories: parseInt(formData.calories) || 0,
      protein: parseFloat(formData.protein) || 0,
      carbs: parseFloat(formData.carbs) || 0,
      fat: parseFloat(formData.fat) || 0,
      fiber: parseFloat(formData.fiber) || 0,
      image_url: imagePreview
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FBF9F5] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#FBF9F5] border-b border-[#E7E1D7] px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-serif text-[#1F2421]">
            เพิ่ม<span className="italic text-[#C4612F]">อาหาร</span>
          </h2>
          <button onClick={onClose} className="text-[#5C635D] hover:text-[#1F2421]">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-light text-[#5C635D] mb-2">รูปอาหาร</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-2xl" />
                {analyzing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                    <Loader className="animate-spin text-white" size={32} />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg"
                >
                  <Camera size={20} className="text-[#C4612F]" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-[#E7E1D7] rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[#C4612F] transition-colors"
              >
                <Camera size={32} className="text-[#C4612F]" />
                <span className="text-sm text-[#5C635D] font-light">ถ่ายรูปหรือเลือกจาก Gallery</span>
              </button>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-light text-[#5C635D] mb-2">ชื่ออาหาร</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-full border border-[#E7E1D7] focus:border-[#C4612F] focus:outline-none bg-white font-light"
                placeholder="ข้าวผัด"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-light text-[#5C635D] mb-2">ปริมาณ</label>
              <input
                type="text"
                value={formData.portion}
                onChange={e => setFormData(prev => ({ ...prev, portion: e.target.value }))}
                className="w-full px-4 py-3 rounded-full border border-[#E7E1D7] focus:border-[#C4612F] focus:outline-none bg-white font-light"
                placeholder="1 จาน"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-[#5C635D] mb-2">แคลอรี่</label>
              <input
                type="number"
                value={formData.calories}
                onChange={e => setFormData(prev => ({ ...prev, calories: e.target.value }))}
                className="w-full px-4 py-3 rounded-full border border-[#E7E1D7] focus:border-[#C4612F] focus:outline-none bg-white font-light"
                placeholder="450"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-light text-[#5C635D] mb-2">โปรตีน (g)</label>
              <input
                type="number"
                step="0.1"
                value={formData.protein}
                onChange={e => setFormData(prev => ({ ...prev, protein: e.target.value }))}
                className="w-full px-4 py-3 rounded-full border border-[#E7E1D7] focus:border-[#C4612F] focus:outline-none bg-white font-light"
                placeholder="15"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-[#5C635D] mb-2">คาร์โบไฮเดรต (g)</label>
              <input
                type="number"
                step="0.1"
                value={formData.carbs}
                onChange={e => setFormData(prev => ({ ...prev, carbs: e.target.value }))}
                className="w-full px-4 py-3 rounded-full border border-[#E7E1D7] focus:border-[#C4612F] focus:outline-none bg-white font-light"
                placeholder="60"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-[#5C635D] mb-2">ไขมัน (g)</label>
              <input
                type="number"
                step="0.1"
                value={formData.fat}
                onChange={e => setFormData(prev => ({ ...prev, fat: e.target.value }))}
                className="w-full px-4 py-3 rounded-full border border-[#E7E1D7] focus:border-[#C4612F] focus:outline-none bg-white font-light"
                placeholder="12"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-light text-[#5C635D] mb-2">มื้ออาหาร</label>
              <select
                value={formData.meal_type}
                onChange={e => setFormData(prev => ({ ...prev, meal_type: e.target.value }))}
                className="w-full px-4 py-3 rounded-full border border-[#E7E1D7] focus:border-[#C4612F] focus:outline-none bg-white font-light"
              >
                <option value="breakfast">เช้า</option>
                <option value="lunch">เที่ยง</option>
                <option value="dinner">เย็น</option>
                <option value="snack">ของว่าง</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={analyzing}
            className="w-full bg-[#C4612F] hover:bg-[#A94E22] disabled:bg-[#E7E1D7] text-white rounded-full py-4 font-light text-lg transition-all"
          >
            {analyzing ? 'กำลังวิเคราะห์...' : 'บันทึก'}
          </button>
        </form>
      </div>
    </div>
  );
}

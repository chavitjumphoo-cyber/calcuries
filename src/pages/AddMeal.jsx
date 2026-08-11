import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddMeal() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [foodData, setFoodData] = useState(null)
  const [mealType, setMealType] = useState('lunch')
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleImageCapture = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const analyzeImage = async () => {
    if (!image) return

    setAnalyzing(true)
    const formData = new FormData()
    formData.append('image', image)

    try {
      const response = await fetch('http://localhost:3001/api/analyze-food', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      if (result.success) {
        setFoodData(result.data)
      } else {
        alert('ไม่สามารถวิเคราะห์รูปภาพได้')
      }
    } catch (error) {
      console.error('Error analyzing image:', error)
      alert('เกิดข้อผิดพลาดในการวิเคราะห์')
    } finally {
      setAnalyzing(false)
    }
  }

  const saveMeal = async () => {
    if (!foodData) return

    try {
      const response = await fetch('http://localhost:3001/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...foodData,
          meal_type: mealType,
          image_url: preview
        })
      })

      const result = await response.json()
      if (result.success) {
        navigate('/')
      } else {
        alert('ไม่สามารถบันทึกข้อมูลได้')
      }
    } catch (error) {
      console.error('Error saving meal:', error)
      alert('เกิดข้อผิดพลาดในการบันทึก')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block pill mb-4">เพิ่มอาหาร</div>
        <h1 className="text-4xl font-serif mb-2">
          บันทึก<span className="italic text-terracotta">มื้ออาหาร</span>
        </h1>
      </div>

      {/* Camera/Upload Section */}
      <div className="card mb-6">
        {!preview ? (
          <div className="text-center py-12">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageCapture}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary text-lg"
            >
              📸 ถ่ายรูปอาหาร
            </button>
            <p className="text-sm text-muted mt-4">หรือเลือกรูปจาก Gallery</p>
          </div>
        ) : (
          <div>
            <img
              src={preview}
              alt="Food preview"
              className="w-full rounded-2xl mb-4"
            />
            {!foodData && (
              <button
                onClick={analyzeImage}
                disabled={analyzing}
                className="w-full btn-primary"
              >
                {analyzing ? 'กำลังวิเคราะห์...' : '🤖 วิเคราะห์ด้วย AI'}
              </button>
            )}
            <button
              onClick={() => {
                setPreview(null)
                setImage(null)
                setFoodData(null)
              }}
              className="w-full mt-2 text-muted text-sm"
            >
              ถ่ายใหม่
            </button>
          </div>
        )}
      </div>

      {/* Food Data */}
      {foodData && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-2xl font-serif mb-4">{foodData.name}</h2>
            <p className="text-muted mb-4">{foodData.portion}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-terracotta-tint rounded-2xl">
                <p className="text-3xl font-serif text-terracotta">{foodData.calories}</p>
                <p className="text-sm text-muted">แคลอรี่</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-cream rounded-xl">
                  <p className="font-medium">{foodData.protein}g</p>
                  <p className="text-xs text-muted">โปรตีน</p>
                </div>
                <div className="text-center p-2 bg-cream rounded-xl">
                  <p className="font-medium">{foodData.carbs}g</p>
                  <p className="text-xs text-muted">คาร์โบ</p>
                </div>
                <div className="text-center p-2 bg-cream rounded-xl">
                  <p className="font-medium">{foodData.fat}g</p>
                  <p className="text-xs text-muted">ไขมัน</p>
                </div>
                <div className="text-center p-2 bg-cream rounded-xl">
                  <p className="font-medium">{foodData.fiber}g</p>
                  <p className="text-xs text-muted">ไฟเบอร์</p>
                </div>
              </div>
            </div>

            {/* Meal Type */}
            <div className="mb-4">
              <p className="text-sm text-muted mb-2">ประเภทมื้อ</p>
              <div className="flex gap-2">
                {[
                  { value: 'breakfast', label: 'เช้า' },
                  { value: 'lunch', label: 'กลางวัน' },
                  { value: 'dinner', label: 'เย็น' },
                  { value: 'snack', label: 'ของว่าง' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setMealType(type.value)}
                    className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                      mealType === type.value
                        ? 'bg-terracotta text-white'
                        : 'bg-cream text-muted'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={saveMeal} className="w-full btn-primary">
              บันทึกมื้ออาหาร
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

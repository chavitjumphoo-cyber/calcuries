import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const [meals, setMeals] = useState([])
  const [dailyGoal] = useState(2000) // Default goal
  const [totalCalories, setTotalCalories] = useState(0)

  useEffect(() => {
    fetchTodayMeals()
  }, [])

  const fetchTodayMeals = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/meals/today')
      const result = await response.json()
      if (result.success) {
        setMeals(result.data || [])
        const total = result.data?.reduce((sum, meal) => sum + (meal.calories || 0), 0) || 0
        setTotalCalories(total)
      }
    } catch (error) {
      console.error('Error fetching meals:', error)
      setMeals([])
    }
  }

  const progress = dailyGoal > 0 ? (totalCalories / dailyGoal) * 100 : 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block pill mb-4">วันนี้</div>
        <h1 className="text-4xl font-serif mb-2">
          แคลอรี่<span className="italic text-terracotta">วันนี้</span>
        </h1>
        <p className="text-muted">ติดตามสุขภาพของคุณ</p>
      </div>

      {/* Progress Ring */}
      <div className="card mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-48 h-48">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#E7E1D7"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#C4612F"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-serif font-medium">{totalCalories}</span>
              <span className="text-sm text-muted">/ {dailyGoal} cal</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted mb-1">เหลือ</p>
            <p className="text-xl font-medium">{Math.max(0, dailyGoal - totalCalories)}</p>
          </div>
          <div>
            <p className="text-sm text-muted mb-1">มื้อ</p>
            <p className="text-xl font-medium">{meals.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted mb-1">%</p>
            <p className="text-xl font-medium">{Math.round(progress)}%</p>
          </div>
        </div>
      </div>

      {/* Add Meal Button */}
      <Link to="/add" className="block mb-8">
        <button className="w-full btn-primary text-lg py-4">
          + เพิ่มมื้ออาหาร
        </button>
      </Link>

      {/* Meals List */}
      <div>
        <h2 className="text-2xl font-serif mb-4">
          มื้อที่<span className="italic text-terracotta">กินวันนี้</span>
        </h2>

        {meals.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-muted">ยังไม่มีข้อมูลอาหารวันนี้</p>
            <p className="text-sm text-muted mt-2">เริ่มบันทึกมื้อแรกของคุณ</p>
          </div>
        ) : (
          <div className="space-y-4">
            {meals.map((meal) => (
              <div key={meal.id} className="card flex items-center gap-4">
                {meal.image_url && (
                  <img
                    src={meal.image_url}
                    alt={meal.name}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{meal.name}</h3>
                  <p className="text-sm text-muted">{meal.portion}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-medium text-terracotta">{meal.calories}</p>
                  <p className="text-xs text-muted">cal</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

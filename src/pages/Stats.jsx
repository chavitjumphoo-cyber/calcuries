import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Stats() {
  const [weeklyData, setWeeklyData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWeeklyData()
  }, [])

  const fetchWeeklyData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/meals/weekly')
      const result = await response.json()

      if (result.success) {
        // Group by date
        const grouped = result.data.reduce((acc, meal) => {
          const date = new Date(meal.created_at).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short'
          })

          if (!acc[date]) {
            acc[date] = {
              date,
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0
            }
          }

          acc[date].calories += meal.calories || 0
          acc[date].protein += meal.protein || 0
          acc[date].carbs += meal.carbs || 0
          acc[date].fat += meal.fat || 0

          return acc
        }, {})

        setWeeklyData(Object.values(grouped))
      }
    } catch (error) {
      console.error('Error fetching weekly data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalWeekly = weeklyData.reduce((sum, day) => sum + day.calories, 0)
  const avgDaily = weeklyData.length > 0 ? Math.round(totalWeekly / weeklyData.length) : 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block pill mb-4">สถิติ</div>
        <h1 className="text-4xl font-serif mb-2">
          สรุป<span className="italic text-terracotta">รายสัปดาห์</span>
        </h1>
      </div>

      {loading ? (
        <div className="card text-center py-12">
          <p className="text-muted">กำลังโหลดข้อมูล...</p>
        </div>
      ) : weeklyData.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-muted">ยังไม่มีข้อมูลสถิติ</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card text-center">
              <p className="text-sm text-muted mb-2">เฉลี่ยต่อวัน</p>
              <p className="text-3xl font-serif text-terracotta">{avgDaily}</p>
              <p className="text-xs text-muted">แคลอรี่</p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-muted mb-2">รวมทั้งสัปดาห์</p>
              <p className="text-3xl font-serif text-terracotta">{totalWeekly}</p>
              <p className="text-xs text-muted">แคลอรี่</p>
            </div>
          </div>

          {/* Chart */}
          <div className="card">
            <h2 className="text-xl font-serif mb-4">กราฟแคลอรี่รายวัน</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E1D7" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#5C635D', fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: '#5C635D', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E7E1D7',
                    borderRadius: '12px'
                  }}
                />
                <Bar
                  dataKey="calories"
                  fill="#C4612F"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Nutrition Breakdown */}
          <div className="card">
            <h2 className="text-xl font-serif mb-4">สารอาหารเฉลี่ยต่อวัน</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: 'โปรตีน',
                  value: Math.round(weeklyData.reduce((sum, d) => sum + d.protein, 0) / weeklyData.length),
                  unit: 'g',
                  color: 'bg-blue-100 text-blue-600'
                },
                {
                  label: 'คาร์โบไฮเดรต',
                  value: Math.round(weeklyData.reduce((sum, d) => sum + d.carbs, 0) / weeklyData.length),
                  unit: 'g',
                  color: 'bg-green-100 text-green-600'
                },
                {
                  label: 'ไขมัน',
                  value: Math.round(weeklyData.reduce((sum, d) => sum + d.fat, 0) / weeklyData.length),
                  unit: 'g',
                  color: 'bg-orange-100 text-orange-600'
                }
              ].map((nutrient) => (
                <div key={nutrient.label} className={`p-4 rounded-2xl ${nutrient.color}`}>
                  <p className="text-2xl font-serif mb-1">{nutrient.value}{nutrient.unit}</p>
                  <p className="text-xs">{nutrient.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

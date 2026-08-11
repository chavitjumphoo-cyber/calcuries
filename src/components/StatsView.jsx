export default function StatsView({ meals }) {
  // Calculate weekly stats
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayMeals = meals.filter(m => m.created_at.startsWith(dateStr));
    const dayCalories = dayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
    const dayProtein = dayMeals.reduce((sum, m) => sum + (m.protein || 0), 0);
    const dayCarbs = dayMeals.reduce((sum, m) => sum + (m.carbs || 0), 0);
    const dayFat = dayMeals.reduce((sum, m) => sum + (m.fat || 0), 0);

    last7Days.push({
      date: dateStr,
      dayName: date.toLocaleDateString('th-TH', { weekday: 'short' }),
      calories: dayCalories,
      protein: dayProtein,
      carbs: dayCarbs,
      fat: dayFat
    });
  }

  const maxCalories = Math.max(...last7Days.map(d => d.calories), 1);
  const avgCalories = Math.round(last7Days.reduce((sum, d) => sum + d.calories, 0) / 7);

  // Calculate total macros for the week
  const totalProtein = last7Days.reduce((sum, d) => sum + d.protein, 0);
  const totalCarbs = last7Days.reduce((sum, d) => sum + d.carbs, 0);
  const totalFat = last7Days.reduce((sum, d) => sum + d.fat, 0);
  const totalMacros = totalProtein + totalCarbs + totalFat;

  return (
    <div className="space-y-6 pb-24">
      <h2 className="font-serif text-2xl text-[#1F2421]">
        สถิติ<span className="italic text-[#C4612F]">รายสัปดาห์</span>
      </h2>

      {/* Average Calories */}
      <div className="bg-white rounded-3xl p-6 border border-[#E7E1D7]">
        <p className="text-sm text-[#5C635D] font-light mb-2">แคลอรี่เฉลี่ย/วัน</p>
        <p className="text-4xl font-light text-[#1F2421]">
          {avgCalories} <span className="text-lg text-[#5C635D]">cal</span>
        </p>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white rounded-3xl p-6 border border-[#E7E1D7]">
        <h3 className="font-serif text-lg text-[#1F2421] mb-6">แคลอรี่รายวัน</h3>
        <div className="flex items-end justify-between gap-2 h-48">
          {last7Days.map(day => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col justify-end flex-1">
                <div
                  className="w-full bg-[#C4612F] rounded-t-lg transition-all hover:bg-[#A94E22]"
                  style={{ height: `${(day.calories / maxCalories) * 100}%` }}
                  title={`${day.calories} cal`}
                />
              </div>
              <span className="text-xs text-[#5C635D] font-light">{day.dayName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Macros Breakdown */}
      {totalMacros > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-[#E7E1D7]">
          <h3 className="font-serif text-lg text-[#1F2421] mb-6">สัดส่วนสารอาหาร (7 วัน)</h3>

          {/* Macros Bar */}
          <div className="h-8 rounded-full overflow-hidden flex mb-6">
            {totalProtein > 0 && (
              <div
                className="bg-[#C4612F]"
                style={{ width: `${(totalProtein / totalMacros) * 100}%` }}
              />
            )}
            {totalCarbs > 0 && (
              <div
                className="bg-[#E7E1D7]"
                style={{ width: `${(totalCarbs / totalMacros) * 100}%` }}
              />
            )}
            {totalFat > 0 && (
              <div
                className="bg-[#5C635D]"
                style={{ width: `${(totalFat / totalMacros) * 100}%` }}
              />
            )}
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {totalProtein > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#C4612F]" />
                  <span className="text-sm font-light text-[#5C635D]">โปรตีน</span>
                </div>
                <span className="text-sm text-[#1F2421]">
                  {totalProtein.toFixed(1)}g ({((totalProtein / totalMacros) * 100).toFixed(0)}%)
                </span>
              </div>
            )}
            {totalCarbs > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#E7E1D7]" />
                  <span className="text-sm font-light text-[#5C635D]">คาร์โบไฮเดรต</span>
                </div>
                <span className="text-sm text-[#1F2421]">
                  {totalCarbs.toFixed(1)}g ({((totalCarbs / totalMacros) * 100).toFixed(0)}%)
                </span>
              </div>
            )}
            {totalFat > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#5C635D]" />
                  <span className="text-sm font-light text-[#5C635D]">ไขมัน</span>
                </div>
                <span className="text-sm text-[#1F2421]">
                  {totalFat.toFixed(1)}g ({((totalFat / totalMacros) * 100).toFixed(0)}%)
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Export Data */}
      <button
        onClick={() => {
          const dataStr = JSON.stringify(meals, null, 2);
          const dataBlob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `calcuries-backup-${new Date().toISOString().split('T')[0]}.json`;
          link.click();
          URL.revokeObjectURL(url);
        }}
        className="w-full border-2 border-[#E7E1D7] hover:border-[#C4612F] text-[#5C635D] hover:text-[#C4612F] rounded-full py-3 font-light transition-all"
      >
        Export ข้อมูล (JSON)
      </button>
    </div>
  );
}

import { Trash2 } from 'lucide-react';

const MEAL_TYPE_LABELS = {
  breakfast: 'เช้า',
  lunch: 'เที่ยง',
  dinner: 'เย็น',
  snack: 'ของว่าง'
};

export default function MealList({ meals, onDelete }) {
  if (meals.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-[#E7E1D7]">
        <p className="text-[#5C635D] font-light">ยังไม่มีข้อมูลอาหารวันนี้</p>
        <p className="text-sm text-[#5C635D] font-light mt-2">กดปุ่มด้านบนเพื่อเพิ่มมื้ออาหาร</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg text-[#1F2421] mb-4">มื้ออาหาร<span className="italic text-[#C4612F]">วันนี้</span></h3>
      {meals.map(meal => (
        <div key={meal.id} className="bg-white rounded-2xl p-4 border border-[#E7E1D7] hover:shadow-md transition-shadow">
          <div className="flex gap-4">
            {meal.image_url && (
              <img
                src={meal.image_url}
                alt={meal.name}
                className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block px-3 py-1 bg-[#F2E3D6] text-[#C4612F] text-xs rounded-full font-light mb-2">
                    {MEAL_TYPE_LABELS[meal.meal_type] || meal.meal_type}
                  </span>
                  <h4 className="font-serif text-[#1F2421]">{meal.name}</h4>
                  {meal.portion && (
                    <p className="text-sm text-[#5C635D] font-light">{meal.portion}</p>
                  )}
                </div>
                <button
                  onClick={() => onDelete(meal.id)}
                  className="text-[#5C635D] hover:text-[#C4612F] transition-colors p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <div>
                  <span className="text-[#C4612F] font-medium">{meal.calories}</span>
                  <span className="text-[#5C635D] font-light ml-1">cal</span>
                </div>
                {meal.protein > 0 && (
                  <div>
                    <span className="text-[#5C635D] font-light">โปรตีน </span>
                    <span className="text-[#1F2421]">{meal.protein}g</span>
                  </div>
                )}
                {meal.carbs > 0 && (
                  <div>
                    <span className="text-[#5C635D] font-light">คาร์โบ </span>
                    <span className="text-[#1F2421]">{meal.carbs}g</span>
                  </div>
                )}
                {meal.fat > 0 && (
                  <div>
                    <span className="text-[#5C635D] font-light">ไขมัน </span>
                    <span className="text-[#1F2421]">{meal.fat}g</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Camera, TrendingUp, Calendar, Plus } from 'lucide-react';
import AddMealModal from './components/AddMealModal';
import MealList from './components/MealList';
import StatsView from './components/StatsView';

function App() {
  const [meals, setMeals] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeView, setActiveView] = useState('today'); // today, stats

  // Load meals from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('calcuries_meals');
    if (stored) {
      setMeals(JSON.parse(stored));
    }
  }, []);

  // Save meals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calcuries_meals', JSON.stringify(meals));
  }, [meals]);

  const addMeal = (mealData) => {
    const newMeal = {
      id: Date.now().toString(),
      ...mealData,
      created_at: new Date().toISOString()
    };
    setMeals(prev => [newMeal, ...prev]);
    setShowAddModal(false);
  };

  const deleteMeal = (id) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  };

  // Calculate today's totals
  const today = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(m => m.created_at.startsWith(today));
  const todayCalories = todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const dailyGoal = 2000; // Default goal
  const progress = Math.min((todayCalories / dailyGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FBF9F5]/90 border-b border-[#E7E1D7]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-serif text-[#1F2421]">
            Cal<span className="italic text-[#C4612F]">curies</span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeView === 'today' ? (
          <>
            {/* Progress Ring */}
            <div className="bg-white rounded-3xl p-8 mb-6 shadow-sm border border-[#E7E1D7]">
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48">
                  <svg className="transform -rotate-90 w-48 h-48">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#F2E3D6"
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
                    <span className="text-4xl font-light text-[#1F2421]">{todayCalories}</span>
                    <span className="text-sm text-[#5C635D]">/ {dailyGoal} cal</span>
                  </div>
                </div>
                <p className="mt-4 text-[#5C635D] font-light">วันนี้</p>
              </div>
            </div>

            {/* Add Meal Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full bg-[#C4612F] hover:bg-[#A94E22] text-white rounded-full py-4 px-6 flex items-center justify-center gap-3 mb-6 transition-all hover:shadow-lg"
            >
              <Plus size={24} />
              <span className="font-light text-lg">เพิ่มมื้ออาหาร</span>
            </button>

            {/* Today's Meals */}
            <MealList meals={todayMeals} onDelete={deleteMeal} />
          </>
        ) : (
          <StatsView meals={meals} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E7E1D7] backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-around">
          <button
            onClick={() => setActiveView('today')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-full transition-all ${
              activeView === 'today' ? 'bg-[#F2E3D6] text-[#C4612F]' : 'text-[#5C635D]'
            }`}
          >
            <Calendar size={24} />
            <span className="text-xs font-light">วันนี้</span>
          </button>
          <button
            onClick={() => setActiveView('stats')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-full transition-all ${
              activeView === 'stats' ? 'bg-[#F2E3D6] text-[#C4612F]' : 'text-[#5C635D]'
            }`}
          >
            <TrendingUp size={24} />
            <span className="text-xs font-light">สถิติ</span>
          </button>
        </div>
      </nav>

      {/* Add Meal Modal */}
      {showAddModal && (
        <AddMealModal
          onClose={() => setShowAddModal(false)}
          onAdd={addMeal}
        />
      )}
    </div>
  );
}

export default App;

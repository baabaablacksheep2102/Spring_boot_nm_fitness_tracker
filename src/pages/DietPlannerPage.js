import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { API } from '../services/apiService';
import { Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

const mealTypes = ['breakfast', 'lunch', 'dinner'];

export default function DietPlannerPage() {
  const { user } = useContext(AuthContext);
  const today = new Date().toISOString().split('T')[0];
  
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    type: 'breakfast',
    food: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  useEffect(() => {
    fetchMeals();
  }, [user]);

  const fetchMeals = async () => {
    if (!user) return;
    const result = await API.getMeals(user.userId, today);
    if (result.data) {
      setMeals(result.data);
    }
    setLoading(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'type' ? value : (name === 'food' ? value : parseFloat(value) || 0)
    }));
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.food) {
      setError('Please enter a food item');
      return;
    }

    const result = await API.logMeal(user.userId, {
      ...formData,
      date: today
    });

    if (result.error) {
      setError(result.error);
    } else {
      setMeals([...meals, result.data]);
      setSuccess('Meal added!');
      setFormData({ type: 'breakfast', food: '', calories: 0, protein: 0, carbs: 0, fat: 0 });
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (!window.confirm('Delete this meal?')) return;

    const result = await API.deleteMeal(user.userId, mealId);
    if (!result.error) {
      setMeals(meals.filter(m => m.mealId !== mealId));
    }
  };

  const breakfastMeals = meals.filter(m => m.type === 'breakfast');
  const lunchMeals = meals.filter(m => m.type === 'lunch');
  const dinnerMeals = meals.filter(m => m.type === 'dinner');

  const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + (m.carbs || 0), 0);
  const totalFat = meals.reduce((sum, m) => sum + (m.fat || 0), 0);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading meals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Diet Planner - {new Date(today).toLocaleDateString()}</h1>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 px-4 py-3 rounded mb-6 flex items-start">
          <AlertCircle size={20} className="flex-shrink-0 mr-2 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-600 dark:text-green-300 px-4 py-3 rounded mb-6 flex items-start">
          <CheckCircle size={20} className="flex-shrink-0 mr-2 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Add Meal Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Log New Meal</h2>
        
        <form onSubmit={handleAddMeal} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meal Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {mealTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Food Item</label>
              <input
                type="text"
                name="food"
                value={formData.food}
                onChange={handleFormChange}
                placeholder="e.g., Grilled Chicken with Rice"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Calories</label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleFormChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Protein (g)</label>
              <input
                type="number"
                name="protein"
                value={formData.protein}
                onChange={handleFormChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Carbs (g)</label>
              <input
                type="number"
                name="carbs"
                value={formData.carbs}
                onChange={handleFormChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fat (g)</label>
              <input
                type="number"
                name="fat"
                value={formData.fat}
                onChange={handleFormChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center space-x-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            <Plus size={20} />
            <span>Add Meal</span>
          </button>
        </form>
      </div>

      {/* Macronutrient Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Total Calories</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{totalCalories}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Protein</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{totalProtein}g</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Carbs</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalCarbs}g</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Fat</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{totalFat}g</p>
        </div>
      </div>

      {/* Meals by Type */}
      {[
        { title: 'Breakfast', meals: breakfastMeals },
        { title: 'Lunch', meals: lunchMeals },
        { title: 'Dinner', meals: dinnerMeals }
      ].map((section, idx) => (
        <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h2>
          
          {section.meals.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No meals logged</p>
          ) : (
            <div className="space-y-2">
              {section.meals.map(meal => (
                <div key={meal.mealId} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{meal.food}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {meal.calories} kcal | P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteMeal(meal.mealId)}
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 p-2 rounded"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

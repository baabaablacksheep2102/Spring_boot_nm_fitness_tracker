import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { API } from '../services/apiService';
import { Target, Plus, Calendar, TrendingUp, CheckCircle, Trash2 } from 'lucide-react';

export default function GoalsPage() {
  const { user } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: 'WEIGHT',
    title: '',
    description: '',
    targetValue: '',
    targetDate: ''
  });

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;
    setLoading(true);
    const response = await API.getGoals(user.userId);
    if (response.status === 200) {
      setGoals(response.data);
    }
    setLoading(false);
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    const response = await API.createGoal(user.userId, newGoal);
    if (response.status === 201) {
      setGoals([...goals, response.data]);
      setShowCreateModal(false);
      setNewGoal({ type: 'WEIGHT', title: '', description: '', targetValue: '', targetDate: '' });
    }
  };

  const handleDeleteGoal = async (goalId) => {
    const response = await API.deleteGoal(user.userId, goalId);
    if (response.status === 200) {
      setGoals(goals.filter(g => g.goalId !== goalId));
    }
  };

  const getProgressPercentage = (goal) => {
    if (goal.type === 'WEIGHT') {
      const user = { weight: 75 }; // Mock current weight
      const progress = Math.abs(user.weight - goal.targetValue) / Math.abs(goal.currentValue - goal.targetValue);
      return Math.min(progress * 100, 100);
    }
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getGoalTypeLabel = (type) => {
    const labels = {
      'WEIGHT': 'Weight Goal',
      'CALORIES_BURN': 'Calories Burn',
      'CALORIES_INTAKE': 'Calories Intake',
      'WORKOUT_FREQUENCY': 'Workout Frequency',
      'DISTANCE': 'Distance Goal'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Goals</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your fitness objectives and progress</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          New Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <Target className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No goals yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Set your first fitness goal to start tracking progress</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = getProgressPercentage(goal);
            const isCompleted = progress >= 100;
            
            return (
              <div key={goal.goalId} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle className="text-green-500" size={24} />
                    ) : (
                      <Target className="text-blue-500" size={24} />
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {getGoalTypeLabel(goal.type)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.goalId)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{goal.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{goal.description}</p>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Calendar size={16} />
                    <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                    <TrendingUp size={16} />
                    <span>{goal.currentValue} / {goal.targetValue}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Goal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Goal</h2>
            
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Goal Type
                </label>
                <select
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="WEIGHT">Weight Goal</option>
                  <option value="CALORIES_BURN">Calories Burn</option>
                  <option value="CALORIES_INTAKE">Calories Intake</option>
                  <option value="WORKOUT_FREQUENCY">Workout Frequency</option>
                  <option value="DISTANCE">Distance Goal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Lose 5kg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Optional description"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Value
                </label>
                <input
                  type="number"
                  value={newGoal.targetValue}
                  onChange={(e) => setNewGoal({ ...newGoal, targetValue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 70"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
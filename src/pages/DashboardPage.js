import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { API } from '../services/apiService';
import { TrendingUp, Flame, Footprints, Zap } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);

      const [statsRes, trendsRes] = await Promise.all([
        API.getDashboardStats(user.userId),
        API.getWeeklyTrends(user.userId)
      ]);

      setStats(statsRes.data);
      setTrends(trendsRes.data);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Hello, {user?.fullName}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Steps</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.steps || 0}</p>
            </div>
            <Footprints className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Calories In</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{stats?.caloriesIn || 0}</p>
            </div>
            <Zap className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Calories Out</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">{stats?.caloriesOut || 0}</p>
            </div>
            <Flame className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Net Calories</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{stats?.netCalories || 0}</p>
            </div>
            <TrendingUp className="text-red-600" size={32} />
          </div>
        </div>
      </div>

      {/* Weekly Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Weekly Trends</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Date</th>
                <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Calories In</th>
                <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Calories Out</th>
                <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Steps</th>
              </tr>
            </thead>
            <tbody>
              {trends?.map((day, idx) => (
                <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{new Date(day.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right text-green-600 dark:text-green-400 font-medium">{day.caloriesIn}</td>
                  <td className="py-3 px-4 text-right text-orange-600 dark:text-orange-400 font-medium">{day.caloriesOut}</td>
                  <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400 font-medium">{Math.floor(day.steps)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

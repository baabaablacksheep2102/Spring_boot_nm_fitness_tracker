import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { API } from '../services/apiService';
import { Zap, Droplet, Thermometer, Activity, ArrowLeft, Trash2 } from 'lucide-react';

export default function WorkoutSummaryPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!user) return;
      const result = await API.getWorkoutById(user.userId, id);
      if (result.data) {
        setWorkout(result.data);
      }
      setLoading(false);
    };

    fetchWorkout();
  }, [user, id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;

    setDeleting(true);
    await API.deleteWorkout(user.userId, workout.workoutId);
    navigate('/workout/upload');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading workout...</p>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 px-4 py-3 rounded">
          Workout not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate('/workout/upload')}
        className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Upload</span>
      </button>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Workout Summary</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Date</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {new Date(workout.date).toLocaleDateString()}
              </p>
            </div>
            <Activity className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Location</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{workout.location}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Distance</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{workout.distance.toFixed(2)} km</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Calories Burned</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2">{workout.calories} kcal</p>
            </div>
            <Zap className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Avg Heart Rate</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">{workout.avgHeartRate} bpm</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Temperature</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{workout.weatherContext.temp}°C</p>
            </div>
            <Thermometer className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Humidity</p>
              <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-2">{workout.weatherContext.humidity}%</p>
            </div>
            <Droplet className="text-cyan-600" size={32} />
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/workout/upload')}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
        >
          Upload Another Workout
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          <Trash2 size={20} />
          <span>{deleting ? 'Deleting...' : 'Delete'}</span>
        </button>
      </div>
    </div>
  );
}

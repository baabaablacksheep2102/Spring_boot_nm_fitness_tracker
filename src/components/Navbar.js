import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { LogOut, User, Home, Utensils, Activity, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            💪 Smart Coach
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600">
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
            <Link to="/workout/upload" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600">
              <Activity size={20} />
              <span>Workouts</span>
            </Link>
            <Link to="/diet-planner" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600">
              <Utensils size={20} />
              <span>Diet</span>
            </Link>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link to="/profile" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <User size={20} />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

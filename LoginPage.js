import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { API } from '../services/apiService';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await API.authLogin(email, password);

    if (result.error) {
      setError(result.error);
    } else {
      login(result.user, result.token);
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-8">Smart Coach</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Login</h2>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 px-4 py-3 rounded mb-4 flex items-start">
            <AlertCircle size={20} className="flex-shrink-0 mr-2 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
          Don't have an account? <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Sign up</Link>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg text-sm text-blue-700 dark:text-blue-300">
          <strong>Demo Credentials:</strong><br />
          Email: john@example.com<br />
          Password: password123
        </div>
      </div>
    </div>
  );
}

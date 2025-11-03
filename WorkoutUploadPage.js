import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { API } from '../services/apiService';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

export default function WorkoutUploadPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError('');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!date || !location) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    const result = await API.uploadWorkout(user.userId, file, { date, location });

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Workout processed successfully!');
      setTimeout(() => {
        navigate(`/workout/summary/${result.data.workoutId}`);
      }, 1000);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Upload Workout Report</h1>

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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Dropzone */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Upload Report (PDF/Screenshot)</label>
          
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-600 transition cursor-pointer bg-gray-50 dark:bg-gray-700"
          >
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.gif"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
              required
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              <Upload className="mx-auto mb-4 text-gray-400" size={32} />
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                {file ? file.name : 'Drag and drop your file here, or click to select'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Supported: PDF, PNG, JPG, GIF</p>
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Workout Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Central Park, NYC"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Processing (OCR Simulation)...</span>
            </>
          ) : (
            <>
              <Upload size={20} />
              <span>Upload & Process</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

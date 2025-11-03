import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { API } from '../services/apiService';
import { User, Upload, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', height: '', weight: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const result = await API.getUserProfile(user.userId);
      if (result.data) {
        setProfile(result.data);
        setFormData({
          fullName: result.data.fullName,
          height: result.data.height,
          weight: result.data.weight
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const result = await API.updateUserProfile(user.userId, formData);
    if (result.error) {
      setError(result.error);
    } else {
      setProfile(result.data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }
    setSaving(false);
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setSaving(true);

    const result = await API.uploadProfilePicture(user.userId, file);
    if (result.error) {
      setError(result.error);
    } else {
      setProfile(prev => ({ ...prev, profilePictureUrl: result.data.profilePictureUrl }));
      setSuccess('Profile picture updated!');
      setTimeout(() => setSuccess(''), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Profile Settings</h1>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 px-4 py-3 rounded mb-6 flex items-start">
          <AlertCircle size={20} className="flex-shrink-0 mr-2 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-600 dark:text-green-300 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Picture</h2>
        
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4 overflow-hidden">
            {profile?.profilePictureUrl ? (
              <img src={profile.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={64} className="text-gray-400" />
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={saving}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg"
          >
            <Upload size={18} />
            <span>{saving ? 'Uploading...' : 'Upload Picture'}</span>
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
        
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email (Read-only)</label>
            <input
              type="email"
              value={profile?.email || ''}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white bg-gray-50 dark:bg-gray-600 cursor-not-allowed"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth (Read-only)</label>
            <input
              type="date"
              value={profile?.dateOfBirth || ''}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white bg-gray-50 dark:bg-gray-600 cursor-not-allowed"
              disabled
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 m-4">
      <div className="flex items-start">
        <AlertCircle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mr-3" size={24} />
        <div>
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">Medical Disclaimer</h3>
          <p className="text-yellow-700 dark:text-yellow-400 mt-1 text-sm">
            Smart Coach is NOT a medical device. It is designed for general fitness tracking and wellness purposes only.
            Always consult with a healthcare professional before starting any new exercise or diet program.
            Do not rely on this application for medical advice, diagnosis, or treatment of any medical condition.
          </p>
        </div>
      </div>
    </div>
  );
}

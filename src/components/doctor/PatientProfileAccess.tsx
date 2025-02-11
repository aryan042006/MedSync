import React, { useState } from 'react';
import { toast } from 'react-toastify';
import DirectPatientDashboard from '../patient/DirectPatientDashboard';

interface PatientData {
  name: string;
  age: number;
  medicalHistory: string;
  // Add other patient fields as needed
}

const PatientProfileAccess: React.FC = () => {
  const [patientId, setPatientId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check for specific credentials
    if (patientId === 'john@example.com' && password === 'password123') {
      toast.success('Access granted!');
      setShowDashboard(true);
    } else {
      setError('Invalid credentials. Please try again.');
      toast.error('Invalid credentials');
    }
  };

  if (showDashboard) {
    return <DirectPatientDashboard />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Patient Profile Access</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="patientId"
            type="email"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter your password"
          />
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Access Profile
        </button>
      </form>
    </div>
  );
};

export default PatientProfileAccess;

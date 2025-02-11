import React, { useState } from 'react';
import PatientDashboard from '../patient/PatientDashboard';
import PatientProfileAccessForm from '../auth/PatientProfileAccessForm';

const PatientProfileAccess: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleLoginSuccess = () => {
    setShowDashboard(true);
  };

  if (showDashboard) {
    return <PatientDashboard />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Patient Profile Access</h2>
      <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <PatientProfileAccessForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};

export default PatientProfileAccess;

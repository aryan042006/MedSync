import React, { useState } from 'react';
import { FaHeartbeat, FaWalking, FaBed, FaFire, FaLink } from 'react-icons/fa';
import { GiHealthNormal } from 'react-icons/gi';
import { Menu, X } from 'lucide-react';
import ContactForm from '../contact/ContactForm';

const DirectPatientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('health-records');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'health-records', label: 'Health Records' },
    { id: 'location', label: 'Location & Air Quality' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'reports', label: 'Medical Reports' },
    { id: 'upload', label: 'Upload Reports' },
    { id: 'device-connection', label: 'Device Connection' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const mockPatientData = {
    name: "John Doe",
    age: 35,
    healthMetrics: {
      heartRate: "72 bpm",
      steps: "8,500",
      sleep: "7.5 hrs",
      calories: "2,100 kcal"
    },
    appointments: [
      { id: 1, doctor: "Dr. Smith", date: "2025-02-15", time: "10:00 AM" },
      { id: 2, doctor: "Dr. Johnson", date: "2025-02-20", time: "2:30 PM" }
    ],
    reports: [
      { id: 1, name: "Blood Test", date: "2025-01-15", status: "Completed" },
      { id: 2, name: "X-Ray", date: "2025-01-20", status: "Pending" }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden p-4 flex justify-between items-center bg-white shadow">
        <h1 className="text-xl font-bold text-gray-800">Patient Dashboard</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className={`
          lg:w-64 bg-white shadow-lg
          ${isMobileMenuOpen ? 'block' : 'hidden'}
          lg:block lg:min-h-screen
        `}>
          <div className="p-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">{mockPatientData.name}</h2>
              <p className="text-gray-600">Age: {mockPatientData.age}</p>
            </div>
            <nav>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    w-full text-left px-4 py-2 rounded-md mb-2
                    ${activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'health-records' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center mb-2">
                  <FaHeartbeat className="text-red-500 mr-2" size={20} />
                  <h3 className="font-semibold">Heart Rate</h3>
                </div>
                <p className="text-2xl font-bold">{mockPatientData.healthMetrics.heartRate}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center mb-2">
                  <FaWalking className="text-green-500 mr-2" size={20} />
                  <h3 className="font-semibold">Steps</h3>
                </div>
                <p className="text-2xl font-bold">{mockPatientData.healthMetrics.steps}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center mb-2">
                  <FaBed className="text-blue-500 mr-2" size={20} />
                  <h3 className="font-semibold">Sleep</h3>
                </div>
                <p className="text-2xl font-bold">{mockPatientData.healthMetrics.sleep}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center mb-2">
                  <FaFire className="text-orange-500 mr-2" size={20} />
                  <h3 className="font-semibold">Calories</h3>
                </div>
                <p className="text-2xl font-bold">{mockPatientData.healthMetrics.calories}</p>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Upcoming Appointments</h3>
              <div className="space-y-4">
                {mockPatientData.appointments.map(appointment => (
                  <div key={appointment.id} className="border-b pb-4">
                    <p className="font-semibold">{appointment.doctor}</p>
                    <p className="text-gray-600">Date: {appointment.date}</p>
                    <p className="text-gray-600">Time: {appointment.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Medical Reports</h3>
              <div className="space-y-4">
                {mockPatientData.reports.map(report => (
                  <div key={report.id} className="border-b pb-4">
                    <p className="font-semibold">{report.name}</p>
                    <p className="text-gray-600">Date: {report.date}</p>
                    <p className={`${
                      report.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      Status: {report.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="bg-white rounded-lg shadow p-6">
              <ContactForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectPatientDashboard;

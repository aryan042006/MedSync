import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentPatient, mockLogout } from '../../services/mockAuthService';
import { dummyAirQualityData, dummyDoctors } from '../../data/dummyPatientData';
import { FaHeartbeat, FaWalking, FaBed, FaFire, FaLink } from 'react-icons/fa';
import { GiHealthNormal } from 'react-icons/gi';
import { Menu, X } from 'lucide-react';
import ContactForm from '../contact/ContactForm';

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('health-records');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [patient, setPatient] = useState(getCurrentPatient());
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

  useEffect(() => {
    const checkAuth = () => {
      const currentPatient = getCurrentPatient();
      if (!currentPatient) {
        navigate('/login');
      } else {
        setPatient(currentPatient);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await mockLogout();
    navigate('/login');
  };

  if (!patient) {
    return null;
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Report uploaded successfully!');
    }
  };

  const handleAppointmentBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Appointment booked successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-0">Welcome, {patient.name}</h1>
          {/* Show patient ID and logout only on desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <p className="text-sm md:text-base text-gray-600">Patient ID: {patient.id}</p>
            <button
              onClick={handleLogout}
              className="px-3 py-1 md:px-4 md:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu Button - Moved to right */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center px-3 py-2 rounded-lg bg-white shadow-sm"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex flex-col space-y-4">
              <p className="text-sm text-gray-600 border-b pb-2">Patient ID: {patient.id}</p>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-4 py-2 rounded mb-2 ${
                activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} mb-4`}>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full px-4 py-3 text-left ${
                  activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                } border-b border-gray-100 last:border-b-0`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'health-records' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Health Records</h2>
              <div className="space-y-4">
                {patient.healthRecords.map((record) => (
                  <div key={record.id} className="border p-4 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Date: {record.date}</p>
                        <p>Diagnosis: {record.diagnosis}</p>
                        <p>Prescription: {record.prescription}</p>
                        <p>Doctor: {record.doctor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-600">{record.hospital}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {patient.healthRecords.length === 0 && (
                  <p className="text-gray-500">No health records found.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Location & Air Quality</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border p-4 rounded">
                  <h3 className="text-lg font-semibold mb-3">Your Address</h3>
                  <p>{patient.address.street}</p>
                  <p>{patient.address.city}, {patient.address.state}</p>
                  <p>PIN: {patient.address.pincode}</p>
                </div>
                <div className="border p-4 rounded">
                  <h3 className="text-lg font-semibold mb-3">Air Quality Information</h3>
                  <p className="font-semibold">Air Quality Index: {dummyAirQualityData.aqi}</p>
                  <p>Main Pollutant: {dummyAirQualityData.mainPollutant}</p>
                  <p>Quality: {dummyAirQualityData.quality}</p>
                  <p className="mt-2">Location: {dummyAirQualityData.location.city}, {dummyAirQualityData.location.state}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Appointments</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Book New Appointment</h3>
                  <form onSubmit={handleAppointmentBooking} className="space-y-4">
                    <div>
                      <label className="block mb-2">Select Doctor</label>
                      <select name="doctorId" className="w-full p-2 border rounded">
                        <option value="">Select a doctor</option>
                        {dummyDoctors.map(doctor => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialization} ({doctor.hospital})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2">Date</label>
                      <input
                        type="date"
                        name="date"
                        className="w-full p-2 border rounded"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Time</label>
                      <input
                        type="time"
                        name="time"
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Book Appointment
                    </button>
                  </form>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Appointment History</h3>
                  <div className="space-y-4">
                    {patient.appointments.map((appointment) => (
                      <div key={appointment.id} className="border p-4 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{appointment.type}</p>
                            <p>Doctor: {appointment.doctorName}</p>
                            <p>Date: {appointment.date}</p>
                            <p>Time: {appointment.time}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-blue-600">{appointment.hospitalName}</p>
                            <p className={`mt-2 inline-block px-2 py-1 rounded text-sm ${
                              appointment.status === 'Completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {appointment.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {patient.appointments.length === 0 && (
                      <p className="text-gray-500">No appointment history.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Medical Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patient.medicalReports.map((report) => (
                  <div key={report.id} className="border p-4 rounded hover:shadow-lg transition-shadow">
                    <div className="flex flex-col h-full">
                      <div>
                        <h3 className="font-semibold text-lg">{report.name}</h3>
                        <p className="text-sm text-gray-600">{report.date}</p>
                        <p className="text-blue-600">{report.hospital}</p>
                        <p className="text-sm text-gray-700 mt-2">{report.description}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-sm">
                          {report.type}
                        </span>
                        <button 
                          className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          onClick={() => window.open(report.url, '_blank')}
                        >
                          View Report
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {patient.medicalReports.length === 0 && (
                  <p className="text-gray-500 col-span-3">No medical reports available.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Upload Medical Reports</h2>
              <div className="space-y-4">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600">
                    Selected file: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'device-connection' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Connect Your Device for Real-Time Health Monitoring</h2>
              <p className="text-gray-600 mb-6">
                Connect your smartphone or smartwatch to automatically sync your health data with our platform.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center mb-3">
                    <GiHealthNormal className="text-blue-500 text-2xl mr-2" />
                    <h3 className="text-lg font-semibold">Blood Pressure</h3>
                  </div>
                  <p className="text-gray-600">Monitor your daily readings and track trends over time.</p>
                </div>

                <div className="border rounded-lg p-4 bg-red-50">
                  <div className="flex items-center mb-3">
                    <FaHeartbeat className="text-red-500 text-2xl mr-2" />
                    <h3 className="text-lg font-semibold">Heart Rate</h3>
                  </div>
                  <p className="text-gray-600">Keep track of your heart beats per minute and overall heart health.</p>
                </div>

                <div className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-center mb-3">
                    <FaWalking className="text-green-500 text-2xl mr-2" />
                    <h3 className="text-lg font-semibold">Step Count</h3>
                  </div>
                  <p className="text-gray-600">View your daily steps and activity levels to stay on top of your fitness goals.</p>
                </div>

                <div className="border rounded-lg p-4 bg-purple-50">
                  <div className="flex items-center mb-3">
                    <FaBed className="text-purple-500 text-2xl mr-2" />
                    <h3 className="text-lg font-semibold">Sleep Data</h3>
                  </div>
                  <p className="text-gray-600">Track your sleep patterns for better rest and recovery.</p>
                </div>

                <div className="border rounded-lg p-4 bg-orange-50">
                  <div className="flex items-center mb-3">
                    <FaFire className="text-orange-500 text-2xl mr-2" />
                    <h3 className="text-lg font-semibold">Calorie Burn</h3>
                  </div>
                  <p className="text-gray-600">See how many calories you burn throughout the day.</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Device Connection</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaLink className="text-blue-500 h-6 w-6 mr-2" />
                    <div>
                      <p className="font-medium">Connect Your Health Devices</p>
                      <p className="text-sm text-gray-600">Link your health monitoring devices for real-time data</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    Connect Device
                  </button>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => alert('Device connection feature coming soon!')}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  <FaLink className="mr-2" />
                  Connect Your Device Now
                </button>
              </div>
            </div>
          )}
          {activeTab === 'contact' && (
            <ContactForm userType="patient" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;

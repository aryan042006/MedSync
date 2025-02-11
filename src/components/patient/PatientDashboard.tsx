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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">Welcome, {patient.name}</h1>
          {/* Show patient ID and logout on desktop */}
          <div className="hidden sm:flex items-center space-x-4">
            <p className="text-sm sm:text-base text-gray-600">Patient ID: {patient.id}</p>
            <button
              onClick={handleLogout}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden flex justify-end mb-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center p-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
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
          <div className="sm:hidden bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex flex-col space-y-3">
              <p className="text-sm text-gray-600 border-b pb-2">Patient ID: {patient.id}</p>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    activeTab === tab.id 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Desktop Tabs */}
        <div className="hidden sm:flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-4 py-2 rounded text-sm sm:text-base transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          {activeTab === 'health-records' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Health Records</h2>
              <div className="space-y-4">
                {patient.healthRecords.map((record) => (
                  <div key={record.id} className="border p-3 sm:p-4 rounded">
                    <div className="flex flex-col sm:flex-row justify-between gap-2">
                      <div className="space-y-1">
                        <p className="font-semibold text-sm sm:text-base">Date: {record.date}</p>
                        <p className="text-sm sm:text-base">Diagnosis: {record.diagnosis}</p>
                        <p className="text-sm sm:text-base">Prescription: {record.prescription}</p>
                        <p className="text-sm sm:text-base">Doctor: {record.doctor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-600 text-sm sm:text-base">{record.hospital}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {patient.healthRecords.length === 0 && (
                  <p className="text-gray-500 text-sm sm:text-base">No health records found.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Location & Air Quality</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="border p-3 sm:p-4 rounded">
                  <h3 className="text-base sm:text-lg font-semibold mb-3">Your Address</h3>
                  <div className="space-y-1 text-sm sm:text-base">
                    <p>{patient.address.street}</p>
                    <p>{patient.address.city}, {patient.address.state}</p>
                    <p>PIN: {patient.address.pincode}</p>
                  </div>
                </div>
                <div className="border p-3 sm:p-4 rounded">
                  <h3 className="text-base sm:text-lg font-semibold mb-3">Air Quality Information</h3>
                  <div className="space-y-1 text-sm sm:text-base">
                    <p className="font-semibold">Air Quality Index: {dummyAirQualityData.aqi}</p>
                    <p>Main Pollutant: {dummyAirQualityData.mainPollutant}</p>
                    <p>Quality: {dummyAirQualityData.quality}</p>
                    <p className="mt-2">Location: {dummyAirQualityData.location.city}, {dummyAirQualityData.location.state}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Appointments</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Book New Appointment</h3>
                  <form onSubmit={handleAppointmentBooking} className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm sm:text-base">Select Doctor</label>
                      <select 
                        name="doctorId" 
                        className="w-full p-2 border rounded text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a doctor</option>
                        {dummyDoctors.map(doctor => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialization} ({doctor.hospital})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm sm:text-base">Date</label>
                      <input
                        type="date"
                        name="date"
                        className="w-full p-2 border rounded text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm sm:text-base">Time</label>
                      <input
                        type="time"
                        name="time"
                        className="w-full p-2 border rounded text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Book Appointment
                    </button>
                  </form>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Appointment History</h3>
                  <div className="space-y-4">
                    {patient.appointments.map((appointment) => (
                      <div key={appointment.id} className="border p-3 sm:p-4 rounded">
                        <div className="flex flex-col sm:flex-row justify-between gap-2">
                          <div className="space-y-1">
                            <p className="font-semibold text-sm sm:text-base">
                              Date: {appointment.date}
                            </p>
                            <p className="text-sm sm:text-base">Time: {appointment.time}</p>
                            <p className="text-sm sm:text-base">
                              Doctor: {appointment.doctorName}
                            </p>
                            <p className="text-sm sm:text-base">
                              Status: <span className={`${
                                appointment.status === 'Completed' 
                                  ? 'text-green-600' 
                                  : appointment.status === 'Cancelled' 
                                  ? 'text-red-600' 
                                  : 'text-yellow-600'
                              }`}>{appointment.status}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-blue-600 text-sm sm:text-base">
                              {appointment.hospital}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {patient.appointments.length === 0 && (
                      <p className="text-gray-500 text-sm sm:text-base">No appointments found.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Medical Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patient.medicalReports.map((report) => (
                  <div key={report.id} className="border p-4 rounded-lg hover:shadow-lg transition-shadow">
                    <div className="flex flex-col h-full">
                      <div>
                        <h3 className="font-semibold">{report.name}</h3>
                        <p className="text-sm text-gray-600">Date: {report.date}</p>
                        <p className="text-sm text-gray-600">Hospital: {report.hospital}</p>
                        <p className="text-sm text-gray-600 mt-2">{report.description}</p>
                      </div>
                      <div className="mt-4">
                        <a
                          href={report.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Report
                        </a>
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
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Upload Medical Reports</h2>
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
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Connect Your Device for Real-Time Health Monitoring</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Connect your smartphone or smartwatch to automatically sync your health data with our platform.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <FaHeartbeat className="text-red-500 text-xl sm:text-2xl" />
                    <h3 className="text-base sm:text-lg font-semibold">Heart Rate</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600">Monitor your heart rate in real-time</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <FaWalking className="text-blue-500 text-xl sm:text-2xl" />
                    <h3 className="text-base sm:text-lg font-semibold">Step Count</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600">Track your daily steps and activity</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <FaBed className="text-indigo-500 text-xl sm:text-2xl" />
                    <h3 className="text-base sm:text-lg font-semibold">Sleep Pattern</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600">Analyze your sleep quality</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <FaFire className="text-orange-500 text-xl sm:text-2xl" />
                    <h3 className="text-base sm:text-lg font-semibold">Calories</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600">Monitor calorie burn rate</p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Connect Your Device</h3>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <FaLink className="text-lg" />
                    <span>Connect Device</span>
                  </button>
                  <p className="text-sm sm:text-base text-gray-500">
                    Compatible with most modern smartphones and smartwatches
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Contact Us</h2>
              <ContactForm userType="patient" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;

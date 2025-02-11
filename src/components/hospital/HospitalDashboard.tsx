import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Activity, 
  FileText, 
  Settings, 
  Bell,
  Search,
  Plus,
  Upload,
  ArrowRight,
  X,
  Check,
  Filter,
  ClipboardList,
  Download,
  Trash2,
  ArrowLeft,
  LogOut,
  FileX,
  UserPlus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Patient, mockPatients, MedicalReport, mockDoctors } from '../../data/mockPatients';
import MedicalReportModal from '../patient/MedicalReportModal';
import ContactForm from '../contact/ContactForm';
import PatientProfileAccess from '../doctor/PatientProfileAccess';

interface DashboardCard {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
}

interface UploadReportFormData {
  patientId: string;
  type: string;
  description: string;
  doctor: string;
  hospital: string;
  findings: string;
  recommendations: string;
  file?: File;
}

const reportTypes = [
  'Blood Test',
  'X-Ray',
  'MRI',
  'CT Scan',
  'Ultrasound',
  'ECG',
  'Pathology',
  'Dental',
  'Eye Test',
  'Other'
];

const tabs = [
  { id: 'patients', label: 'Patients' },
  { id: 'reports', label: 'Medical Reports' },
  { id: 'profile-access', label: 'Patient Profile Access' },
  { id: 'settings', label: 'Settings' },
  { id: 'contact', label: 'Contact Us' },
];

export default function HospitalDashboard() {
  const [activeTab, setActiveTab] = useState('patients');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportsListOpen, setIsReportsListOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<MedicalReport | null>(null);
  const [uploadFormData, setUploadFormData] = useState<UploadReportFormData>({
    patientId: '',
    type: '',
    description: '',
    doctor: '',
    hospital: '',
    findings: '',
    recommendations: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showDeletePatientConfirm, setShowDeletePatientConfirm] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [newPatientData, setNewPatientData] = useState({
    name: '',
    age: '',
    gender: '',
    bloodGroup: '',
    contactNumber: '',
    email: '',
    address: '',
    medicalHistory: [''],
  });
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = mockPatients.filter(patient =>
        patient.name.toLowerCase().includes(query.toLowerCase()) ||
        patient.email.toLowerCase().includes(query.toLowerCase()) ||
        patient.contactNumber.includes(query)
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(mockPatients);
    }
  };

  const handleViewReports = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsReportsModalOpen(true);
  };

  const handleDeleteReport = (report: MedicalReport) => {
    setReportToDelete(report);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteReport = () => {
    if (reportToDelete && selectedPatient) {
      const updatedPatient = {
        ...selectedPatient,
        medicalReports: selectedPatient.medicalReports.filter(r => r.id !== reportToDelete.id)
      };
      
      const updatedPatients = filteredPatients.map(p => 
        p.id === selectedPatient.id ? updatedPatient : p
      );
      
      setSelectedPatient(updatedPatient);
      setFilteredPatients(updatedPatients);
      setShowDeleteConfirm(false);
      setReportToDelete(null);
    }
  };

  const handleDeletePatient = (patient: Patient) => {
    setPatientToDelete(patient);
    setShowDeletePatientConfirm(true);
  };

  const confirmDeletePatient = () => {
    if (patientToDelete) {
      const updatedPatients = filteredPatients.filter(p => p.id !== patientToDelete.id);
      setFilteredPatients(updatedPatients);
      setShowDeletePatientConfirm(false);
      setPatientToDelete(null);
    }
  };

  const handleAddPatient = () => {
    const newPatient: Patient = {
      id: crypto.randomUUID(),
      ...newPatientData,
      age: parseInt(newPatientData.age),
      medicalReports: [],
      lastVisit: new Date().toISOString().split('T')[0],
    };

    setFilteredPatients([...filteredPatients, newPatient]);
    setShowAddPatientModal(false);
    setNewPatientData({
      name: '',
      age: '',
      gender: '',
      bloodGroup: '',
      contactNumber: '',
      email: '',
      address: '',
      medicalHistory: [''],
    });
  };

  const dashboardCards: DashboardCard[] = [];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex justify-between items-center w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Hospital Dashboard</h1>
            {/* Hamburger Menu for Mobile */}
            <div className="sm:hidden relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              {/* Mobile Menu Dropdown */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMenuOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          activeTab === tab.id
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        role="menuitem"
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <button
              onClick={() => setShowAddPatientModal(true)}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Add Patient
            </button>
          </div>
        </div>

        {/* Tabs - Hidden on Mobile */}
        <div className="hidden sm:block mb-6 border-b border-gray-200">
          <div className="flex flex-wrap -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`mr-2 inline-flex items-center px-4 py-2 text-sm sm:text-base font-medium border-b-2 focus:outline-none ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="hidden sm:table-cell px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Age/Gender
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm sm:text-base font-medium text-gray-900">{patient.name}</div>
                            <div className="text-xs sm:text-sm text-gray-500 sm:hidden">
                              {patient.contactNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap">
                        <div className="text-sm sm:text-base text-gray-900">{patient.contactNumber}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{patient.email}</div>
                      </td>
                      <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap">
                        <div className="text-sm sm:text-base text-gray-900">{patient.age} years</div>
                        <div className="text-xs sm:text-sm text-gray-500">{patient.gender}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm sm:text-base">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleViewReports(patient)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs sm:text-sm font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            View Reports
                          </button>
                          <button
                            onClick={() => handleDeletePatient(patient)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs sm:text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPatients.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm sm:text-base">No patients found.</p>
                </div>
              )}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedPatient?.medicalReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col h-full">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold">{report.name}</h3>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">{report.date}</p>
                        <p className="text-sm sm:text-base text-gray-600">{report.doctor}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setIsReportModalOpen(true);
                          }}
                          className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report)}
                          className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Access Tab */}
          {activeTab === 'profile-access' && (
            <div className="p-4 sm:p-6">
              <PatientProfileAccess />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-4 sm:p-6">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6">Settings</h2>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="text-base sm:text-lg font-medium">Notifications</h3>
                      <p className="text-sm sm:text-base text-gray-500">Manage your email notifications</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Configure
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="text-base sm:text-lg font-medium">Security</h3>
                      <p className="text-sm sm:text-base text-gray-500">Update your security preferences</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="p-4 sm:p-6">
              <ContactForm userType="hospital" />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Add New Patient</h2>
                <button
                  onClick={() => setShowAddPatientModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/* Add patient form content */}
            </div>
          </div>
        </div>
      )}

      {showDeletePatientConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-medium mb-4">Confirm Delete</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4">
                Are you sure you want to delete this patient? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    if (patientToDelete) {
                      setFilteredPatients(patients => patients.filter(p => p.id !== patientToDelete.id));
                    }
                    setShowDeletePatientConfirm(false);
                    setPatientToDelete(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeletePatientConfirm(false);
                    setPatientToDelete(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

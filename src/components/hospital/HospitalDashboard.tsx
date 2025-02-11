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
  FileX
} from 'lucide-react';
import { Patient, mockPatients, MedicalReport, mockDoctors } from '../../data/mockPatients';
import MedicalReportModal from '../patient/MedicalReportModal';
import ContactForm from '../contact/ContactForm';

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
    <div className="p-6">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          {activeTab !== 'patients' && (
            <button
              onClick={() => setActiveTab('patients')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} className="mr-1" />
              Back
            </button>
          )}
        </div>
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center text-red-600 hover:text-red-700"
        >
          <LogOut size={20} className="mr-1" />
          Logout
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        {dashboardCards.map((card, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">{card.title}</h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-semibold">{card.value}</p>
              <span className={`text-sm ${
                card.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded ${
                activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'patients' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>
              <button
                onClick={() => setShowAddPatientModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center ml-4"
              >
                <Plus size={20} className="mr-2" />
                Add New Patient
              </button>
            </div>

            {/* Patients Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medical History</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Visit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">{patient.age} years, {patient.gender}</div>
                        <div className="text-sm text-gray-500">Blood Group: {patient.bloodGroup}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{patient.contactNumber}</div>
                        <div className="text-sm text-gray-500">{patient.email}</div>
                        <div className="text-sm text-gray-500">{patient.address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {patient.medicalHistory.join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {patient.lastVisit}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-3">
                        <button
                          onClick={() => handleViewReports(patient)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Reports
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold">Medical Reports</h2>
              </div>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Upload New Report
              </button>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPatients.flatMap(patient => 
                    patient.medicalReports.map(report => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{report.title}</div>
                          <div className="text-sm text-gray-500">Patient: {patient.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {report.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(report.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{report.doctor}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            report.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium space-x-3">
                          <button
                            onClick={() => {
                              setSelectedPatient(patient);
                              setSelectedReport(report);
                              setIsReportsListOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDeleteReport(report)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Settings</h2>
              <button
                onClick={() => setShowAddPatientModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Add New Patient
              </button>
            </div>

            {/* Patient Management Section */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Patient Management</h3>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medical History</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">{patient.age} years, {patient.gender}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{patient.contactNumber}</div>
                          <div className="text-sm text-gray-500">{patient.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {patient.medicalHistory.join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeletePatient(patient)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <ContactForm userType="hospital" />
        )}
      </div>

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Patient</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newPatientData.name}
                  onChange={(e) => setNewPatientData({...newPatientData, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="number"
                    value={newPatientData.age}
                    onChange={(e) => setNewPatientData({...newPatientData, age: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    value={newPatientData.gender}
                    onChange={(e) => setNewPatientData({...newPatientData, gender: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                <select
                  value={newPatientData.bloodGroup}
                  onChange={(e) => setNewPatientData({...newPatientData, bloodGroup: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  type="tel"
                  value={newPatientData.contactNumber}
                  onChange={(e) => setNewPatientData({...newPatientData, contactNumber: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={newPatientData.email}
                  onChange={(e) => setNewPatientData({...newPatientData, email: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  value={newPatientData.address}
                  onChange={(e) => setNewPatientData({...newPatientData, address: e.target.value})}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Medical History</label>
                <input
                  type="text"
                  value={newPatientData.medicalHistory[0]}
                  onChange={(e) => setNewPatientData({...newPatientData, medicalHistory: [e.target.value]})}
                  placeholder="Separate conditions with commas"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPatient}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Patient Confirmation Modal */}
      {showDeletePatientConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Patient</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {patientToDelete?.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeletePatientConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePatient}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPatient && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isReportsModalOpen ? '' : 'hidden'}`}>
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsReportsModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg w-4/5 max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div>
                <h2 className="text-2xl font-semibold">Medical Reports</h2>
                <div className="mt-2 text-gray-600">
                  <p className="font-medium">Patient: {selectedPatient.name}</p>
                  <p className="text-sm">ID: {selectedPatient.id}</p>
                </div>
              </div>
              <button
                onClick={() => setIsReportsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              {selectedPatient.medicalReports && selectedPatient.medicalReports.length > 0 ? (
                selectedPatient.medicalReports.map((report, index) => (
                  <div key={index} className="border rounded-lg p-6 bg-gray-50">
                    {/* Report Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-blue-600">{report.title}</h3>
                        <p className="text-gray-600 mt-1">Type: {report.type}</p>
                        <p className="text-gray-600">Date: {report.date}</p>
                      </div>
                      {report.fileUrl && (
                        <a
                          href={report.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download size={16} className="mr-2" />
                          Download Report
                        </a>
                      )}
                    </div>

                    {/* Hospital Information */}
                    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Hospital Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Hospital Name</p>
                          <p className="text-gray-800">{report.hospital.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Department</p>
                          <p className="text-gray-800">{report.hospital.department}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Location</p>
                          <p className="text-gray-800">{report.hospital.location}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Contact</p>
                          <p className="text-gray-800">{report.hospital.contactInfo}</p>
                        </div>
                      </div>
                    </div>

                    {/* Findings Section */}
                    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Findings</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Main Findings</p>
                          <p className="text-gray-800 mt-1">{report.findings.mainFindings}</p>
                        </div>

                        {report.findings.vitalSigns && (
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-2">Vital Signs</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {report.findings.vitalSigns.bloodPressure && (
                                <div className="bg-gray-50 p-2 rounded">
                                  <p className="text-xs text-gray-500">Blood Pressure</p>
                                  <p className="font-medium">{report.findings.vitalSigns.bloodPressure}</p>
                                </div>
                              )}
                              {report.findings.vitalSigns.heartRate && (
                                <div className="bg-gray-50 p-2 rounded">
                                  <p className="text-xs text-gray-500">Heart Rate</p>
                                  <p className="font-medium">{report.findings.vitalSigns.heartRate}</p>
                                </div>
                              )}
                              {report.findings.vitalSigns.temperature && (
                                <div className="bg-gray-50 p-2 rounded">
                                  <p className="text-xs text-gray-500">Temperature</p>
                                  <p className="font-medium">{report.findings.vitalSigns.temperature}</p>
                                </div>
                              )}
                              {report.findings.vitalSigns.oxygenSaturation && (
                                <div className="bg-gray-50 p-2 rounded">
                                  <p className="text-xs text-gray-500">O2 Saturation</p>
                                  <p className="font-medium">{report.findings.vitalSigns.oxygenSaturation}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {report.findings.testResults && (
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-2">Test Results</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {Object.entries(report.findings.testResults).map(([key, value]) => (
                                <div key={key} className="bg-gray-50 p-2 rounded">
                                  <p className="text-xs text-gray-500">{key}</p>
                                  <p className="font-medium">{value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-medium text-gray-600">Interpretation</p>
                          <p className="text-gray-800 mt-1">{report.findings.interpretation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations Section */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Recommendations</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Treatment Plan</p>
                          <p className="text-gray-800 mt-1">{report.recommendations.treatment}</p>
                        </div>

                        {report.recommendations.medications && report.recommendations.medications.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-2">Medications</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {report.recommendations.medications.map((med, idx) => (
                                <div key={idx} className="bg-gray-50 p-3 rounded">
                                  <p className="font-medium text-blue-600">{med.name}</p>
                                  <p className="text-sm text-gray-600">Dosage: {med.dosage}</p>
                                  <p className="text-sm text-gray-600">Frequency: {med.frequency}</p>
                                  <p className="text-sm text-gray-600">Duration: {med.duration}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {report.recommendations.followUp && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">Follow-up</p>
                            <p className="text-gray-800 mt-1">{report.recommendations.followUp}</p>
                          </div>
                        )}

                        {report.recommendations.lifestyle && report.recommendations.lifestyle.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-2">Lifestyle Recommendations</p>
                            <ul className="list-disc list-inside space-y-1">
                              {report.recommendations.lifestyle.map((item, idx) => (
                                <li key={idx} className="text-gray-800">{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {report.recommendations.precautions && report.recommendations.precautions.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-2">Precautions</p>
                            <ul className="list-disc list-inside space-y-1">
                              {report.recommendations.precautions.map((item, idx) => (
                                <li key={idx} className="text-gray-800">{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <FileX size={48} className="mx-auto" />
                  </div>
                  <p className="text-gray-600 font-medium">No medical reports available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Search, 
  Filter,
  Download,
  Plus,
  X
} from 'lucide-react';
import { Patient, mockPatients } from '../../data/mockPatients';

interface PatientFormData {
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  contactNumber: string;
  email: string;
  address: string;
  medicalHistory: string[];
}

const initialFormData: PatientFormData = {
  name: '',
  age: 0,
  gender: '',
  bloodGroup: '',
  contactNumber: '',
  email: '',
  address: '',
  medicalHistory: [''],
};

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(mockPatients);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<PatientFormData>(initialFormData);

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = mockPatients.filter(patient =>
      patient.name.toLowerCase().includes(query.toLowerCase()) ||
      patient.email.toLowerCase().includes(query.toLowerCase()) ||
      patient.contactNumber.includes(query)
    );
    setFilteredPatients(filtered);
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMedicalHistoryChange = (index: number, value: string) => {
    setFormData(prev => {
      const newHistory = [...prev.medicalHistory];
      newHistory[index] = value;
      return {
        ...prev,
        medicalHistory: newHistory
      };
    });
  };

  const addMedicalHistoryField = () => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: [...prev.medicalHistory, '']
    }));
  };

  const removeMedicalHistoryField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter((_, i) => i !== index)
    }));
  };

  // Modal handlers
  const openAddModal = () => {
    setFormData(initialFormData);
    setIsAddModalOpen(true);
  };

  const openViewModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const openEditModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      contactNumber: patient.contactNumber,
      email: patient.email,
      address: patient.address,
      medicalHistory: patient.medicalHistory,
    });
    setIsEditModalOpen(true);
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedPatient(null);
    setFormData(initialFormData);
  };

  // Submit handlers
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: Patient = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      medicalReports: [],
      lastVisit: new Date().toISOString().split('T')[0],
    };
    setPatients(prev => [newPatient, ...prev]);
    setFilteredPatients(prev => [newPatient, ...prev]);
    closeModals();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const updatedPatient: Patient = {
      ...selectedPatient,
      ...formData,
    };

    const updatedPatients = patients.map(p => 
      p.id === selectedPatient.id ? updatedPatient : p
    );

    setPatients(updatedPatients);
    setFilteredPatients(updatedPatients);
    closeModals();
  };

  // Modal Components
  const PatientModal = ({ title, onSubmit, children }: { title: string; onSubmit: (e: React.FormEvent) => void; children: React.ReactNode }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={onSubmit}>
            {children}
          </form>
        </div>
      </div>
    </div>
  );

  const PatientForm = () => (
    <>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={3}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
        {formData.medicalHistory.map((history, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={history}
              onChange={(e) => handleMedicalHistoryChange(index, e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter medical history"
            />
            {formData.medicalHistory.length > 1 && (
              <button
                type="button"
                onClick={() => removeMedicalHistoryField(index)}
                className="px-3 py-2 text-red-600 hover:text-red-800"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addMedicalHistoryField}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          + Add More
        </button>
      </div>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={closeModals}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        <button 
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Patient
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="w-5 h-5 mr-2" />
          Filter
        </button>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="w-5 h-5 mr-2" />
          Export
        </button>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.age} years • {patient.gender}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.email}</div>
                  <div className="text-sm text-gray-500">{patient.contactNumber}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{patient.address}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {patient.bloodGroup}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.medicalReports.length} Reports
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.lastVisit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => openViewModal(patient)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => openEditModal(patient)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Patient Modal */}
      {isAddModalOpen && (
        <PatientModal title="Add New Patient" onSubmit={handleAddSubmit}>
          <PatientForm />
        </PatientModal>
      )}

      {/* Edit Patient Modal */}
      {isEditModalOpen && (
        <PatientModal title="Edit Patient" onSubmit={handleEditSubmit}>
          <PatientForm />
        </PatientModal>
      )}

      {/* View Patient Modal */}
      {isViewModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Patient Details</h2>
                <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Age</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedPatient.age} years</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedPatient.gender}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Blood Group</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedPatient.bloodGroup}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedPatient.contactNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedPatient.email}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedPatient.address}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Medical History</h3>
                  <ul className="mt-1 space-y-1">
                    {selectedPatient.medicalHistory.map((history, index) => (
                      <li key={index} className="text-sm text-gray-900">• {history}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Medical Reports</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPatient.medicalReports.length} reports available
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Visit</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedPatient.lastVisit}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

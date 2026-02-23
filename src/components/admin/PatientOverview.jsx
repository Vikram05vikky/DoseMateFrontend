import React, { useState, useEffect, useCallback } from 'react';
import { User, Phone, Mail, MapPin, Calendar, Search, Filter } from 'lucide-react';

// const BASE_URL = 'http://localhost:8080'; // <-- Adjust to your backend URL
const BASE_URL = 'https://dimktqsi2kki8.cloudfront.net/';


const PatientOverview = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('all');

  // Function to fetch all necessary data
  const fetchData = useCallback(async () => {
    setLoading(true);
    
    // 1. Fetch Patients
    const patientPromise = fetch(`${BASE_URL}/api/patient/all`)
      .then(res => res.ok ? res.json() : Promise.reject(`Patient fetch failed: ${res.status}`))
      .catch(error => { console.error("Error fetching patients:", error); return []; });

    // 2. Fetch Doctors (for the filter/lookup)
    const doctorPromise = fetch(`${BASE_URL}/admin/doctors`)
      .then(res => res.ok ? res.json() : Promise.reject(`Doctor fetch failed: ${res.status}`))
      .catch(error => { console.error("Error fetching doctors:", error); return []; });

    try {
      const [patientData, doctorData] = await Promise.all([patientPromise, doctorPromise]);

      setPatients(patientData);
      setDoctors(doctorData);
      
    } catch (error) {
      // Errors are already logged in the individual promises
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helper function to get doctor name from the fetched list
  const getDoctorName = (doctorId) => {
    // Assuming doctor.id is an integer
    const doctor = doctors.find(d => d.id === parseInt(doctorId));
    // Assuming the Doctor model has a 'doctorName' field
    return doctor ? doctor.doctorName : 'Unknown Doctor'; 
  };
  
  // 🛑 Treatment Status Calculation is now removed/simplified
  const getPatientTreatmentStatus = (patientId) => {
    // ⚠️ Placeholder: You need to implement a backend endpoint to calculate these counts
    return { active: 'N/A', completed: 'N/A', total: 'N/A' };
  };

  // --- Filtering Logic (Client-side) ---
  const filteredPatients = patients.filter(patient => {
    // PatientInfo model fields: name, email, doctorId (assuming doctor ID is associated)
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phoneNo?.includes(searchTerm); // Assuming phoneNo is on the PatientInfo model

    const matchesDoctor =
      selectedDoctor === 'all' || patient.doctorId === parseInt(selectedDoctor); 
      
    return matchesSearch && matchesDoctor;
  });

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading Patient Data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Patient Overview</h2>
        <div className="text-sm text-gray-600">
          Total Patients: {patients.length}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Doctors</option>
            {/* Using doctorName from the backend Doctor model */}
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>Dr. {doctor.doctorName}</option> 
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPatients.map((patient) => {
          const treatmentStatus = getPatientTreatmentStatus(patient.id);
          return (
            <div key={patient.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    {/* Assuming PatientInfo model has name, age, gender */}
                    <h3 className="text-lg font-semibold text-gray-900">{patient.name} (ID: {patient.id})</h3>
                    <p className="text-sm text-gray-600">{patient.age || 'N/A'} years, {patient.gender || 'N/A'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Dr. {getDoctorName(patient.doctorId)}
                  </p>
                  <p className="text-xs text-gray-600">Attending Physician</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 mb-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{patient.phoneNo || 'N/A'}</span> {/* Assumed field: phoneNo */}
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{patient.email || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{patient.address || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {/* NOTE: PatientInfo model likely needs a 'registrationDate' or 'createdAt' field */}
                  <span className="text-sm">Registered: N/A</span> 
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Treatment Status ⚠️ Placeholder</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{treatmentStatus.total}</p>
                    <p className="text-xs text-gray-600">Total Visits/Treatments</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{treatmentStatus.active}</p>
                    <p className="text-xs text-gray-600">Active Treatments</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-600">{treatmentStatus.completed}</p>
                    <p className="text-xs text-gray-600">Completed Treatments</p>
                  </div>
                </div>
                <p className="text-xs text-red-500 mt-2">
                    Data is N/A: Backend endpoint for prescription/visit data is missing.
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
            <User className="h-10 w-10 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
};


export default PatientOverview;

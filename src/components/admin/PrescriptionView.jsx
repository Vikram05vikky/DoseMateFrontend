import React, { useState, useEffect, useCallback } from 'react';
import { FileText, User, Calendar, Pill, Clock, AlertTriangle } from 'lucide-react';

// const BASE_URL = 'http://localhost:8080'; // <-- Adjust to your backend URL
const BASE_URL = 'https://dimktqsi2kki8.cloudfront.net/';

// const BASE_URL = '/api';


const PrescriptionView = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]); // Assuming a separate model for diagnoses
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // 1. Unified Fetch Function
  const fetchData = useCallback(async () => {
    setLoading(true);
    
    // ⚠️ CRITICAL: PLACEHOLDER URLs for MISSING BACKEND ENDPOINTS
    const endpoints = [
      // ❌ Assumes you implement this endpoint
      { key: 'prescriptions', url: '/api/prescriptions/all' }, 
      // ❌ Assumes you implement this endpoint
      { key: 'diagnoses', url: '/api/diagnoses/all' }, 
      
      // ✅ Existing Endpoints
      { key: 'patients', url: '/api/patient/all' },
      { key: 'doctors', url: '/admin/doctors' },
    ];

    const fetchedData = {};

    const promises = endpoints.map(async (endpoint) => {
      try {
        const response = await fetch(`${BASE_URL}${endpoint.url}`);
        if (response.ok) {
          fetchedData[endpoint.key] = await response.json();
        } else {
          console.error(`Failed to fetch ${endpoint.key} from ${endpoint.url}. Status: ${response.status}`);
          fetchedData[endpoint.key] = []; // Default to empty array on failure
        }
      } catch (error) {
        console.error(`Error fetching ${endpoint.key}:`, error);
        fetchedData[endpoint.key] = [];
      }
    });

    await Promise.all(promises);

    setPrescriptions(fetchedData.prescriptions || []);
    setPatients(fetchedData.patients || []);
    setDoctors(fetchedData.doctors || []);
    setDiagnoses(fetchedData.diagnoses || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 2. Data Lookup Functions (using fetched arrays)
  
  const getPatientName = (patientId) => {
    // Assuming patient.id is an integer, so use loose equality or parseInt
    const patient = patients.find((p) => p.id === patientId); 
    // Assuming PatientInfo model has 'name' field
    return patient ? patient.name : 'Unknown Patient';
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    // Assuming Doctor model has 'doctorName' field
    return doctor ? doctor.doctorName : 'Unknown Doctor';
  };

  const getDiagnosis = (diagnosisId) => {
    const diagnosis = diagnoses.find((d) => d.id === diagnosisId);
    // Assuming Diagnosis model has 'id', 'diagnosis', 'symptoms', and 'severityLevel'
    return diagnosis || null;
  };
  
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) { // Use optional chaining and ensure case insensitivity
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 3. Filtering Logic (remains largely the same, but uses state)
  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      selectedStatus === 'all' || 
      // Assuming the backend returns a lower-case status string (e.g., 'active', 'completed')
      prescription.status.toLowerCase() === selectedStatus
  );

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading Prescription Data...</div>;
  }
  
  // 4. Render component with fetched data
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">
          Prescription Overview
        </h2>
        <div className="flex space-x-2">
          {['all', 'active', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                {
                  prescriptions.filter(
                    (p) => status === 'all' || p.status.toLowerCase() === status
                  ).length
                }
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* --- Backend Warning --- */}
      {(prescriptions.length === 0 && !loading) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Backend Warning:</strong>
          <span className="block sm:inline ml-2">Prescription data is missing. Please implement the **`/api/prescriptions/all`** endpoint.</span>
        </div>
      )}
      {(diagnoses.length === 0 && !loading) && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Backend Warning:</strong>
          <span className="block sm:inline ml-2">Diagnosis data is missing. Please implement the **`/api/diagnoses/all`** endpoint for full functionality.</span>
        </div>
      )}
      {/* ----------------------- */}

      <div className="space-y-6">
        {filteredPrescriptions.map((prescription) => {
          const diagnosis = getDiagnosis(prescription.diagnosisId);
          return (
            <div
              key={prescription.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                {/* ... (Rest of the header section remains the same) ... */}
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Prescription #{prescription.id}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600 flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {getPatientName(prescription.patientId)}
                      </span>
                      <span className="text-sm text-gray-600">
                        by Dr. {getDoctorName(prescription.doctorId)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      prescription.status?.toLowerCase() === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {prescription.status}
                  </span>
                  <div className="text-sm text-gray-600 mt-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {/* Assuming createdDate is a valid date string/timestamp */}
                    {new Date(prescription.createdDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {diagnosis && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Diagnosis</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getSeverityColor(
                        diagnosis.severityLevel
                      )}`}
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {diagnosis.severityLevel}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 font-medium mb-1">
                    {diagnosis.diagnosis}
                  </p>
                  <p className="text-sm text-gray-600">{diagnosis.symptoms}</p>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Pill className="h-4 w-4 mr-2" />
                  Medications ({prescription.medications?.length || 0})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Assuming medications is an array of objects */}
                  {prescription.medications?.map((medication, index) => (
                    <div
                      key={medication.id || index} // Use index as fallback key
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">
                          {medication.name}
                        </h5>
                        <span className="text-sm text-gray-600">
                          {medication.dosage}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Quantity:</span>{' '}
                          {medication.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span>{' '}
                          {medication.duration}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {medication.sessionsPerDay}x daily
                        </div>
                        <div>
                          <span className="font-medium">Food:</span>{' '}
                          {medication.foodTiming} meals
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPrescriptions.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
            <FileText className="h-10 w-10 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No prescriptions found
          </h3>
          <p className="text-gray-600">
            No prescriptions match the selected status filter.
          </p>
        </div>
      )}
    </div>
  );
};


export default PrescriptionView;



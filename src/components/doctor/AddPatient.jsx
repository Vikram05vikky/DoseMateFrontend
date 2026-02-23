

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, User, ClipboardList, Pill } from 'lucide-react';
import axiosInstance from '../axiosInstance';

const AddPatient = () => {
  // const { doctorId } = useApp(); // Assume your context provides the logged-in doctor's ID

  const { user } = useApp();
const doctorId = user?.id;
  const [currentStep, setCurrentStep] = useState(1);
  // const [patientForm, setPatientForm] = useState({
  //   name: '',
  //   age: '',
  //   gender: 'male',
  //   mobile: '',
  //   email: '',
  //   address: ''
  // });
const [patientForm, setPatientForm] = useState({
  name: '',
  age: '',
  gender: 'male',
  mobile: '',
  email: '',
  address: '',
  preferredLanguage: 'english' // ✅ NEW
});

  const [diagnosisForm, setDiagnosisForm] = useState({
    diagnosis: '',
    symptoms: '',
    // severityLevel: 'low'
  });


  const [medications, setMedications] = useState([{
        name: '',
        quantity: '',
        // Renamed sessionsPerDay to frequencyPerDay for clarity, 
        // and added sessionTiming to map to Java's 'session' field
        frequencyPerDay: 1, 
        sessionTiming: 'Morning', // 💡 NEW: Default value for the Java 'session' field
        foodTiming: 'before',
        dosage: '',
        duration: ''
    }]);

  // const handleAddMedication = () => {
  //   setMedications([...medications, {
  //     name: '',
  //     quantity: '',
  //     sessionsPerDay: 1,
  //     foodTiming: 'before',
  //     dosage: '',
  //     duration: ''
  //   }]);
  // };

  const handleAddMedication = () => {
        setMedications([...medications, {
            name: '',
            quantity: '',
            frequencyPerDay: 1, // 💡 NEW/UPDATED
            sessionTiming: 'Morning', // 💡 NEW
            foodTiming: 'before',
            dosage: '',
            duration: ''
        }]);
    };

  const handleRemoveMedication = (index) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };


  const handleMedicationChange = (index, field, value) => {
        const updated = medications.map((med, i) =>
            i === index ? { ...med, [field]: value } : med
        );
        setMedications(updated);
    };

    const validateStep = (step) => {
        switch (step) {
            // ... (cases 1 & 2 remain the same)
             case 1:
        return patientForm.name && patientForm.age > 0 && patientForm.mobile && patientForm.email;
      case 2:
        return diagnosisForm.diagnosis && diagnosisForm.symptoms;
            case 3:
                // Check the new/updated fields
                return medications.every(m => m.name && m.quantity && m.dosage && m.duration && m.sessionTiming); 
            default:
                return false;
        }
    };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: patientForm.name,
        age: patientForm.age, 
        gender: patientForm.gender,
        phoneNo: patientForm.mobile,
        email: patientForm.email,
        whatsappNo: patientForm.mobile,
         preferredLanguage: patientForm.preferredLanguage,
        doctorExaminations: [{
          diagnosis: diagnosisForm.diagnosis,
          symptoms: diagnosisForm.symptoms,
          severityLevel: diagnosisForm.severityLevel
        }],
        // medicines: medications.map(med => ({
        //   medicineName: med.name,
        //   session: med.sessionsPerDay,
        //   takingmethod: med.foodTiming,
        //   quantityPerSession: med.dosage,
        //   totalQuantity: med.quantity,
        //   startDate: new Date().toISOString().split('T')[0],
        //   lastDate: new Date(new Date().setDate(new Date().getDate() + parseInt(med.duration || 0))).toISOString().split('T')[0]
        medicines: medications.map(med => ({
          medicineName: med.name,
          session: med.sessionTiming, 
          takingmethod: med.foodTiming,
          quantityPerSession: med.dosage, 
          totalQuantity: med.quantity,
          startDate: new Date().toISOString().split('T')[0],
          lastDate: new Date(new Date().setDate(new Date().getDate() + parseInt(med.duration || 0))).toISOString().split('T')[0]
       
        })),
        otherTreatments: [] // add treatments if needed
      };

      const response = await axiosInstance.post(`/api/patient/new/${doctorId}`, payload);
      console.log('Patient added:', response.data);

      // Reset forms
      setCurrentStep(1);
      setPatientForm({ name: '', age: 0, gender: 'male', mobile: '', email: '', address: '',preferredLanguage: 'english' });
      setDiagnosisForm({ diagnosis: '', symptoms: '', severityLevel: 'low' });
      setMedications([{ name: '', quantity: '', sessionsPerDay: 1, foodTiming: 'before', dosage: '', duration: '' }]);

      alert('Patient added successfully!');
    } catch (error) {
      console.error('Error adding patient:', error.response || error.message);
      alert('Failed to add patient. Check console for details.');
    }
  };

  const steps = [
    { number: 1, title: 'Patient Information', icon: User },
    { number: 2, title: 'Diagnosis', icon: ClipboardList },
    { number: 3, title: 'Medications', icon: Pill }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Add New Patient</h2>
      </div>

      <div className="flex items-center justify-center space-x-8 mb-8">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                <Icon className="h-6 w-6" />
              </div>
              <span className={`mt-2 text-sm font-medium ${
                currentStep >= step.number ? 'text-blue-600' : 'text-gray-600'
              }`}>{step.title}</span>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {/* Step 1: Patient Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={patientForm.name}
                  onChange={e => setPatientForm({...patientForm, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter patient's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={patientForm.age}
                  onChange={e => setPatientForm({...patientForm, age: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={patientForm.gender}
                  onChange={e => setPatientForm({...patientForm, gender: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  value={patientForm.mobile}
                  onChange={e => setPatientForm({...patientForm, mobile: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1-555-0123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={patientForm.email}
                  onChange={e => setPatientForm({...patientForm, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="patient@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={patientForm.address}
                  onChange={e => setPatientForm({...patientForm, address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter complete address"
                />
              </div>
              <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Preferred Language
  </label>

  <select
    value={patientForm.preferredLanguage}
    onChange={e =>
      setPatientForm({
        ...patientForm,
        preferredLanguage: e.target.value
      })
    }
    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  >
    <option value="english">English</option>
    <option value="tamil">Tamil</option>
    <option value="hindi">Hindi</option>
    <option value="telugu">Telugu</option>
    <option value="kannada">Kannada</option>
    <option value="malayalam">Malayalam</option>
  </select>
</div>

            </div>
          </div>

          
        )}

        {/* Step 2: Diagnosis */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Diagnosis Information</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                <input
                  type="text"
                  value={diagnosisForm.diagnosis}
                  onChange={e => setDiagnosisForm({...diagnosisForm, diagnosis: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter primary diagnosis"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                <textarea
                  value={diagnosisForm.symptoms}
                  onChange={e => setDiagnosisForm({...diagnosisForm, symptoms: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="List patient symptoms"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
                <select
                  value={diagnosisForm.severityLevel}
                  onChange={e => setDiagnosisForm({...diagnosisForm, severityLevel: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Medications */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Medications</h3>
            {medications.map((med, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-4 relative">
                <button
                  type="button"
                  onClick={() => handleRemoveMedication(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={med.name}
                    onChange={e => handleMedicationChange(index, 'name', e.target.value)}
                    placeholder="Medicine Name"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    value={med.quantity}
                    onChange={e => handleMedicationChange(index, 'quantity', e.target.value)}
                    placeholder="Total Quantity"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                 
<select
  value={med.sessionTiming} // <-- CORRECTED: Bind to the sessionTiming state
  onChange={e => handleMedicationChange(index, 'sessionTiming', e.target.value)} // <-- CORRECTED: Update the sessionTiming state
  className="w-full px-4 py-2 border rounded-lg"
>
  <option value="Morning">Morning</option>
  <option value="Afternoon">Afternoon</option>
  <option value="Evening">Evening</option>
  <option value="Night">Night</option>
</select>
                  <select
                    value={med.foodTiming}
                    onChange={e => handleMedicationChange(index, 'foodTiming', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="before">Before Food</option>
                    <option value="after">After Food</option>
                  </select>
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={e => handleMedicationChange(index, 'dosage', e.target.value)}
                    placeholder="Dosage per session"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    value={med.duration}
                    onChange={e => handleMedicationChange(index, 'duration', e.target.value)}
                    placeholder="Duration (days)"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddMedication}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="mr-2" /> Add Medication
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Previous
            </button>
          )}
          {currentStep < steps.length && (
            <button
              type="button"
              onClick={() => {
                if (validateStep(currentStep)) {
                  setCurrentStep(prev => prev + 1);
                } else {
                  alert('Please fill all required fields for this step');
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          )}
          {currentStep === steps.length && (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPatient;

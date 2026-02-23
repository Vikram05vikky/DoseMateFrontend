import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, User, Phone, Mail, Calendar, Eye, Edit2, CheckCircle, ClipboardList, Clock, Loader2, X, Pill, Stethoscope } from 'lucide-react';

// const BASE_URL = 'http://localhost:8080';
const BASE_URL = 'http://65.2.69.70:8080';


// --- HISTORY MODAL (NEW - FOR VIEW HISTORY) ---
const HistoryModal = ({ showHistoryModal, patient, history, loading, historyLoading, error, onClose }) => {
    if (!showHistoryModal || !patient) return null;

    // Add current date if no date exists in history entry
    const getDisplayDate = (historyItem) => {
        if (historyItem.createdDate) {
            return new Date(historyItem.createdDate).toLocaleDateString();
        }
        // Fallback: use current date or "Recently Added"
        return new Date().toLocaleDateString();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full md:w-11/12 lg:w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h3 className="text-2xl font-bold text-gray-900">
                        <span className="text-purple-600 mr-2">Medical History:</span> {patient.name}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="mt-6">
                    {loading || historyLoading ? (
                        <div className="text-center py-20">
                            <Loader2 className="animate-spin h-10 w-10 text-purple-600 mx-auto" />
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed">
                            <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No history records found for this patient.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto border rounded-xl shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">History Content</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {history.map((h, index) => (
                                        <tr key={h.id || index} className="hover:bg-purple-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {/* ✅ Fixed date display */}
                                                {getDisplayDate(h)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-400 min-h-[80px] flex items-center">
                                                    {h.patientHistory || h.historyContent || 'No content available'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                    {error && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800 text-sm">{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- PRESCRIPTION MODAL (RENAMED FROM OLD HistoryModal) ---
const PrescriptionModal = ({ showPrescriptionModal, patient, prescriptions, loading, prescriptionLoading, error, onClose, formattedDate }) => {
    if (!showPrescriptionModal || !patient) return null;

    const displayPrescriptions = [...(prescriptions || [])].sort((a, b) =>
        new Date(b.startDate) - new Date(a.startDate)
    );

    const examList = patient.doctorExaminations || [];
    const primaryExam = examList.length > 0 ? examList[0] : null;
    const diagnosis = primaryExam?.diagnosis || 'No Diagnosis';
    const symptoms = primaryExam?.symptoms || 'No Symptoms reported';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full md:w-11/12 lg:w-full max-w-7xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h3 className="text-2xl font-bold text-gray-900">
                        <span className="text-blue-600 mr-2">Prescriptions:</span> {patient.name}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="mt-6">
                    {loading || prescriptionLoading ? (
                        <div className="text-center py-20"><Loader2 className="animate-spin h-10 w-10 text-blue-600 mx-auto" /></div>
                    ) : displayPrescriptions.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed">
                            <p className="text-gray-500">No prescriptions found for this patient.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto border rounded-xl shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-slate-800">
                                    <tr>
                                        <th className="px-3 py-4 text-left text-xs font-bold text-white uppercase">Date</th>
                                        <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">Diagnosis</th>
                                        <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">Symptoms</th>
                                        <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">Medication</th>
                                        <th className="px-3 py-4 text-left text-xs font-bold text-white uppercase">Dosage</th>
                                        <th className="px-3 py-4 text-left text-xs font-bold text-white uppercase">Duration</th>
                                        <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">Instruction</th>
                                        <th className="px-3 py-4 text-left text-xs font-bold text-white uppercase">Timing</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {displayPrescriptions.map((p, pIndex) => (
                                        <tr key={pIndex} className="hover:bg-blue-50/50 transition-colors">
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {p.startDate ? new Date(p.startDate).toLocaleDateString() : formattedDate}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-bold text-slate-900 min-w-[150px]">{diagnosis}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600 italic min-w-[150px]">{symptoms}</td>
                                            <td className="px-4 py-4 text-sm font-semibold text-blue-700">{p.medicineName || p.treatmentName}</td>
                                            <td className="px-3 py-4 text-sm text-gray-700">{p.quantityPerSession || 'N/A'}</td>
                                            <td className="px-3 py-4 text-sm text-gray-700">{p.totalQuantity} units</td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                <span className="capitalize bg-gray-100 px-2 py-1 rounded">{p.takingmethod || 'As directed'}</span>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <span className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-bold">{p.session || 'N/A'}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AddHistoryModal = ({ patient, historyText, setHistoryText, onClose }) => {
    const submitHistory = async () => {
        try {
            await axios.post(`${BASE_URL}/api/patient/history/add`, {
                phoneNo: patient.phoneNo,
                patientName: patient.name,
                patientHistory: historyText
            });
            alert("History added!");
            setHistoryText('');
            onClose();
        } catch (err) {
            alert("Failed to save history");
        }
    };

    return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl animate-fadeIn">

            <h3 className="text-2xl font-semibold text-gray-800 mb-5">
                Add History – <span className="text-green-600">{patient.name}</span>
            </h3>

            <textarea
                rows="5"
                className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="Enter patient history details..."
                value={historyText}
                onChange={(e) => setHistoryText(e.target.value)}
            />

            <div className="flex justify-end space-x-4 mt-6">
                <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                    Cancel
                </button>

                <button
                    onClick={submitHistory}
                    className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition shadow-md"
                >
                    Save History
                </button>
            </div>
        </div>
    </div>
);

};

// const parseAnalysisResult = (text) => {
//   const sections = {};
//   const lines = text.split("\n");

//   let currentTitle = "";

//   lines.forEach((line) => {
//     // Remove ** markdown
//     const cleanLine = line.replace(/\*\*/g, "").trim();

//     const headingMatch = cleanLine.match(/^\d+\.\s+(.*)/);
//     if (headingMatch) {
//       currentTitle = headingMatch[1].trim();
//       sections[currentTitle] = "";
//     } else if (currentTitle && cleanLine) {
//       sections[currentTitle] += cleanLine + "\n";
//     }
//   });

//   return sections;
// };

const parseAnalysisResult = (text) => {
  const sections = {};
  if (!text) return sections;

  const normalized = text.replace(/\*\*/g, "").trim();

  const headingRegex =
    /(Clinical Summary|Correlation Analysis|Possible Causes and Differential Diagnosis|Recommended Lab Tests and Diagnostics|Risk Assessment|Treatment Suggestions \(General Guidance Only\)|Follow-up Advice|Preventive Measures|Patient Education|Disclaimer)/i;

  let currentTitle = null;

  normalized.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Check if line matches one of the mandatory headings
    if (headingRegex.test(trimmed)) {
      currentTitle = trimmed;
      sections[currentTitle] = "";
    } else if (currentTitle) {
      sections[currentTitle] += trimmed + "\n";
    }
  });

  return sections;
};



const AnalyzeModal = ({ patient, onClose }) => {
  const [problem, setProblem] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!problem.trim()) {
      setError("Please enter current problem");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult("");

      const res = await axios.post(`${BASE_URL}/api/olama/analyze`, {
        phoneNo: patient.phoneNo,
        patientName: patient.name,
        currentProblem: problem
      });

      setResult(res.data);
    } catch (err) {
      setError(err.response?.data || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            AI Analysis – <span className="text-orange-600">{patient.name}</span>
          </h3>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <textarea
          rows="4"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="Enter current problem / complaint..."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700"
          >
            {loading ? "Analyzing..." : "Analyse"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* {result && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border whitespace-pre-wrap text-sm">
            {result}
          </div>
        )} */}
       {result && (
  <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
    {Object.entries(parseAnalysisResult(result)).map(([title, content]) => (
      <div key={title}>
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">
          {title}
        </h4>

        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
          {content.trim()}
        </p>
      </div>
    ))}
  </div>
)}


      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---
const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [allPrescriptions, setAllPrescriptions] = useState([]);
    const [showAddHistory, setShowAddHistory] = useState(false);
    const [historyText, setHistoryText] = useState("");
    const [patientPrescriptions, setPatientPrescriptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [currentDoctorId, setCurrentDoctorId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Separate modals for history and prescriptions
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState('');
    const [prescriptionLoading, setPrescriptionLoading] = useState(false);

    const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
const [currentProblem, setCurrentProblem] = useState("");
const [analysisResult, setAnalysisResult] = useState("");
const [analyzeLoading, setAnalyzeLoading] = useState(false);
const [analyzeError, setAnalyzeError] = useState("");


    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.role === 'doctor') {
            setCurrentDoctorId(storedUser.id);
        } else {
            setError('Please log in as a doctor.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!currentDoctorId) return;
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                const prescriptionRes = await axios.get(`${BASE_URL}/api/doctor/${currentDoctorId}/prescriptions`);
                setAllPrescriptions(prescriptionRes.data);
                const patientResponse = await axios.get(`${BASE_URL}/api/doctor/${currentDoctorId}/patients`);
                setPatients(patientResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch patient data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentDoctorId]);

const fetchPatientHistory = async (patient) => {
    if (!patient?.phoneNo) {
        setHistoryError("Patient phone number missing");
        return;
    }
    
    setSelectedPatient(patient);
    setShowHistoryModal(true);
    setHistoryLoading(true);
    setHistoryError('');
    setHistoryData([]);
    
    try {
        // Matches your backend: GET /api/patient/{phoneNo}
        const historyRes = await axios.get(`${BASE_URL}/api/patient/history/${patient.phoneNo}`);
        setHistoryData(historyRes.data || []);
    } catch (err) {
        console.error('Error fetching history:', err);
        if (err.response?.status === 404) {
            setHistoryError("No history records found for this patient.");
        } else {
            setHistoryError("Failed to load patient history");
        }
        setHistoryData([]);
    } finally {
        setHistoryLoading(false);
    }
};


    // Fetch patient prescriptions
    const fetchPatientPrescriptions = async (patient) => {
        if (!patient?.patientId) return;
        setSelectedPatient(patient);
        setShowPrescriptionModal(true);
        setPrescriptionLoading(true);
        
        try {
            const reminderRes = await axios.get(`${BASE_URL}/api/patient/reminders/${patient.patientId}`);
            setPatientPrescriptions(reminderRes.data || []);
            const prescriptionRes = await axios.get(`${BASE_URL}/api/patient/${patient.patientId}/prescriptions`);
            setPatientPrescriptions([
                ...(prescriptionRes.data.medicines || []),
                ...(prescriptionRes.data.treatments || [])
            ]);
        } catch (err) {
            console.error('Error fetching prescriptions:', err);
        } finally {
            setPrescriptionLoading(false);
        }
    };

    const filteredPatients = patients.filter((patient) =>
        patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPatientStatus = (patientId) => {
        const patientData = allPrescriptions.filter(p => p.patientId === patientId);
        const hasActive = patientData.some(p => p.status === 'active');
        return hasActive ? 'active' : 'completed';
    };

    const getPatientPrescriptionCount = (patientId) => {
        return allPrescriptions.filter(p => p.patientId === patientId).length;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="animate-spin h-10 w-10 text-blue-600 mb-3" />
                <p className="text-gray-600">Loading patients...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16">
                <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
                    <User className="h-10 w-10 text-red-400 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
                <p className="text-gray-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">My Patients</h2>
                <div className="text-sm text-gray-600">Total: {patients.length} patients</div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search patients by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPatients.map((patient) => {
                    const status = getPatientStatus(patient.id);
                    return (
                        <div key={patient.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-blue-100 p-2 rounded-lg"><User className="h-5 w-5 text-blue-600" /></div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                                        <p className="text-sm text-gray-600">{patient.age || 'N/A'} years, {patient.gender || 'N/A'}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {status === 'active' ? 'Active Treatment' : 'Completed'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-3 mb-4">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Phone className="h-4 w-4" /> <span className="text-sm">{patient.phoneNo || 'Not available'}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Mail className="h-4 w-4" /> <span className="text-sm">{patient.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-sm">Registered: {patient.registeredDate ? new Date(patient.registeredDate).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={() => fetchPatientPrescriptions(patient)} className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm px-3 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                        <Pill className="h-4 w-4" /> <span>View Prescription</span>
                                    </button>
                                    <button onClick={() => { setSelectedPatient(patient); setShowAddHistory(true); }} className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm px-3 py-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                        <Stethoscope className="h-4 w-4" /> <span>Add History</span>
                                    </button>
                                    <button onClick={() => fetchPatientHistory(patient)} className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm px-3 py-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                                        <ClipboardList className="h-4 w-4" /> <span>View History</span>
                                    </button>
                                    <button
  onClick={() => {
    setSelectedPatient(patient);
    setShowAnalyzeModal(true);
  }}
  className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 text-sm px-3 py-2 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
>
  <Eye className="h-4 w-4" />
  <span>Analyse</span>
</button>

                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* History Modal */}
            <HistoryModal 
                showHistoryModal={showHistoryModal}
                patient={selectedPatient} 
                history={historyData} 
                loading={loading}
                historyLoading={historyLoading}
                error={historyError}
                onClose={() => setShowHistoryModal(false)} 
            />

            {/* Prescription Modal */}
            <PrescriptionModal 
                showPrescriptionModal={showPrescriptionModal}
                patient={selectedPatient} 
                prescriptions={patientPrescriptions}
                loading={loading}
                prescriptionLoading={prescriptionLoading}
                error={historyError}
                onClose={() => setShowPrescriptionModal(false)} 
            />

            {showAddHistory && selectedPatient && (
                <AddHistoryModal
                    patient={selectedPatient}
                    historyText={historyText}
                    setHistoryText={setHistoryText}
                    onClose={() => setShowAddHistory(false)}
                />
            )}

            {showAnalyzeModal && selectedPatient && (
  <AnalyzeModal
    patient={selectedPatient}
    onClose={() => setShowAnalyzeModal(false)}
  />
)}

        </div>
    );
};

export default PatientList;

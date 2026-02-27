
import React, { useState, useEffect, useCallback } from 'react';
import { Users, FileText, TrendingUp, CheckCircle, Activity, Calendar, Loader2 } from 'lucide-react';

// const BASE_URL = 'http://localhost:8080';
// ⚠️ IMPORTANT: REPLACE THIS WITH THE ACTUAL LOGGED-IN DOCTOR'S ID FROM CONTEXT
// const BASE_URL = 'https://dimktqsi2kki8.cloudfront.net/';
const BASE_URL = '/api';

const DOCTOR_ID = 1; 

const DoctorDashboard = ({ user }) => {
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    activePatients: 0,
    completedPatients: 0,
    patientsList: [], // To hold the recent patients list
  });
  const [loading, setLoading] = useState(true);

  // Function to fetch all dashboard metrics
  const fetchMetrics = useCallback(async () => {
    const endpoints = [
      { key: 'totalPatients', url: `/api/doctor/${DOCTOR_ID}/patientCount` },
      { key: 'activePatients', url: `/api/doctor/${DOCTOR_ID}/activePatientCount` },
      { key: 'completedPatients', url: `/api/doctor/${DOCTOR_ID}/completedPatientCount` },
      // ⚠️ Inefficient: Fetch all patients to filter for recent list. 
      { key: 'allPatients', url: '/api/patient/all' }, 
    ];

    const data = {};
    let doctorPatientsList = [];

    try {
      const promises = endpoints.map(async (endpoint) => {
        const response = await fetch(`${BASE_URL}${endpoint.url}`);
        if (response.ok) {
          return { key: endpoint.key, result: await response.json() };
        } else {
          console.error(`Failed to fetch ${endpoint.key}: ${response.statusText}`);
          return { key: endpoint.key, result: (endpoint.key === 'allPatients' ? [] : 0) };
        }
      });
      
      const results = await Promise.all(promises);
      
      results.forEach(({ key, result }) => {
        if (key === 'allPatients') {
          // Filter patients list on the frontend (due to missing doctor-specific endpoint)
          doctorPatientsList = result.filter(p => p.doctorId === DOCTOR_ID);
        } else {
          data[key] = result;
        }
      });
      
      // Calculate Total Prescriptions from Active + Completed counts
      const totalPrescriptions = data.activePatients + data.completedPatients;

      setDashboardData({
        totalPatients: data.totalPatients,
        activePatients: data.activePatients,
        completedPatients: data.completedPatients,
        totalPrescriptions: totalPrescriptions,
        patientsList: doctorPatientsList, // This is the filtered list for the doctor
      });
      
    } catch (error) {
      console.error('Error fetching doctor dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const {
    totalPatients,
    activePatients,
    completedPatients,
    totalPrescriptions,
    patientsList
  } = dashboardData;

  const stats = [
    {
      title: 'Total Patients',
      value: totalPatients,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Prescriptions',
      value: totalPrescriptions,
      icon: FileText,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Active Treatments',
      value: activePatients, 
      icon: Activity,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Completed Treatments',
      value: completedPatients, 
      icon: CheckCircle,
      color: 'bg-teal-500',
      textColor: 'text-teal-600'
    }
  ];

  const recentPatients = patientsList.slice(-3).reverse(); 
  
  const successRate = totalPrescriptions > 0 
    ? Math.round((completedPatients / totalPrescriptions) * 100) 
    : 0;


  if (loading) {
    return <div className="text-center py-10 text-gray-500"><Loader2 className="h-6 w-6 inline animate-spin mr-2" /> Loading Doctor Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h2>
        <div className="text-sm text-gray-600">
          {/* Assuming user.doctorName exists after successful login */}
          Welcome back, Dr. {user?.doctorName || 'Doctor'}!
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-green-600 font-medium">Data Synced</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Patients</h3>
          <div className="space-y-4">
            {recentPatients.length > 0 ? recentPatients.map(patient => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{patient.name}</h4>
                  {/* Assuming age and gender exist on PatientInfo model */}
                  <p className="text-sm text-gray-600">{patient.age || 'N/A'} years, {patient.gender || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {/* Assuming registrationDate exists on PatientInfo model */}
                    {patient.registrationDate ? new Date(patient.registrationDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">No patients registered yet</p>
            )}
            
            {/* ⚠️ Warning about inefficient patient fetching */}
            {patientsList.length > 3 && (
                <p className="text-xs text-red-500 text-center pt-2 border-t">
                    Note: All patient records are currently loaded and filtered on the frontend.
                </p>
            )}
          </div>
        </div>

        {/* Treatment Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatment Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Treatments (Patients)</span>
              <div className="flex items-center">
                <div className="bg-green-100 w-4 h-4 rounded-full mr-2"></div>
                <span className="font-medium text-gray-900">{activePatients}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Completed Treatments (Patients)</span>
              <div className="flex items-center">
                <div className="bg-gray-100 w-4 h-4 rounded-full mr-2"></div>
                <span className="font-medium text-gray-900">{completedPatients}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-medium text-green-600">{successRate}%</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-gray-600">Total Patients Treated</span>
              <span className="font-bold text-blue-600">{totalPatients}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions (Keep as is, they are purely visual/routing) */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
        <p className="text-gray-600 mb-4">Manage your practice efficiently with these common tasks.</p>
        <div className="flex flex-wrap gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add New Patient
          </button>
          <button className="bg-white text-blue-600 border border-blue-300 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            View All Patients
          </button>
          <button className="bg-white text-blue-600 border border-blue-300 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Recent Prescriptions
          </button>
        </div>
      </div>
    </div>
  );
};


export default DoctorDashboard;


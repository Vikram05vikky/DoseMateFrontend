import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Activity, FileText, TrendingUp, Clock } from 'lucide-react';

// You will likely have a BASE_URL configured globally, but for now:
// const BASE_URL = 'http://localhost:8080'; // <-- Adjust this to your backend URL
const BASE_URL = 'http://65.2.69.70:8080';

const AdminDashboard = () => {
  // 1. Initialize state to hold all dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalDoctors: 0,
    approvedDoctors: 0,
    pendingDoctors: 0,
    totalPatients: 0,
    activeTreatments: 0,
    completedTreatments: 0,
    doctorsList: [] // For the "Recent Activity" section
  });
  
  const [loading, setLoading] = useState(true);

  // Function to fetch data from the backend
  const fetchData = async () => {
    setLoading(true);
    const data = {};

    // Array of all GET requests needed
    const endpoints = [
      { key: 'totalDoctors', url: '/admin/doctorCount' },
      { key: 'approvedDoctors', url: '/admin/doctorCount/approved' },
      { key: 'pendingDoctors', url: '/admin/doctorCount/pending' },
      { key: 'totalPatients', url: '/admin/patientCount' },
      { key: 'activeTreatments', url: '/admin/activePatientCount' },
      { key: 'completedTreatments', url: '/admin/completedPatientCount' },
      { key: 'doctorsList', url: '/admin/doctors' },
    ];

    try {
      // Use Promise.all to fetch all data concurrently for efficiency
      const promises = endpoints.map(async (endpoint) => {
        const response = await fetch(`${BASE_URL}${endpoint.url}`);
        // Handle successful response
        if (response.ok) {
          // Doctors list returns an array, counts return a number
          const result = await response.json();
          data[endpoint.key] = result;
        } else {
          // Handle 404 or other errors (set to 0 or empty array)
          console.error(`Failed to fetch ${endpoint.key}: ${response.statusText}`);
          data[endpoint.key] = endpoint.key === 'doctorsList' ? [] : 0;
        }
      });
      
      await Promise.all(promises);
      
      // Update the state with all fetched data
      setDashboardData(data);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // You might want to display an error message in the UI here
    } finally {
      setLoading(false);
    }
  };

  // 3. Call fetchData on component mount
    // 3. Call fetchData on component mount

  useEffect(() => {
    fetchData();
  }, []);

  const {
    totalDoctors,
    approvedDoctors,
    pendingDoctors,
    totalPatients,
    activeTreatments,
    completedTreatments,
    doctorsList
  } = dashboardData;

  // 4. Map the fetched data to the stats array
  const stats = [
    {
      title: 'Total Doctors',
      value: totalDoctors,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Approved Doctors',
      value: approvedDoctors,
      icon: UserCheck,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Patients',
      value: totalPatients,
      icon: Activity,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      // Renamed from 'Active Treatments' to align with backend endpoint
      title: 'Active Patients',
      value: activeTreatments,
      icon: TrendingUp,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      // Renamed from 'Completed Treatments' to align with backend endpoint
      title: 'Completed Patients',
      value: completedTreatments,
      icon: FileText,
      color: 'bg-teal-500',
      textColor: 'text-teal-600'
    },
    {
      title: 'Pending Approvals',
      value: pendingDoctors,
      icon: Clock,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading Admin Dashboard...</div>;
  }
  
  // Calculate derived values for system health
  const totalDoctorCount = totalDoctors; // Using the fetched value
  const approvalRate = totalDoctorCount > 0 
    ? Math.round((approvedDoctors / totalDoctorCount) * 100) 
    : 0;
  
  const totalTreatments = activeTreatments + completedTreatments;
  const activeRate = totalTreatments > 0
    ? Math.round((activeTreatments / totalTreatments) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <div className="text-sm text-gray-600">
          Welcome back, Admin! Here's your system overview.
        </div>
      </div>

      {/* Stats Grid (remains largely the same, but uses new 'stats' array) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  {/* Now displays the fetched count */}
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p> 
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div className={`h-2 w-2 rounded-full ${stat.color} mr-2`}></div>
                <span className={`text-sm ${stat.textColor} font-medium`}>
                  System Active
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {pendingDoctors > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="text-sm font-medium text-yellow-800">
              Action Required: {pendingDoctors} doctor{pendingDoctors !== 1 ? 's' : ''} pending approval
            </h3>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            Review and approve pending doctor registrations to keep the system running smoothly.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {/* Uses doctorsList fetched from /admin/doctors */}
            {doctorsList.slice(0, 3).map(doctor => (
              <div key={doctor.id} className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    // Doctor status is determined by the boolean 'approved' flag from the backend
                    doctor.approved === true 
                      ? 'bg-green-500'
                      : 'bg-yellow-500' 
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  Dr. {doctor.doctorName} - {doctor.specialization || 'N/A'}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    doctor.approved === true
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {/* Status text is derived from the 'approved' flag */}
                  {doctor.approved ? 'Approved' : 'Pending'}
                </span>
              </div>
            ))}
            {doctorsList.length === 0 && (
                 <p className="text-sm text-gray-500">No recent doctor activity found.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Doctor Approval Rate</span>
              <span className="text-sm font-medium text-green-600">
                {approvalRate}% 
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Treatment Rate</span>
              <span className="text-sm font-medium text-blue-600">
                {activeRate}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">System Status</span>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
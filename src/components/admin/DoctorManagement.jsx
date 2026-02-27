import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CheckCircle,
  XCircle,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Award,
  Users
} from 'lucide-react';

// const API_BASE = 'http://localhost:8080';
const BASE_URL = 'https://dimktqsi2kki8.cloudfront.net/';

// const BASE_URL = '/api';


const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // doctorId being acted on
  const [error, setError] = useState('');

  // Fetch doctors and patients
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [docRes, patRes] = await Promise.all([
        axios.get(`${API_BASE}/admin/doctors`),
        axios.get(`${API_BASE}/api/patient/all`)
      ]);
      setDoctors(Array.isArray(docRes.data) ? docRes.data : []);
      setPatients(Array.isArray(patRes.data) ? patRes.data : []);
    } catch (err) {
      console.error('Error fetching doctors or patients:', err);
      setError('Failed to load data from backend. Check server / CORS.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Approve doctor -> PUT /admin/approveDoctor/{doctorId}
  const handleApprove = async (doctorId) => {
    if (!window.confirm('Approve this doctor?')) return;
    setActionLoading(doctorId);
    setError('');
    try {
      await axios.put(`${API_BASE}/admin/approveDoctor/${doctorId}`);
      // update local state - backend sets approved = true
      setDoctors(d =>
        d.map(x =>
          (x.doctorId === doctorId || x.id === doctorId) ? { ...x, approved: true } : x
        )
      );
    } catch (err) {
      console.error('Approve error:', err);
      setError('Failed to approve doctor. Check backend logs.');
    } finally {
      setActionLoading(null);
    }
  };

  // Reject (delete) doctor -> DELETE /admin/rejectDoctor/{doctorId}
  const handleReject = async (doctorId) => {
    if (!window.confirm('Reject & delete this doctor? This action is permanent.')) return;
    setActionLoading(doctorId);
    setError('');
    try {
      await axios.delete(`${API_BASE}/admin/rejectDoctor/${doctorId}`);
      setDoctors(d => d.filter(x => !(x.doctorId === doctorId || x.id === doctorId)));
    } catch (err) {
      console.error('Reject error:', err);
      setError('Failed to reject/delete doctor.');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete (alias to reject endpoint as backend deletes on reject)
  const handleDelete = async (doctorId) => {
    if (!window.confirm('Delete this doctor permanently?')) return;
    setActionLoading(doctorId);
    setError('');
    try {
      await axios.delete(`${API_BASE}/admin/rejectDoctor/${doctorId}`);
      setDoctors(d => d.filter(x => !(x.doctorId === doctorId || x.id === doctorId)));
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete doctor.');
    } finally {
      setActionLoading(null);
    }
  };

  // Utility: compute patient count for a doctor (handles variations in patient JSON)
  const countPatientsForDoctor = (doctor) => {
  return doctor.patients ? doctor.patients.length : 0;
};

  const getStatusColor = (doctor) => {
    if (doctor.approved) return 'bg-green-100 text-green-800';
    if (doctor.status === 'rejected') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800'; // pending / default
  };

  const filteredDoctors = doctors.filter(doc => {
    if (filter === 'all') return true;
    if (filter === 'approved') return !!doc.approved;
    if (filter === 'rejected') return doc.status === 'rejected';
    if (filter === 'pending') return !doc.approved && doc.status !== 'rejected';
    return true;
  });

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading doctors…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Doctor Management</h2>
        <div className="flex space-x-2">
          {['all', 'pending', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                  {doctors.filter(d =>
                    status === 'approved' ? d.approved
                    : status === 'rejected' ? d.status === 'rejected'
                    : !d.approved && d.status !== 'rejected'
                  ).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-red-700 bg-red-50 p-3 rounded">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {filteredDoctors.map(doctor => {
          const doctorPatients = countPatientsForDoctor(doctor);
          const displayEmail = doctor.doctorEmail ?? doctor.email ?? doctor.emailAddress ?? 'N/A';
          const displayName = doctor.doctorName ?? doctor.name ?? 'Unknown';
          const docId = doctor.doctorId ?? doctor.id;

          return (
            <div key={docId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{displayName} </h3>
                    <p className="text-gray-600">{doctor.specialization || 'N/A'}</p>
                    <p className="flex items-center text-gray-600 text-sm mt-1">
                      <Users className="h-4 w-4 mr-1" /> {doctorPatients} Patient{doctorPatients !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doctor)}`}>
                  {doctor.approved ? 'approved' : (doctor.status || 'pending')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{displayEmail}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{doctor.phoneNo ?? doctor.phone ?? 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Registered: {doctor.registrationDate ? new Date(doctor.registrationDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">License:</span> {doctor.licenseNumber ?? 'N/A'}
                </div>

                <div className="flex space-x-2">
                  {!doctor.approved && doctor.status !== 'rejected' && (
                    <>
                      <button
                        disabled={actionLoading === docId}
                        onClick={() => handleApprove(docId)}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>{actionLoading === docId ? 'Approving…' : 'Approve'}</span>
                      </button>

                      <button
                        disabled={actionLoading === docId}
                        onClick={() => handleReject(docId)}
                        className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>{actionLoading === docId ? 'Rejecting…' : 'Reject & Delete'}</span>
                      </button>
                    </>
                  )}

                  <button
                    disabled={actionLoading === docId}
                    onClick={() => handleDelete(docId)}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{actionLoading === docId ? 'Deleting…' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
            <Award className="h-10 w-10 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-600">No doctors match the selected filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;




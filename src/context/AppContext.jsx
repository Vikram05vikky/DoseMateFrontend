

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8080';
const API_BASE_URL = 'https://dimktqsi2kki8.cloudfront.net/';

axios.defaults.baseURL = API_BASE_URL;

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const fetchAllDoctors = useCallback(async () => {
    try {
      const response = await axios.get('/admin/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  }, []);

  const fetchAllPatients = useCallback(async () => {
    try {
      const response = await axios.get('/api/patient/all');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  }, []);

  const fetchAllPrescriptions = useCallback(async () => {
    try {
      const response = await axios.get('/api/patient/history/all');
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    fetchAllDoctors();
    fetchAllPatients();
    fetchAllPrescriptions();
  }, [fetchAllDoctors, fetchAllPatients, fetchAllPrescriptions]);

  const adminLogin = async (email, password) => {
    try {
      const response = await axios.post('/admin/login', { adminName: email, password });
      if (response.data === 'Login Successful!') {
        const adminUser = { id: 1, role: 'admin', name: email, email };
        saveUser(adminUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

 const doctorLogin = async (email, password) => {
    try {
      const response = await axios.post('/api/doctor/login', { doctorEmail: email, password });
      
      // The backend returns the full Doctor object on success (HTTP 200)
      const doctorData = response.data;
      
      // Use the received doctor data directly for the user session
      const doctorUser = {
          id: doctorData.doctorId,
          role: 'doctor',
          name: doctorData.doctorName,
          email: doctorData.doctorEmail,
          // Note: Storing password is not recommended, but keeping for consistency if required by other parts of the app.
          password: doctorData.password 
      };
      saveUser(doctorUser);
      return { success: true };
      
    } catch (error) {
      console.error('Doctor login error:', error);
      
      // The backend returns a specific error message in the response body on failure (HTTP 400)
      const message = error.response 
                      ? error.response.data // Get message from backend (e.g., 'Invalid Email or Password!' or 'Doctor account not approved yet!')
                      : 'Cannot connect to server.';
                      
      return { success: false, message };
    }
  };

  const doctorRegister = async (doctorData) => {
    try {
      const response = await axios.post('/api/doctor/register', doctorData);
      if (response.data) {
        fetchAllDoctors();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error registering doctor:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        doctors,
        patients,
        prescriptions,
        adminLogin,
        doctorLogin,
        doctorRegister,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};


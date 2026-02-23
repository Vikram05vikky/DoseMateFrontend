import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Navigation from './components/Navigation';
// import './index.css'

// Auth Components
import AdminLogin from './components/auth/AdminLogin';
import DoctorLogin from './components/auth/DoctorLogin';
import DoctorRegister from './components/auth/DoctorRegister';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import DoctorManagement from './components/admin/DoctorManagement';
import PatientOverview from './components/admin/PatientOverview';
import PrescriptionView from './components/admin/PrescriptionView';

// Doctor Components
import DoctorDashboard from './components/doctor/DoctorDashboard';
import AddPatient from './components/doctor/AddPatient';
import PatientList from './components/doctor/PatientList';

function AppContent() {
  const { user, adminLogin, doctorLogin, doctorRegister } = useApp();
  const [activeTab, setActiveTab] = useState('admin-login');
  const [authView, setAuthView] = useState('admin-login'); // plain JS, no union types

  const renderContent = () => {
    if (user?.role === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'doctors':
          return <DoctorManagement />;
        case 'patients':
          return <PatientOverview />;
        case 'prescriptions':
          return <PrescriptionView />;
        default:
          return <AdminDashboard />;
      }
    } else if (user?.role === 'doctor') {
      switch (activeTab) {
        case 'dashboard':
          return <DoctorDashboard />;
        case 'add-patient':
          return <AddPatient />;
        case 'patient-list':
          return <PatientList />;
        default:
          return <DoctorDashboard />;
      }
    }
    return null;
  };

  if (!user) {
    switch (authView) {
      case 'admin-login':
        return (
          <AdminLogin
            onLogin={adminLogin}
            onSwitchToDoctor={() => setAuthView('doctor-login')}
          />
        );
      case 'doctor-login':
        return (
          <DoctorLogin
            onLogin={doctorLogin}
            onSwitchToRegister={() => setAuthView('doctor-register')}
            onSwitchToAdmin={() => setAuthView('admin-login')}
          />
        );
      case 'doctor-register':
        return (
          <DoctorRegister
            onRegister={doctorRegister}
            onSwitchToLogin={() => setAuthView('doctor-login')}
          />
        );
      default:
        return null;
    }
  }

  return (
    <Layout>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;



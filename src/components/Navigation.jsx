import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FileText, 
  UserPlus, 
  List,
  Shield,
  Stethoscope
} from 'lucide-react';

const Navigation = ({ activeTab, onTabChange }) => {
  const { user } = useApp();

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'doctors', label: 'Manage Doctors', icon: UserCheck },
    // { id: 'patients', label: 'Patient Overview', icon: Users },
    // { id: 'prescriptions', label: 'View Prescriptions', icon: FileText }
  ];

  const doctorTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-patient', label: 'Add Patient', icon: UserPlus },
    { id: 'patient-list', label: 'My Patients', icon: List }
  ];

  const tabs = user?.role === 'admin' ? adminTabs : doctorTabs;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {user?.role === 'admin' ? (
            <Shield className="h-5 w-5 text-blue-600" />
          ) : (
            <Stethoscope className="h-5 w-5 text-green-600" />
          )}
          <h3 className="text-lg font-semibold text-gray-900">
            {user?.role === 'admin' ? 'Admin Panel' : 'Doctor Portal'}
          </h3>
        </div>
      </div>
      
      <nav className="p-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Navigation;

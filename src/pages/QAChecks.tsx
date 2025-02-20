import React, { useState } from 'react';
import { Plus, Search, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface QACheck {
  id: number;
  name: string;
  description: string;
  status: 'Passed' | 'Failed' | 'In Review' | 'Blocked';
  project: string;
  assignee: {
    name: string;
    avatar: string;
  };
  lastRun: string;
  type: 'Functional' | 'Performance' | 'Security' | 'UI/UX';
}

const mockQAChecks: QACheck[] = [
  {
    id: 1,
    name: 'User Authentication Flow',
    description: 'Verify all user authentication scenarios',
    status: 'Passed',
    project: 'E-commerce Platform',
    assignee: {
      name: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    lastRun: '2024-03-05 14:30',
    type: 'Functional'
  },
  {
    id: 2,
    name: 'Payment Gateway Integration',
    description: 'Test payment processing and error handling',
    status: 'Failed',
    project: 'E-commerce Platform',
    assignee: {
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150'
    },
    lastRun: '2024-03-05 15:45',
    type: 'Functional'
  },
  {
    id: 3,
    name: 'Mobile Responsiveness',
    description: 'Check responsive design on various devices',
    status: 'In Review',
    project: 'Mobile App',
    assignee: {
      name: 'Emily Brown',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    },
    lastRun: '2024-03-05 16:20',
    type: 'UI/UX'
  }
];

const QAChecks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusIcon = (status: QACheck['status']) => {
    switch (status) {
      case 'Passed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'In Review':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Blocked':
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: QACheck['status']) => {
    switch (status) {
      case 'Passed':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'In Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Blocked':
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">QA Checks</h1>
        <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          <Plus size={20} />
          New QA Check
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search QA checks..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mockQAChecks.map((check) => (
          <div key={check.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <h3 className="text-lg font-semibold text-gray-800">{check.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(check.status)}`}>
                    {check.status}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">{check.description}</p>
              </div>
              <span className="text-sm text-gray-500">{check.type}</span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500">Project</p>
                  <p className="font-medium">{check.project}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Run</p>
                  <p className="font-medium">{check.lastRun}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={check.assignee.avatar}
                  alt={check.assignee.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">{check.assignee.name}</p>
                  <p className="text-xs text-gray-500">Assignee</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QAChecks;
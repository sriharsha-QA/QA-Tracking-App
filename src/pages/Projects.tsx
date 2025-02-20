import React, { useState } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2 } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Completed' | 'On Hold';
  progress: number;
  team: string[];
  startDate: string;
}

const mockProjects: Project[] = [
  {
    id: 1,
    name: 'E-commerce Platform',
    description: 'Building a modern e-commerce platform with React and Node.js',
    status: 'Active',
    progress: 75,
    team: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
           'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150'],
    startDate: '2024-01-15'
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description: 'Native mobile application for iOS and Android',
    status: 'Active',
    progress: 45,
    team: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
           'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
           'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'],
    startDate: '2024-02-01'
  },
  {
    id: 3,
    name: 'Analytics Dashboard',
    description: 'Real-time analytics dashboard for business metrics',
    status: 'Completed',
    progress: 100,
    team: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'],
    startDate: '2024-01-01'
  },
  {
    id: 4,
    name: 'Customer Portal',
    description: 'Self-service customer portal with support integration',
    status: 'On Hold',
    progress: 30,
    team: ['https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=150',
           'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150'],
    startDate: '2024-02-15'
  }
];

const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState<number | null>(null);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          <Plus size={20} />
          New Project
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(showDropdown === project.id ? null : project.id)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <MoreVertical size={20} className="text-gray-500" />
                </button>
                {showDropdown === project.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                      <Edit2 size={16} />
                      Edit Project
                    </button>
                    <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 flex items-center gap-2">
                      <Trash2 size={16} />
                      Delete Project
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="text-gray-600 mt-2 text-sm">{project.description}</p>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 rounded-full h-2"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex -space-x-2">
                {project.team.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt={`Team member ${index + 1}`}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
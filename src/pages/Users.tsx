import React, { useState } from 'react';
import { Plus, Search, MoreVertical, Mail, Phone, MapPin } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'QA Engineer' | 'Developer' | 'Project Manager';
  status: 'Active' | 'Inactive';
  avatar: string;
  phone: string;
  location: string;
  projects: number;
  lastActive: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    role: 'QA Engineer',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    projects: 5,
    lastActive: '2 hours ago'
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Developer',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
    phone: '+1 (555) 234-5678',
    location: 'New York, NY',
    projects: 3,
    lastActive: '5 minutes ago'
  },
  {
    id: 3,
    name: 'Emily Brown',
    email: 'emily.brown@example.com',
    role: 'Project Manager',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    phone: '+1 (555) 345-6789',
    location: 'Austin, TX',
    projects: 8,
    lastActive: '1 day ago'
  },
  {
    id: 4,
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    role: 'Admin',
    status: 'Inactive',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    phone: '+1 (555) 456-7890',
    location: 'Seattle, WA',
    projects: 0,
    lastActive: '2 weeks ago'
  }
];

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState<number | null>(null);

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'QA Engineer':
        return 'bg-blue-100 text-blue-800';
      case 'Developer':
        return 'bg-green-100 text-green-800';
      case 'Project Manager':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: User['status']) => {
    return status === 'Active' ? 'bg-green-500' : 'bg-gray-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          <Plus size={20} />
          Add User
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="qa">QA Engineer</option>
          <option value="developer">Developer</option>
          <option value="pm">Project Manager</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(showDropdown === user.id ? null : user.id)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <MoreVertical size={20} className="text-gray-500" />
                </button>
                {showDropdown === user.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                      Edit User
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                      Reset Password
                    </button>
                    <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">
                      Deactivate User
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} />
                <span className="text-sm">{user.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} />
                <span className="text-sm">{user.location}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Active Projects</p>
                  <p className="font-medium">{user.projects}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`} />
                  <span className="text-sm text-gray-500">Last active {user.lastActive}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;

export default Users
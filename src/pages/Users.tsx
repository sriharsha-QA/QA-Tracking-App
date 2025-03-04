import React, { useState } from 'react';
import { Plus, Search, MoreVertical, Mail, Phone, MapPin, Edit2, Trash2, Shield, Clock, Activity, AlertTriangle } from 'lucide-react';
import { useUserStore, User, UserActivity } from '../store/userStore';
import { Modal } from '../components/Modal';
import { UserForm } from '../components/forms/UserForm';
import { Tooltip } from '../components/Tooltip';

const Users: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, addUserActivity } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [newRole, setNewRole] = useState<User['role']>('Developer');

  const handleCreateUser = (userData: Omit<User, 'id'>) => {
    addUser(userData);
    setIsModalOpen(false);
  };

  const handleUpdateUser = (userData: Omit<User, 'id'>) => {
    if (selectedUser) {
      updateUser({ ...userData, id: selectedUser.id });
      setSelectedUser(null);
      setIsModalOpen(false);
    }
  };

  const handleDeleteUser = (id: number) => {
    deleteUser(id);
    setShowDeleteConfirm(false);
    setSelectedUser(null);
  };

  const handleChangeRole = () => {
    if (selectedUser) {
      updateUser({ ...selectedUser, role: newRole });
      
      // Add activity
      addUserActivity(selectedUser.id, {
        action: 'Role Changed',
        target: `from ${selectedUser.role} to ${newRole}`,
        timestamp: new Date().toISOString().replace('T', ' ').split('.')[0]
      });
      
      setShowRoleModal(false);
      setSelectedUser(null);
    }
  };

  const handleToggle2FA = () => {
    if (selectedUser) {
      const newStatus = !selectedUser.twoFactorEnabled;
      updateUser({ ...selectedUser, twoFactorEnabled: newStatus });
      
      // Add activity
      addUserActivity(selectedUser.id, {
        action: newStatus ? '2FA Enabled' : '2FA Disabled',
        target: 'Security Settings',
        timestamp: new Date().toISOString().replace('T', ' ').split('.')[0]
      });
      
      setShowSecurityModal(false);
      setSelectedUser(null);
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'QA Engineer':
        return 'bg-blue-100 text-blue-800';
      case 'Developer':
        return 'bg-indigo-100 text-indigo-800';
      case 'Project Manager':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase().replace(' ', '-') === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <button
          onClick={() => {
            setSelectedUser(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          data-tooltip-id="create-user-tooltip"
        >
          <Plus size={20} />
          Add User
        </button>
        <Tooltip id="create-user-tooltip" content="Create a new user" />
      </div>

      <div className="flex gap-4 flex-col md:flex-row">
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
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="qa-engineer">QA Engineer</option>
          <option value="developer">Developer</option>
          <option value="project-manager">Project Manager</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Security</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Phone size={16} className="mr-2 text-gray-400" />
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center">
                      <MapPin size={16} className="mr-2 text-gray-400" />
                      {user.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Shield size={16} className={user.twoFactorEnabled ? "text-green-500" : "text-gray-400"} />
                      <span className="ml-2 text-sm text-gray-500">
                        {user.twoFactorEnabled ? '2FA Enabled' : '2FA Disabled'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(showDropdown === user.id ? null : user.id)}
                        className="text-gray-400 hover:text-gray-600"
                        data-tooltip-id={`user-actions-${user.id}`}
                      >
                        <MoreVertical size={20} />
                      </button>
                      <Tooltip id={`user-actions-${user.id}`} content="User actions" />
                      {showDropdown === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsModalOpen(true);
                              setShowDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit2 size={16} />
                            Edit User
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowActivityModal(true);
                              setShowDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Activity size={16} />
                            View Activity
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setNewRole(user.role);
                              setShowRoleModal(true);
                              setShowDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Shield size={ 16} />
                            Manage Role
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowSecurityModal(true);
                              setShowDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Shield size={16} />
                            Security Settings
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteConfirm(true);
                              setShowDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            {user.status === 'Active' ? 'Deactivate User' : 'Delete User'}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        title={selectedUser ? 'Edit User' : 'Create New User'}
      >
        <UserForm
          user={selectedUser || undefined}
          onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedUser(null);
        }}
        title={selectedUser?.status === 'Active' ? 'Deactivate User' : 'Delete User'}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {selectedUser?.status === 'Active'
              ? 'Are you sure you want to deactivate this user? They will no longer have access to the system.'
              : 'Are you sure you want to delete this user? This action cannot be undone.'}
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setSelectedUser(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              {selectedUser?.status === 'Active' ? 'Deactivate' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>

      {/* User Activity Modal */}
      <Modal
        isOpen={showActivityModal}
        onClose={() => {
          setShowActivityModal(false);
          setSelectedUser(null);
        }}
        title="User Activity History"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium text-gray-900">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
              
              {selectedUser.activities && selectedUser.activities.length > 0 ? (
                <div className="space-y-3">
                  {selectedUser.activities.map((activity, index) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Activity size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.target}</p>
                      </div>
                      <span className="text-xs text-gray-400">{formatActivityTime(activity.timestamp)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No activity recorded for this user.</p>
              )}
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  setShowActivityModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Role Management Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setSelectedUser(null);
        }}
        title="Manage User Role"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium text-gray-900">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Role</label>
              <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                  {selectedUser.role}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as User['role'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Admin">Admin</option>
                <option value="QA Engineer">QA Engineer</option>
                <option value="Developer">Developer</option>
                <option value="Project Manager">Project Manager</option>
              </select>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              <div className="flex items-start gap-2">
                <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Role Change Warning</h4>
                  <p className="text-xs text-yellow-700 mt-1">
                    Changing a user's role will modify their permissions and access levels within the system.
                    Make sure the user is aware of these changes.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeRole}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={selectedUser.role === newRole}
              >
                Change Role
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Security Settings Modal */}
      <Modal
        isOpen={showSecurityModal}
        onClose={() => {
          setShowSecurityModal(false);
          setSelectedUser(null);
        }}
        title="Security Settings"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium text-gray-900">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Two-Factor Authentication (2FA)</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    {selectedUser.twoFactorEnabled ? '2FA is currently enabled' : '2FA is currently disabled'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedUser.twoFactorEnabled 
                      ? 'User must provide a verification code in addition to password when logging in.' 
                      : 'User only needs a password to log in.'}
                  </p>
                </div>
                <button
                  onClick={handleToggle2FA}
                  className={`px-4 py-2 rounded-md ${
                    selectedUser.twoFactorEnabled
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {selectedUser.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Password Management</h4>
              
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <Mail size={16} />
                Send Password Reset Email
              </button>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Last Login</h4>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {selectedUser.lastActive || 'No login recorded'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  setShowSecurityModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;
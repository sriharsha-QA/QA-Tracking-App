import React, { useState } from 'react';
import { Plus, Search, CheckCircle, XCircle, Clock, AlertCircle, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { useQACheckStore, QACheck } from '../store/qaCheckStore';
import { Modal } from '../components/Modal';
import { QACheckForm } from '../components/forms/QACheckForm';
import { Tooltip } from '../components/Tooltip';

const QAChecks: React.FC = () => {
  const { checks, addCheck, updateCheck, deleteCheck } = useQACheckStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState<QACheck | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCreateCheck = (checkData: Omit<QACheck, 'id'>) => {
    addCheck(checkData);
    setIsModalOpen(false);
  };

  const handleUpdateCheck = (checkData: Omit<QACheck, 'id'>) => {
    if (selectedCheck) {
      updateCheck({ ...checkData, id: selectedCheck.id });
      setSelectedCheck(null);
      setIsModalOpen(false);
    }
  };

  const handleDeleteCheck = (id: number) => {
    deleteCheck(id);
    setShowDeleteConfirm(false);
    setSelectedCheck(null);
  };

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

  const filteredChecks = checks.filter(check =>
    check.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    check.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">QA Checks</h1>
        <button
          onClick={() => {
            setSelectedCheck(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          data-tooltip-id="create-check-tooltip"
        >
          <Plus size={20} />
          New QA Check
        </button>
        <Tooltip id="create-check-tooltip" content="Create a new QA check" />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search QA checks..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e ) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredChecks.map((check) => (
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
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(showDropdown === check.id ? null : check.id)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                  data-tooltip-id={`check-actions-${check.id}`}
                >
                  <MoreVertical size={20} className="text-gray-500" />
                </button>
                <Tooltip id={`check-actions-${check.id}`} content="QA check actions" />
                {showDropdown === check.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                    <button
                      onClick={() => {
                        setSelectedCheck(check);
                        setIsModalOpen(true);
                        setShowDropdown(null);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit Check
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCheck(check);
                        setShowDeleteConfirm(true);
                        setShowDropdown(null);
                      }}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete Check
                    </button>
                  </div>
                )}
              </div>
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
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{check.type}</p>
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

      {/* Create/Edit QA Check Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCheck(null);
        }}
        title={selectedCheck ? 'Edit QA Check' : 'Create New QA Check'}
      >
        <QACheckForm
          check={selectedCheck || undefined}
          onSubmit={selectedCheck ? handleUpdateCheck : handleCreateCheck}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedCheck(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedCheck(null);
        }}
        title="Delete QA Check"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this QA check? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setSelectedCheck(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => selectedCheck && handleDeleteCheck(selectedCheck.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QAChecks;
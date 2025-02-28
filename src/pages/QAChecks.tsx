import React, { useState } from 'react';
import { Plus, Search, CheckCircle, XCircle, Clock, AlertCircle, Edit2, Trash2, MoreVertical, Link2, Bug } from 'lucide-react';
import { useQACheckStore, QACheck } from '../store/qaCheckStore';
import { useIssueStore } from '../store/issueStore';
import { useProjectStore } from '../store/projectStore';
import { Modal } from '../components/Modal';
import { QACheckForm } from '../components/forms/QACheckForm';
import { Tooltip } from '../components/Tooltip';
import { Link } from 'react-router-dom';

const QAChecks: React.FC = () => {
  const { checks, addCheck, updateCheck, deleteCheck } = useQACheckStore();
  const { issues } = useIssueStore();
  const { projects } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState<QACheck | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showLinkIssueModal, setShowLinkIssueModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null);

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

  const handleLinkIssue = () => {
    if (selectedCheck && selectedIssue !== null) {
      const issue = issues.find(i => i.id === selectedIssue);
      if (issue) {
        const updatedIssue = {
          ...issue,
          linkedQAChecks: [...(issue.linkedQAChecks || []), selectedCheck.id]
        };
        // Update the issue with the linked QA check
        useIssueStore.getState().updateIssue(updatedIssue);
        setShowLinkIssueModal(false);
        setSelectedIssue(null);
      }
    }
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

  const getTypeColor = (type: QACheck['type']) => {
    switch (type) {
      case 'Functional':
        return 'bg-blue-100 text-blue-800';
      case 'Performance':
        return 'bg-purple-100 text-purple-800';
      case 'Security':
        return 'bg-red-100 text-red-800';
      case 'UI/UX':
        return 'bg-indigo-100 text-indigo-800';
    }
  };

  const getLinkedIssues = (checkId: number) => {
    return issues.filter(issue => 
      issue.linkedQAChecks && issue.linkedQAChecks.includes(checkId)
    );
  };

  const filteredChecks = checks.filter(check => {
    const matchesSearch = check.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || check.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'all' || check.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesProject = projectFilter === 'all' || check.project === projectFilter;
    return matchesSearch && matchesStatus && matchesType && matchesProject;
  });

  // Calculate pass/fail rates for each project
  const getProjectStats = () => {
    const stats: Record<string, { total: number, passed: number, failed: number, inReview: number, blocked: number }> = {};
    
    checks.forEach(check => {
      if (!stats[check.project]) {
        stats[check.project] = { total: 0, passed: 0, failed: 0, inReview: 0, blocked: 0 };
      }
      
      stats[check.project].total += 1;
      
      switch (check.status) {
        case 'Passed':
          stats[check.project].passed += 1;
          break;
        case 'Failed':
          stats[check.project].failed += 1;
          break;
        case 'In Review':
          stats[check.project].inReview += 1;
          break;
        case 'Blocked':
          stats[check.project].blocked += 1;
          break;
      }
    });
    
    return stats;
  };

  const projectStats = getProjectStats();

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

      {/* Project Stats Summary */}
      {Object.keys(projectStats).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Project QA Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(projectStats).map(([project, stats]) => (
              <div key={project} className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium text-gray-700 mb-2">{project}</h3>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Pass Rate:</span>
                  <span className="text-sm font-medium">
                    {stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-green-500 rounded-full h-2"
                    style={{ width: `${stats.total > 0 ? (stats.passed / stats.total) * 100 : 0}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Passed: {stats.passed}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>Failed: {stats.failed}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span>In Review: {stats.inReview}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    <span>Blocked: {stats.blocked}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 flex-col md:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search QA checks..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 flex-wrap">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="in review">In Review</option>
            <option value="blocked">Blocked</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="functional">Functional</option>
            <option value="performance">Performance</option>
            <option value="security">Security</option>
            <option value="ui/ux">UI/UX</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.name}>{project.name}</option>
            ))}
          </select>
        </div>
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
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(check.type)}`}>
                    {check.type}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">{check.description}</p>
                
                {/* Linked Issues */}
                {getLinkedIssues(check.id).length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
                      <Bug size={14} />
                      Linked Issues:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getLinkedIssues(check.id).map(issue => (
                        <Link 
                          key={issue.id} 
                          to="/issues" 
                          className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"
                        >
                          {issue.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
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
                        setShowHistoryModal(true);
                        setShowDropdown(null);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Clock size={16} />
                      View History
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCheck(check);
                        setShowLinkIssueModal(true);
                        setShowDropdown(null);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Link2 size={16} />
                      Link to Issue
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

      {/* History Modal */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
        }}
        title="QA Check History"
      >
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800">{selectedCheck?.name}</h3>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tester</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Mock history data */}
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-500">{selectedCheck?.lastRun}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCheck?.status || 'In Review')}`}>
                      {selectedCheck?.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{selectedCheck?.assignee.name}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(new Date(selectedCheck?.lastRun || '').getTime() - 86400000 * 2).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      In Review
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{selectedCheck?.assignee.name}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(new Date(selectedCheck?.lastRun || '').getTime() - 86400000 * 5).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Failed
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{selectedCheck?.assignee.name}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => setShowHistoryModal(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Link to Issue Modal */}
      <Modal
        isOpen={showLinkIssueModal}
        onClose={() => {
          setShowLinkIssueModal(false);
          setSelectedIssue(null);
        }}
        title="Link to Issue"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Link QA check <strong>{selectedCheck?.name}</strong> to an issue
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Issue
            </label>
            <select
              value={selectedIssue || ''}
              onChange={(e) => setSelectedIssue(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an issue</option>
              {issues
                .filter(issue => 
                  issue.project === selectedCheck?.project && 
                  (!issue.linkedQAChecks || !issue.linkedQAChecks.includes(selectedCheck?.id || 0))
                )
                .map(issue => (
                  <option key={issue.id} value={issue.id}>
                    {issue.title} ({issue.status})
                  </option>
                ))
              }
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                setShowLinkIssueModal(false);
                setSelectedIssue(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleLinkIssue}
              disabled={selectedIssue === null}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Link to Issue
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QAChecks;
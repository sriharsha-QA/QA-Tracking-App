import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Paperclip,
  Edit2,
  Trash2,
  MoreVertical,
  ArrowRight,
} from "lucide-react";
import { useIssueStore, Issue } from "../store/issueStore";
import { Modal } from "../components/Modal";
import { IssueForm } from "../components/forms/IssueForm";
import { Tooltip } from "../components/Tooltip";

const Issues: React.FC = () => {
  const { issues, addIssue, updateIssue, deleteIssue } = useIssueStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCreateIssue = (issueData: Omit<Issue, "id">) => {
    addIssue(issueData);
    setIsModalOpen(false);
  };

  const handleUpdateIssue = (issueData: Omit<Issue, "id">) => {
    if (selectedIssue) {
      updateIssue({ ...issueData, id: selectedIssue.id });
      setSelectedIssue(null);
      setIsModalOpen(false);
    }
  };

  const handleDeleteIssue = (id: number) => {
    deleteIssue(id);
    setShowDeleteConfirm(false);
    setSelectedIssue(null);
  };

  const getStatusColor = (status: Issue["status"]) => {
    switch (status) {
      case "Open":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Closed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityIcon = (priority: Issue["priority"]) => {
    switch (priority) {
      case "High":
        return <ArrowUp className="w-4 h-4 text-red-500" />;
      case "Medium":
        return <ArrowRight className="w-4 h-4 text-yellow-500" />;
      case "Low":
        return <ArrowDown className="w-4 h-4 text-green-500" />;
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      issue.status.toLowerCase().replace(" ", "-") === statusFilter;
    const matchesPriority =
      priorityFilter === "all" ||
      issue.priority.toLowerCase() === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Issues</h1>
        <button
          onClick={() => {
            setSelectedIssue(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          data-tooltip-id="create-issue-tooltip"
        >
          <Plus size={20} />
          New Issue
        </button>
        <Tooltip id="create-issue-tooltip" content="Create a new issue" />
      </div>

      <div className="flex gap-4 flex-col md:flex-row">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search issues..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={20} className="text-gray-500" />
            More Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {issue.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {issue.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        issue.status
                      )}`}
                    >
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getPriorityIcon(issue.priority)}
                      <span className="ml-2 text-sm text-gray-900">
                        {issue.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {issue.project}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={issue.assignee.avatar}
                        alt={issue.assignee.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="ml-2 text-sm text-gray-900">
                        {issue.assignee.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {issue.created}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-gray-500">
                        <MessageSquare size={16} />
                        <span className="ml-1 text-sm">{issue.comments}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Paperclip size={16} />
                        <span className="ml-1 text-sm">
                          {issue.attachments}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowDropdown(
                            showDropdown === issue.id ? null : issue.id
                          )
                        }
                        className="text-gray-400 hover:text-gray-600"
                        data-tooltip-id={`issue-actions-${issue.id}`}
                      >
                        <MoreVertical size={20} />
                      </button>
                      <Tooltip
                        id={`issue-actions-${issue.id}`}
                        content="Issue actions"
                      />
                      {showDropdown === issue.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                          <button
                            onClick={() => {
                              setSelectedIssue(issue);
                              setIsModalOpen(true);
                              setShowDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit2 size={16} />
                            Edit Issue
                          </button>
                          <button
                            onClick={() => {
                              setSelectedIssue(issue);
                              setShowDeleteConfirm(true);
                              setShowDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Delete Issue
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

      {/* Create/Edit Issue Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIssue(null);
        }}
        title={selectedIssue ? "Edit Issue" : "Create New Issue"}
      >
        <IssueForm
          issue={selectedIssue || undefined}
          onSubmit={selectedIssue ? handleUpdateIssue : handleCreateIssue}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedIssue(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedIssue(null);
        }}
        title="Delete Issue"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this issue? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setSelectedIssue(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                selectedIssue && handleDeleteIssue(selectedIssue.id)
              }
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

export default Issues;

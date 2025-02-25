import React, { useState } from 'react';
import { Issue } from '../../store/issueStore';

interface IssueFormProps {
  issue?: Issue;
  onSubmit: (data: Omit<Issue, 'id'>) => void;
  onCancel: () => void;
}

export const IssueForm: React.FC<IssueFormProps> = ({ issue, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: issue?.title || '',
    description: issue?.description || '',
    status: issue?.status || 'Open',
    priority: issue?.priority || 'Medium',
    project: issue?.project || '',
    assignee: issue?.assignee || {
      name: '',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    created: issue?.created || new Date().toISOString().split('T')[0],
    comments: issue?.comments || 0,
    attachments: issue?.attachments || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Issue title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Issue description is required';
    }
    if (!formData.project.trim()) {
      newErrors.project = 'Project is required';
    }
    if (!formData.assignee.name.trim()) {
      newErrors.assignee = 'Assignee name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Issue Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`mt-1 block w-full rounded-md border ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          } shadow-sm p-2`}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className={`mt-1 block w-full rounded-md border ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } shadow-sm p-2`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Issue['status'] })}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
        >
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Priority</label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value as Issue['priority'] })}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Project</label>
        <input
          type="text"
          value={formData.project}
          onChange={(e) => setFormData({ ...formData, project: e.target.value })}
          className={`mt-1 block w-full rounded-md border ${
            errors.project ? 'border-red-500' : 'border-gray-300'
          } shadow-sm p-2`}
        />
        {errors.project && <p className="mt-1 text-sm text-red-600">{errors.project}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Assignee Name</label>
        <input
          type="text"
          value={formData.assignee.name}
          onChange={(e) => setFormData({
            ...formData,
            assignee: { ...formData.assignee, name: e.target.value }
          })}
          className={`mt-1 block w-full rounded-md border ${
            errors.assignee ? 'border-red-500' : 'border-gray-300'
          } shadow-sm p-2`}
        />
        {errors.assignee && <p className="mt-1 text-sm text-red-600">{errors.assignee}</p>}
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {issue ? 'Update Issue' : 'Create Issue'}
        </button>
      </div>
    </form>
  );
};
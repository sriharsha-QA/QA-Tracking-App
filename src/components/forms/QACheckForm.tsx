import React, { useState } from 'react';
import { QACheck } from '../../store/qaCheckStore';

interface QACheckFormProps {
  check?: QACheck;
  onSubmit: (data: Omit<QACheck, 'id'>) => void;
  onCancel: () => void;
}

export const QACheckForm: React.FC<QACheckFormProps> = ({ check, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: check?.name || '',
    description: check?.description || '',
    status: check?.status || 'In Review',
    project: check?.project || '',
    assignee: check?.assignee || {
      name: '',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    lastRun: check?.lastRun || new Date().toISOString().split('.')[0].replace('T', ' '),
    type: check?.type || 'Functional'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Check name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Check description is required';
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
        <label className="block text-sm font-medium text-gray-700">Check Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`mt-1 block w-full rounded-md border ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          } shadow-sm p-2`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
          onChange={(e) => setFormData({ ...formData, status: e.target.value as QACheck['status'] })}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
        >
          <option value="Passed">Passed</option>
          <option value="Failed">Failed</option>
          <option value="In Review">In Review</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as QACheck['type'] })}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
        >
          <option value="Functional">Functional</option>
          <option value="Performance">Performance</option>
          <option value="Security">Security</option>
          <option value="UI/UX">UI/UX</option>
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
          {check ? 'Update QA Check' : 'Create QA Check'}
        </button>
      </div>
    </form>
  );
};
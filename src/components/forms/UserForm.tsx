import React, { useState } from "react";
import { User } from "../../store/userStore";

interface UserFormProps {
  user?: User;
  onSubmit: (data: Omit<User, "id">) => void;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "Developer",
    status: user?.status || "Active",
    avatar:
      user?.avatar ||
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    phone: user?.phone || "",
    location: user?.location || "",
    department: user?.department || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (/^\d+$/.test(formData.name)) {
      newErrors.name = "Name cannot be just numbers";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[+]?[\d\s()-]{7,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    } else if (/^\d+$/.test(formData.location)) {
      newErrors.location = "Location cannot be just numbers";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    } else if (/^\d+$/.test(formData.department)) {
      newErrors.department = "Department cannot be just numbers";
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
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`mt-1 block w-full rounded-md border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } shadow-sm p-2`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`mt-1 block w-full rounded-md border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } shadow-sm p-2`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value as User["role"] })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
        >
          <option value="Admin">Admin</option>
          <option value="QA Engineer">QA Engineer</option>
          <option value="Developer">Developer</option>
          <option value="Project Manager">Project Manager</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value as User["status"],
            })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className={`mt-1 block w-full rounded-md border ${
            errors.phone ? "border-red-500" : "border-gray-300"
          } shadow-sm p-2`}
          placeholder="+1 (555) 123-4567"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className={`mt-1 block w-full rounded-md border ${
            errors.location ? "border-red-500" : "border-gray-300"
          } shadow-sm p-2`}
          placeholder="City, State"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Department
        </label>
        <input
          type="text"
          value={formData.department}
          onChange={(e) =>
            setFormData({ ...formData, department: e.target.value })
          }
          className={`mt-1 block w-full rounded-md border ${
            errors.department ? "border-red-500" : "border-gray-300"
          } shadow-sm p-2`}
        />
        {errors.department && (
          <p className="mt-1 text-sm text-red-600">{errors.department}</p>
        )}
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
          {user ? "Update User" : "Create User"}
        </button>
      </div>
    </form>
  );
};

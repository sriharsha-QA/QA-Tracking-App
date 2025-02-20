import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, ChevronDown } from 'lucide-react';

interface Report {
  id: number;
  name: string;
  type: 'Project' | 'Issues' | 'QA' | 'API';
  generated: string;
  size: string;
  format: 'PDF' | 'CSV' | 'Excel';
}

const mockReports: Report[] = [
  {
    id: 1,
    name: 'Project Status Overview',
    type: 'Project',
    generated: '2024-03-05 14:30',
    size: '2.5 MB',
    format: 'PDF'
  },
  {
    id: 2,
    name: 'Monthly Issues Summary',
    type: 'Issues',
    generated: '2024-03-04 09:15',
    size: '1.8 MB',
    format: 'Excel'
  },
  {
    id: 3,
    name: 'QA Testing Results',
    type: 'QA',
    generated: '2024-03-03 16:45',
    size: '956 KB',
    format: 'PDF'
  },
  {
    id: 4,
    name: 'API Performance Metrics',
    type: 'API',
    generated: '2024-03-02 11:20',
    size: '1.2 MB',
    format: 'CSV'
  }
];

const Reports: React.FC = () => {
  const [selectedType, setSelectedType] = useState('all');

  const getFormatColor = (format: Report['format']) => {
    switch (format) {
      case 'PDF':
        return 'text-red-600 bg-red-100';
      case 'CSV':
        return 'text-green-600 bg-green-100';
      case 'Excel':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Calendar size={20} className="text-gray-500" />
            <span>Date Range</span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>
          <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            <FileText size={20} />
            Generate Report
          </button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-500" />
          <span className="text-gray-600">Filter by type:</span>
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="project">Project</option>
          <option value="issues">Issues</option>
          <option value="qa">QA</option>
          <option value="api">API</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{report.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{report.generated}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{report.size}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFormatColor(report.format)}`}>
                      {report.format}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1 ml-auto">
                      <Download size={16} />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
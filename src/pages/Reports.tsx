import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, ChevronDown, BarChart3, PieChart, LineChart, Printer, Share2, Sliders } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { useIssueStore } from '../store/issueStore';
import { useQACheckStore } from '../store/qaCheckStore';
import { Modal } from '../components/Modal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';

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
  const { projects } = useProjectStore();
  const { issues } = useIssueStore();
  const { checks } = useQACheckStore();
  
  const [selectedType, setSelectedType] = useState('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [reportSettings, setReportSettings] = useState({
    title: '',
    type: 'project',
    project: '',
    dateRange: 'month',
    includeIssues: true,
    includeQAChecks: true,
    includeAPIPerformance: true,
    format: 'pdf'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

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

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      
      // Generate preview data based on report settings
      const previewData = generatePreviewData();
      setPreviewData(previewData);
      
      setShowGenerateModal(false);
      setShowPreviewModal(true);
    }, 2000);
  };

  const generatePreviewData = () => {
    // Generate mock data for report preview based on settings
    const selectedProject = projects.find(p => p.name === reportSettings.project);
    
    // Issues by status
    const issuesByStatus = [
      { name: 'Open', value: issues.filter(i => i.status === 'Open' && (!reportSettings.project || i.project === reportSettings.project)).length },
      { name: 'In Progress', value: issues.filter(i => i.status === 'In Progress' && (!reportSettings.project || i.project === reportSettings.project)).length },
      { name: 'Closed', value: issues.filter(i => i.status === 'Closed' && (!reportSettings.project || i.project === reportSettings.project)).length }
    ];
    
    // QA checks by status
    const qaChecksByStatus = [
      { name: 'Passed', value: checks.filter(c => c.status === 'Passed' && (!reportSettings.project || c.project === reportSettings.project)).length },
      { name: 'Failed', value: checks.filter(c => c.status === 'Failed' && (!reportSettings.project || c.project === reportSettings.project)).length },
      { name: 'In Review', value: checks.filter(c => c.status === 'In Review' && (!reportSettings.project || c.project === reportSettings.project)).length },
      { name: 'Blocked', value: checks.filter(c => c.status === 'Blocked' && (!reportSettings.project || c.project === reportSettings.project)).length }
    ];
    
    // API performance trend (mock data)
    const apiPerformanceTrend = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      apiPerformanceTrend.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        performance: Math.round(70 + Math.random() * 20),
        responseTime: (0.5 + Math.random()).toFixed(2)
      });
    }
    
    return {
      title: reportSettings.title || `${reportSettings.project || 'All Projects'} ${reportSettings.type.charAt(0).toUpperCase() + reportSettings.type.slice(1)} Report`,
      project: reportSettings.project || 'All Projects',
      dateRange: reportSettings.dateRange,
      issuesByStatus,
      qaChecksByStatus,
      apiPerformanceTrend,
      totalIssues: issues.filter(i => !reportSettings.project || i.project === reportSettings.project).length,
      totalQAChecks: checks.filter(c => !reportSettings.project || c.project === reportSettings.project).length,
      averageAPIPerformance: Math.round(75 + Math.random() * 15)
    };
  };

  const handleExportReport = (format: string) => {
    alert(`Report exported in ${format.toUpperCase()} format`);
    setShowPreviewModal(false);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
          <button 
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
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
              {mockReports
                .filter(report => selectedType === 'all' || report.type.toLowerCase().includes(selectedType))
                .map((report) => (
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
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setShowPreviewModal(true)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <FileText size={16} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Download size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Share2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Report Modal */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="Generate Custom Report"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Title</label>
            <input
              type="text"
              value={reportSettings.title}
              onChange={(e) => setReportSettings({...reportSettings, title: e.target.value})}
              placeholder="Enter report title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={reportSettings.type}
              onChange={(e) => setReportSettings({...reportSettings, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="project">Project Status</option>
              <option value="issues">Issues Summary</option>
              <option value="qa">QA Testing Results</option>
              <option value="api">API Performance</option>
              <option value="comprehensive">Comprehensive Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              value={reportSettings.project}
              onChange={(e) => setReportSettings({...reportSettings, project: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.name}>{project.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={reportSettings.dateRange}
              onChange={(e) => setReportSettings({...reportSettings, dateRange: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Include in Report:</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeIssues"
                  checked={reportSettings.includeIssues}
                  onChange={(e) => setReportSettings({...reportSettings, includeIssues: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="includeIssues" className="ml-2 block text-sm text-gray-900">
                  Issues and Status
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeQAChecks"
                  checked={reportSettings.includeQAChecks}
                  onChange={(e) => setReportSettings({...reportSettings, includeQAChecks: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="includeQAChecks" className="ml-2 block text-sm text-gray-900">
                  QA Check Results
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeAPIPerformance"
                  checked={reportSettings.includeAPIPerformance}
                  onChange={(e) => setReportSettings({...reportSettings, includeAPIPerformance: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="includeAPIPerformance" className="ml-2 block text-sm text-gray-900">
                  API Performance Metrics
                </label>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Export Format:</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setReportSettings({...reportSettings, format: 'pdf'})}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  reportSettings.format === 'pdf'
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}
              >
                PDF
              </button>
              <button
                type="button"
                onClick={() => setReportSettings({...reportSettings, format: 'excel'})}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  reportSettings.format === 'excel'
                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}
              >
                Excel
              </button>
              <button
                type="button"
                onClick={() => setReportSettings({...reportSettings, format: 'json'})}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  reportSettings.format === 'json'
                    ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}
              >
                JSON
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowGenerateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Report Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Report Preview"
      >
        {previewData ? (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-xl font-bold text-gray-800">{previewData.title}</h2>
              <p className="text-sm text-gray-500">
                Project: {previewData.project} | 
                Date Range: {previewData.dateRange === 'week' ? 'Last Week' : 
                            previewData.dateRange === 'month' ? 'Last Month' : 
                            previewData.dateRange === 'quarter' ? 'Last Quarter' : 'Last Year'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Issues</h3>
                <p className="text-3xl font-bold text-blue-600">{previewData.totalIssues}</p>
                <p className="text-sm text-blue-500">Total issues tracked</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">QA Checks</h3>
                <p className="text-3xl font-bold text-green-600">{previewData.totalQAChecks}</p>
                <p className="text-sm text-green-500">Total QA checks performed</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">API Performance</h3>
                <p className="text-3xl font-bold text-purple-600">{previewData.averageAPIPerformance}%</p>
                <p className="text-sm text-purple-500">Average performance score</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Issues by Status */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 size={20} className="text-blue-500" />
                  Issues by Status
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={previewData.issuesByStatus}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* QA Checks by Status */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <PieChart size={20} className="text-green-500" />
                  QA Checks by Status
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={previewData.qaChecksByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {previewData.qaChecksByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* API Performance Trend */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <LineChart size={20} className="text-purple-500" />
                API Performance Trend
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={previewData.apiPerformanceTrend}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="performance" stroke="#8884d8" name="Performance Score (%)" />
                    <Line yAxisId="right" type="monotone" dataKey="responseTime" stroke="#82ca9d" name="Response Time (s)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
                  <Printer size={16} />
                  Print
                </button>
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
                  <Share2 size={16} />
                  Share
                </button>
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
                  <Sliders size={16} />
                  Customize
                </button>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleExportReport('pdf')}
                  className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  <Download size={16} />
                  PDF
                </button>
                <button
                  onClick={() => handleExportReport('excel')}
                  className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  <Download size={16} />
                  Excel
                </button>
                <button
                  onClick={() => handleExportReport('json')}
                  className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                >
                  <Download size={16} />
                  JSON
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center">
            <h3 className="text-lg font-medium text-gray-700">Report Preview</h3>
            <p className="text-gray-500 mt-2">Select a report to preview or generate a new report.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Reports;
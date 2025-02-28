import React, { useState } from 'react';
import { Plus, Search, Filter, ArrowUp, ArrowDown, MessageSquare, Paperclip, Edit2, Trash2, MoreVertical, Sparkles, FileText, ArrowRight, Link2, CheckSquare } from 'lucide-react';
import { useIssueStore, Issue } from '../store/issueStore';
import { useProjectStore } from '../store/projectStore';
import { useQACheckStore } from '../store/qaCheckStore';
import { Modal } from '../components/Modal';
import { IssueForm } from '../components/forms/IssueForm';
import { Tooltip } from '../components/Tooltip';

const Issues: React.FC = () => {
  const { issues, addIssue, updateIssue, deleteIssue } = useIssueStore();
  const { projects } = useProjectStore();
  const { checks } = useQACheckStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'tickets' | 'documentation'>('tickets');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiType, setAiType] = useState<'bug' | 'task' | 'story' | 'doc' | 'release'>('bug');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showLinkQAModal, setShowLinkQAModal] = useState(false);
  const [selectedQACheck, setSelectedQACheck] = useState<number | null>(null);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [releaseVersion, setReleaseVersion] = useState('');
  const [releaseDate, setReleaseDate] = useState('');

  const handleCreateIssue = (issueData: Omit<Issue, 'id'>) => {
    addIssue(issueData);
    setIsModalOpen(false);
  };

  const handleUpdateIssue = (issueData: Omit<Issue, 'id'>) => {
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

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'Open':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: Issue['priority']) => {
    switch (priority) {
      case 'High':
        return <ArrowUp className="w-4 h-4 text-red-500" />;
      case 'Medium':
        return <ArrowRight className="w-4 h-4 text-yellow-500" />;
      case 'Low':
        return <ArrowDown className="w-4 h-4 text-green-500" />;
    }
  };

  const handleAiGenerate = () => {
    if (!aiPrompt.trim()) {
      return;
    }

    setAiLoading(true);
    
    // Simulate AI generation with a timeout
    setTimeout(() => {
      let result = '';
      
      if (aiType === 'bug') {
        result = `## Bug Report
        
**Title**: ${aiPrompt.split('.')[0] || 'UI Rendering Issue in Dashboard'}

**Description**:
${aiPrompt || 'When loading the dashboard with more than 10 projects, the UI elements overlap and become unreadable on mobile devices.'}

**Steps to Reproduce**:
1. Log in to the application
2. Navigate to the dashboard
3. Add more than 10 projects
4. View on a mobile device

**Expected Behavior**:
UI elements should adjust and remain readable regardless of the number of projects.

**Actual Behavior**:
UI elements overlap and become unreadable when there are more than 10 projects.

**Environment**:
- Browser: Chrome 98.0.4758.102
- OS: Windows 10
- Screen Resolution: 1920x1080

**Priority**: Medium
**Severity**: Medium

**Additional Information**:
This issue only occurs on mobile devices and tablets, desktop view works correctly.`;
      } else if (aiType === 'task') {
        result = `## Task

**Title**: ${aiPrompt.split('.')[0] || 'Implement User Authentication Flow'}

**Description**:
${aiPrompt || 'Create a secure authentication flow that includes login, registration, password reset, and email verification.'}

**Acceptance Criteria**:
1. Users can register with email and password
2. Users can log in with credentials
3. Users can reset their password via email
4. Email verification is required before first login
5. All forms have proper validation
6. Security best practices are implemented

**Estimated Effort**: Medium (3-5 days)

**Dependencies**:
- Email service integration
- User database schema

**Technical Notes**:
- Use JWT for authentication
- Implement rate limiting for login attempts
- Store passwords with bcrypt hashing`;
      } else if (aiType === 'story') {
        result = `## User Story

**Title**: ${aiPrompt.split('.')[0] || 'Dashboard Data Visualization'}

**As a**: Product Manager
**I want to**: view project metrics in visual charts and graphs
**So that**: I can quickly understand project status and make data-driven decisions

**Description**:
${aiPrompt || 'The dashboard should provide visual representations of key project metrics including progress, issues by status, team velocity, and quality metrics.'}

**Acceptance Criteria**:
1. Dashboard displays bar charts for issues by status
2. Line charts show progress over time
3. Pie charts display issue distribution by priority
4. All charts are interactive with hover tooltips
5. Data can be filtered by date range and project
6. Charts automatically update when data changes

**Business Value**:
Enables faster decision making and provides clear visibility into project health.

**Notes**:
Consider using Recharts for visualization components.`;
      } else if (aiType === 'doc') {
        result = `# Project Documentation

## Overview
${aiPrompt || 'The QA Tracking System is designed to streamline the quality assurance process by providing tools for tracking issues, managing projects, and monitoring API performance.'}

## System Architecture

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- Recharts for data visualization

### Backend
- Node.js with Express
- PostgreSQL database with Supabase
- RESTful API architecture
- JWT authentication

## Key Features
1. **Issue Tracking**
   - Create, update, and delete issues
   - Filter and search functionality
   - Priority and status management

2. **Project Management**
   - Project progress tracking
   - Team assignment
   - Status monitoring

3. **QA Checks**
   - Test case management
   - Automated and manual test tracking
   - Pass/fail reporting

4. **API Performance**
   - Endpoint monitoring
   - Response time tracking
   - Error rate analysis

## User Roles
- Administrators: Full system access
- QA Engineers: Test creation and execution
- Developers: Issue viewing and updating
- Project Managers: Reporting and overview

## Deployment
The application is deployed using Netlify for the frontend and Supabase for the backend services.

## Future Enhancements
- Mobile application
- Integration with CI/CD pipelines
- Advanced analytics dashboard`;
      } else if (aiType === 'release') {
        result = `# Release Notes - v1.2.0

## Release Date
June 15, 2025

## Overview
${aiPrompt || 'This release introduces several new features and improvements to the QA Tracking System, focusing on enhanced reporting capabilities, improved user experience, and better integration options.'}

## New Features
- **Advanced Reporting**: Generate custom reports with flexible parameters
- **Dashboard Widgets**: Customizable dashboard with drag-and-drop widgets
- **API Integration**: New endpoints for third-party integrations
- **Bulk Operations**: Perform actions on multiple issues simultaneously

## Improvements
- Improved search performance by 40%
- Enhanced mobile responsiveness across all modules
- Updated UI components for better accessibility
- Optimized database queries for faster loading times

## Bug Fixes
- Fixed issue with filter persistence between sessions
- Resolved date formatting inconsistencies in reports
- Fixed user permission issues for project managers
- Corrected calculation errors in performance metrics

## Technical Details
- Updated React to version 18.3
- Migrated to Tailwind CSS v3.4
- Implemented database indexing for performance
- Added comprehensive error logging

## Known Issues
- Chart rendering may be slow with very large datasets
- Some legacy reports are not compatible with the new format

## Upgrade Instructions
1. Backup your database before upgrading
2. Run the migration script included in the package
3. Clear browser cache after upgrading`;
      }
      
      setAiResult(result);
      setAiLoading(false);
    }, 2000);
  };

  const handleUseAiResult = () => {
    if (!aiResult) return;
    
    // For ticket types, create a new issue
    if (aiType === 'bug' || aiType === 'task' || aiType === 'story') {
      const lines = aiResult.split('\n');
      const titleLine = lines.find(line => line.includes('**Title**'))?.replace('**Title**:', '').trim() || 'AI Generated Issue';
      const descriptionLines = aiResult.split('**Description**:')[1]?.split('**')[0].trim() || 'AI generated description';
      
      const newIssue: Omit<Issue, 'id'> = {
        title: titleLine,
        description: descriptionLines,
        status: 'Open',
        priority: aiType === 'bug' ? 'High' : 'Medium',
        project: 'AI Generated',
        assignee: {
          name: 'AI Assignment',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
        },
        created: new Date().toISOString().split('T')[0],
        comments: 0,
        attachments: 0,
        release: '',
        linkedQAChecks: []
      };
      
      addIssue(newIssue);
    }
    
    setAiModalOpen(false);
    setAiPrompt('');
    setAiResult('');
  };

  const handleLinkQACheck = () => {
    if (selectedIssue && selectedQACheck !== null) {
      const updatedIssue = {
        ...selectedIssue,
        linkedQAChecks: [...(selectedIssue.linkedQAChecks || []), selectedQACheck]
      };
      updateIssue(updatedIssue);
      setShowLinkQAModal(false);
      setSelectedQACheck(null);
    }
  };

  const handleAddToRelease = () => {
    if (selectedIssue && releaseVersion) {
      const updatedIssue = {
        ...selectedIssue,
        release: releaseVersion
      };
      updateIssue(updatedIssue);
      setShowReleaseModal(false);
      setReleaseVersion('');
      setReleaseDate('');
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status.toLowerCase().replace(' ', '-') === statusFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority.toLowerCase() === priorityFilter;
    const matchesProject = projectFilter === 'all' || issue.project === projectFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  const getLinkedQAChecks = (issueId: number) => {
    const issue = issues.find(i => i.id === issueId);
    if (!issue || !issue.linkedQAChecks || issue.linkedQAChecks.length === 0) {
      return [];
    }
    
    return issue.linkedQAChecks.map(checkId => 
      checks.find(check => check.id === checkId)
    ).filter(Boolean);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Issues</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setAiModalOpen(true)}
            className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
            data-tooltip-id="ai-generate-tooltip"
          >
            <Sparkles size={20} />
            AI Generate
          </button>
          <Tooltip id="ai-generate-tooltip" content="Generate issues or documentation with AI" />
          
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
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'tickets'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('tickets')}
          >
            Tickets
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'documentation'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('documentation')}
          >
            Documentation
          </button>
        </div>
      </div>

      {activeTab === 'tickets' && (
        <>
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search issues..."
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Release</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIssues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                          <div className="text-sm text-gray-500">{issue.description}</div>
                          {issue.linkedQAChecks && issue.linkedQAChecks.length > 0 && (
                            <div className="mt-1 flex items-center gap-1">
                              <CheckSquare size={14} className="text-blue-500" />
                              <span className="text-xs text-blue-500">
                                {issue.linkedQAChecks.length} QA check{issue.linkedQAChecks.length > 1 ? 's' : ''} linked
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getPriorityIcon(issue.priority)}
                          <span className="ml-2 text-sm text-gray-900">{issue.priority}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{issue.project}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={issue.assignee.avatar}
                            alt={issue.assignee.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="ml-2 text-sm text-gray-900">{issue.assignee.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">{issue.created}</span>
                      </td>
                      <td className="px-6 py-4">
                        {issue.release ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {issue.release}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center text-gray-500">
                            <MessageSquare size={16} />
                            <span className="ml-1 text-sm">{issue.comments}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Paperclip size={16} />
                            <span className="ml-1 text-sm">{issue.attachments}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative">
                          <button
                            onClick={() => setShowDropdown(showDropdown === issue.id ? null : issue.id)}
                            className="text-gray-400 hover:text-gray-600"
                            data-tooltip-id={`issue-actions-${issue.id}`}
                          >
                            <MoreVertical size={20} />
                          </button>
                          <Tooltip id={`issue-actions-${issue.id}`} content="Issue actions" />
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
                                  setShowLinkQAModal(true);
                                  setShowDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Link2 size={16} />
                                Link QA Check
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedIssue(issue);
                                  setShowReleaseModal(true);
                                  setShowDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <FileText size={16} />
                                Add to Release
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
        </>
      )}

      {activeTab === 'documentation' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Project Documentation</h2>
            <button
              onClick={() => {
                setAiType('doc');
                setAiModalOpen(true);
              }}
              className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
            >
              <Sparkles size={20} />
              Generate Documentation
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="text-blue-500" size={24} />
                <h3 className="font-medium">Project Overview</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Comprehensive overview of the project scope, objectives, and timeline.</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Last updated: 2 days ago</span>
                <button className="text-blue-500 text-sm hover:underline">View</button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="text-green-500" size={24} />
                <h3 className="font-medium">Release Notes v1.2.0</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Detailed release notes for the latest version including new features and bug fixes.</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Last updated: 1 week ago</span>
                <button className="text-blue-500 text-sm hover:underline">View</button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="text-purple-500" size={24} />
                <h3 className="font-medium">API Documentation</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Technical documentation for API endpoints, request formats, and response schemas.</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Last updated: 3 days ago</span>
                <button className="text-blue-500 text-sm hover:underline">View</button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="text-yellow-500" size={24} />
                <h3 className="font-medium">User Guide</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Comprehensive guide for end users on how to use the application features.</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Last updated: 2 weeks ago</span>
                <button className="text-blue-500 text-sm hover:underline">View</button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="text-red-500" size={24} />
                <h3 className="font-medium">Testing Strategy</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Documentation of testing approach, test cases, and quality assurance procedures.</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Last updated: 5 days ago</span>
                <button className="text-blue-500 text-sm hover:underline">View</button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="text-indigo-500" size={24} />
                <h3 className="font-medium">Architecture Document</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Technical architecture documentation including system design and component interactions.</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Last updated: 1 month ago</span>
                <button className="text-blue-500 text-sm hover:underline">View</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Issue Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIssue(null);
        }}
        title={selectedIssue ? 'Edit Issue' : 'Create New Issue'}
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
            Are you sure you want to delete this issue? This action cannot be undone.
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
              onClick={() => selectedIssue && handleDeleteIssue(selectedIssue.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* AI Generation Modal */}
      <Modal
        isOpen={aiModalOpen}
        onClose={() => {
          setAiModalOpen(false);
          setAiPrompt('');
          setAiResult('');
        }}
        title="AI Generation"
      >
        <div className="space-y-4">
          {!aiResult ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {activeTab === 'tickets' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setAiType('bug')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          aiType === 'bug'
                            ? 'bg-red-100 text-red-800 border-2 border-red-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-300'
                        }`}
                      >
                        Bug Report
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiType('task')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          aiType === 'task'
                            ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-300'
                        }`}
                      >
                        Task
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiType('story')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          aiType === 'story'
                            ? 'bg-green-100 text-green-800 border-2 border-green-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-300'
                        }`}
                      >
                        User Story
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setAiType('doc')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          aiType === 'doc'
                            ? 'bg-purple-100 text-purple-800 border-2 border-purple-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-300'
                        }`}
                      >
                        Project Documentation
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiType('release')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          aiType === 'release'
                            ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-300'
                        }`}
                      >
                        Release Notes
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={5}
                  placeholder={
                    aiType === 'bug'
                      ? 'Describe the bug you encountered...'
                      : aiType === 'task'
                      ? 'Describe the task to be completed...'
                      : aiType === 'story'
                      ? 'Describe the user story...'
                      : aiType === 'doc'
                      ? 'Describe the project documentation needed...'
                      : 'Describe the release notes needed...'
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setAiModalOpen(false);
                    setAiPrompt('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={aiLoading}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {aiLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm">{aiResult}</pre>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setAiResult('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAiModalOpen(false);
                    setAiPrompt('');
                    setAiResult('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUseAiResult}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {aiType === 'bug' || aiType === 'task' || aiType === 'story' ? 'Create Issue' : 'Save Document'}
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Link QA Check Modal */}
      <Modal
        isOpen={showLinkQAModal}
        onClose={() => {
          setShowLinkQAModal(false);
          setSelectedQACheck(null);
        }}
        title="Link QA Check to Issue"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Link a QA check to issue: <strong>{selectedIssue?.title}</strong>
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select QA Check
            </label>
            <select
              value={selectedQACheck || ''}
              onChange={(e) => setSelectedQACheck(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a QA check</option>
              {checks
                .filter(check => 
                  !selectedIssue?.linkedQAChecks?.includes(check.id) && 
                  check.project === selectedIssue?.project
                )
                .map(check => (
                  <option key={check.id} value={check.id}>
                    {check.name} ({check.status})
                  </option>
                ))
              }
            </select>
          </div>
          
          {selectedIssue?.linkedQAChecks && selectedIssue.linkedQAChecks.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Currently Linked QA Checks:</h4>
              <ul className="space-y-2">
                {getLinkedQAChecks(selectedIssue.id).map(check => check && (
                  <li key={check.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{check.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      check.status === 'Passed' ? 'bg-green-100 text-green-800' :
                      check.status === 'Failed' ? 'bg-red-100 text-red-800' :
                      check.status === 'Blocked' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {check.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                setShowLinkQAModal(false);
                setSelectedQACheck(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleLinkQACheck}
              disabled={selectedQACheck === null}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Link QA Check
            </button>
          </div>
        </div>
      </Modal>

      {/* Add to Release Modal */}
      <Modal
        isOpen={showReleaseModal}
        onClose={() => {
          setShowReleaseModal(false);
          setReleaseVersion('');
          setReleaseDate('');
        }}
        title="Add Issue to Release"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Add issue <strong>{selectedIssue?.title}</strong> to a release version
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Release Version
            </label>
            <input
              type="text"
              value={releaseVersion}
              onChange={(e) => setReleaseVersion(e.target.value)}
              placeholder="e.g., v1.2.0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Release Date (Optional)
            </label>
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                setShowReleaseModal(false);
                setReleaseVersion('');
                setReleaseDate('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToRelease}
              disabled={!releaseVersion}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Release
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Issues;
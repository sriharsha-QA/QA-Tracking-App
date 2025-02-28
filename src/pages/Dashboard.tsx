import React from 'react';
import { BarChart3, Bug, CheckCircle, Clock, Activity, ArrowUpRight, Calendar, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useIssueStore } from '../store/issueStore';
import { useQACheckStore } from '../store/qaCheckStore';

const Dashboard: React.FC = () => {
  const { projects } = useProjectStore();
  const { issues } = useIssueStore();
  const { checks } = useQACheckStore();
  
  const stats = {
    totalProjects: projects.length,
    openIssues: issues.filter(issue => issue.status === 'Open').length,
    closedIssues: issues.filter(issue => issue.status === 'Closed').length,
    inProgressIssues: issues.filter(issue => issue.status === 'In Progress').length
  };

  const issuesTrend = [
    { name: 'Mon', issues: 4 },
    { name: 'Tue', issues: 7 },
    { name: 'Wed', issues: 5 },
    { name: 'Thu', issues: 8 },
    { name: 'Fri', issues: 12 },
    { name: 'Sat', issues: 3 },
    { name: 'Sun', issues: 5 }
  ];

  // Generate recent activity based on actual data
  const generateRecentActivity = () => {
    const activities = [];
    
    // Add recent issues
    if (issues.length > 0) {
      const recentIssues = [...issues].sort((a, b) => 
        new Date(b.created).getTime() - new Date(a.created).getTime()
      ).slice(0, 2);
      
      recentIssues.forEach(issue => {
        activities.push({
          id: `issue-${issue.id}`,
          action: `New issue reported: ${issue.title}`,
          project: issue.project,
          time: '2 hours ago',
          link: `/issues`
        });
      });
    }
    
    // Add recent QA checks
    if (checks.length > 0) {
      const recentChecks = [...checks].slice(0, 2);
      
      recentChecks.forEach(check => {
        activities.push({
          id: `check-${check.id}`,
          action: `QA check ${check.status.toLowerCase()}: ${check.name}`,
          project: check.project,
          time: '4 hours ago',
          link: `/qa-checks`
        });
      });
    }
    
    // Add recent projects
    if (projects.length > 0) {
      activities.push({
        id: `project-${projects[0].id}`,
        action: 'Project updated',
        project: projects[0].name,
        time: '1 day ago',
        link: `/projects`
      });
    }
    
    return activities.slice(0, 4);
  };

  const recentActivity = generateRecentActivity();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Calendar size={20} className="text-gray-500" />
            <span>Date Range</span>
          </button>
          <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            <Activity size={20} />
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/projects" className="block">
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Projects</p>
                <p className="text-2xl font-bold mt-2">{stats.totalProjects}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </Link>
        
        <Link to="/issues" className="block">
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Open Issues</p>
                <p className="text-2xl font-bold mt-2">{stats.openIssues}</p>
              </div>
              <div className="p-3 rounded-full bg-red-500">
                <Bug className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </Link>
        
        <Link to="/issues" className="block">
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Closed Issues</p>
                <p className="text-2xl font-bold mt-2">{stats.closedIssues}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </Link>
        
        <Link to="/issues" className="block">
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">In Progress</p>
                <p className="text-2xl font-bold mt-2">{stats.inProgressIssues}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Issues Trend</h2>
            <div className="flex items-center gap-2">
              <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
              <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                <option value="all">All Types</option>
                <option value="bug">Bugs</option>
                <option value="feature">Features</option>
                <option value="task">Tasks</option>
              </select>
              <button className="text-sm flex items-center gap-1 text-blue-600">
                <Filter size={14} />
                More
              </button>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issuesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="issues" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <Link 
                to={activity.link} 
                key={activity.id} 
                className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="bg-blue-100 p-2 rounded-full">
                  <ArrowUpRight className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.project}</p>
                </div>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
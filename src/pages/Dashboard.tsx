import React from 'react';
import { BarChart3, Bug, CheckCircle, Clock, Activity, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = {
  stats: {
    totalProjects: 12,
    openIssues: 24,
    closedIssues: 156,
    inProgressIssues: 8
  },
  issuesTrend: [
    { name: 'Mon', issues: 4 },
    { name: 'Tue', issues: 7 },
    { name: 'Wed', issues: 5 },
    { name: 'Thu', issues: 8 },
    { name: 'Fri', issues: 12 },
    { name: 'Sat', issues: 3 },
    { name: 'Sun', issues: 5 }
  ],
  recentActivity: [
    { id: 1, action: 'New issue reported', project: 'E-commerce Platform', time: '2 hours ago' },
    { id: 2, action: 'QA check completed', project: 'Mobile App', time: '4 hours ago' },
    { id: 3, action: 'Issue resolved', project: 'Analytics Dashboard', time: '5 hours ago' },
    { id: 4, action: 'New project created', project: 'Customer Portal', time: '1 day ago' }
  ]
};

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: React.ElementType; color: string }) => (
  <div className="bg-white rounded-lg p-6 shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          <Activity size={20} />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={mockData.stats.totalProjects}
          icon={BarChart3}
          color="bg-blue-500"
        />
        <StatCard
          title="Open Issues"
          value={mockData.stats.openIssues}
          icon={Bug}
          color="bg-red-500"
        />
        <StatCard
          title="Closed Issues"
          value={mockData.stats.closedIssues}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="In Progress"
          value={mockData.stats.inProgressIssues}
          icon={Clock}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Issues Trend</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.issuesTrend}>
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
            {mockData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="bg-blue-100 p-2 rounded-full">
                  <ArrowUpRight className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.project}</p>
                </div>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Clock, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

const mockPerformanceData = {
  responseTime: [
    { time: '00:00', value: 250 },
    { time: '04:00', value: 280 },
    { time: '08:00', value: 450 },
    { time: '12:00', value: 350 },
    { time: '16:00', value: 320 },
    { time: '20:00', value: 290 },
    { time: '24:00', value: 270 }
  ],
  errorRate: [
    { time: '00:00', value: 0.5 },
    { time: '04:00', value: 0.8 },
    { time: '08:00', value: 2.1 },
    { time: '12:00', value: 1.5 },
    { time: '16:00', value: 1.2 },
    { time: '20:00', value: 0.9 },
    { time: '24:00', value: 0.6 }
  ],
  recentErrors: [
    {
      id: 1,
      endpoint: '/api/users',
      error: '500 Internal Server Error',
      time: '5 minutes ago',
      count: 3
    },
    {
      id: 2,
      endpoint: '/api/products',
      error: '404 Not Found',
      time: '15 minutes ago',
      count: 1
    },
    {
      id: 3,
      endpoint: '/api/orders',
      error: '429 Too Many Requests',
      time: '30 minutes ago',
      count: 5
    }
  ]
};

const APIPerformance: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">API Performance</h1>
        <div className="flex gap-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            <Activity size={20} />
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold">320ms</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-gray-600">Error Rate</p>
              <p className="text-2xl font-bold">1.2%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-600">Uptime</p>
              <p className="text-2xl font-bold">99.9%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Response Time</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockPerformanceData.responseTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#93C5FD" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Error Rate</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockPerformanceData.errorRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#EF4444" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Errors</h2>
          <div className="space-y-4">
            {mockPerformanceData.recentErrors.map((error) => (
              <div key={error.id} className="flex items-start justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{error.endpoint}</p>
                  <p className="text-red-600">{error.error}</p>
                  <p className="text-sm text-gray-500">{error.time}</p>
                </div>
                <div className="bg-red-100 px-3 py-1 rounded-full">
                  <span className="text-red-800 font-medium">{error.count} occurrences</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIPerformance;
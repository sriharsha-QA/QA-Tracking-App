import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Clock, AlertTriangle, CheckCircle, Activity, Search, Loader2, Globe, Smartphone, Gauge, Zap, Trash2 } from 'lucide-react';
import { analyzeWebsite } from '../services/apiPerformance';
import { Tooltip } from '../components/Tooltip';
import { useProjectStore } from '../store/projectStore';

interface PerformanceMetrics {
  id: string;
  url: string;
  timestamp: string;
  performance_score: number;
  accessibility_score: number;
  best_practices_score: number;
  seo_score: number;
  loading_speed: number;
  mobile_friendly: boolean;
  errors: string[];
}

const APIPerformance: React.FC = () => {
  const { projects } = useProjectStore();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyMetrics, setHistoryMetrics] = useState<PerformanceMetrics[]>([]);
  const [selectedProjectUrl, setSelectedProjectUrl] = useState<string>('');

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('performanceHistory');
    if (savedHistory) {
      try {
        setHistoryMetrics(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('performanceHistory', JSON.stringify(historyMetrics));
  }, [historyMetrics]);

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      const result = await analyzeWebsite(url);
      
      // Add timestamp and URL to the metrics
      const metricsWithMeta: PerformanceMetrics = {
        ...result,
        id: Date.now().toString(),
        url,
        timestamp: new Date().toISOString()
      };
      
      setMetrics(metricsWithMeta);
      
      // Add to history
      setHistoryMetrics(prev => [metricsWithMeta, ...prev]);
    } catch (err) {
      setError('Failed to analyze website. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUrl = e.target.value;
    setSelectedProjectUrl(selectedUrl);
    if (selectedUrl) {
      setUrl(selectedUrl);
    }
  };

  const clearHistory = () => {
    setHistoryMetrics([]);
  };

  const deleteHistoryItem = (id: string) => {
    setHistoryMetrics(prev => prev.filter(item => item.id !== id));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">API Performance Analysis</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="url"
              placeholder="Enter website URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          
          <select
            value={selectedProjectUrl}
            onChange={handleProjectSelect}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select from projects</option>
            {projects
              .filter(project => project.appUrl)
              .map(project => (
                <option key={project.id} value={project.appUrl}>
                  {project.name}
                </option>
              ))}
          </select>
          
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            data-tooltip-id="analyze-tooltip"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Analyzing...
              </>
            ) : (
              <>
                <Activity size={20} />
                Analyze
              </>
            )}
          </button>
          <Tooltip id="analyze-tooltip" content="Analyze website performance and accessibility" />
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertTriangle size={20} />
            {error}
          </div>
        )}

        {metrics && (
          <div className="mt-8 space-y-8">
            {/* Performance Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg" data-tooltip-id="performance-tooltip">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Performance</h3>
                  <Zap className={getScoreColor(metrics.performance_score)} size={24} />
                </div>
                <p className={`text-3xl font-bold ${getScoreColor(metrics.performance_score)}`}>
                  {Math.round(metrics.performance_score)}%
                </p>
              </div>
              <Tooltip id="performance-tooltip" content="Overall performance score based on loading speed and resource optimization" />

              <div className="bg-gray-50 p-6 rounded-lg" data-tooltip-id="accessibility-tooltip">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Accessibility</h3>
                  <CheckCircle className={getScoreColor(metrics.accessibility_score)} size={24} />
                </div>
                <p className={`text-3xl font-bold ${getScoreColor(metrics.accessibility_score)}`}>
                  {Math.round(metrics.accessibility_score)}%
                </p>
              </div>
              <Tooltip id="accessibility-tooltip" content="Website accessibility compliance score" />

              <div className="bg-gray-50 p-6 rounded-lg" data-tooltip-id="practices-tooltip">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Best Practices</h3>
                  <Gauge className={getScoreColor(metrics.best_practices_score)} size={24} />
                </div>
                <p className={`text-3xl font-bold ${getScoreColor(metrics.best_practices_score)}`}>
                  {Math.round(metrics.best_practices_score)}%
                </p>
              </div>
              <Tooltip id="practices-tooltip" content="Adherence to web development best practices" />

              <div className="bg-gray-50 p-6 rounded-lg" data-tooltip-id="seo-tooltip">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">SEO</h3>
                  <Search className={getScoreColor(metrics.seo_score)} size={24} />
                </div>
                <p className={`text-3xl font-bold ${getScoreColor(metrics.seo_score)}`}>
                  {Math.round(metrics.seo_score)}%
                </p>
              </div>
              <Tooltip id="seo-tooltip" content="Search Engine Optimization score" />
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Loading Speed</h3>
                <div className="flex items-center gap-4">
                  <Clock size={24} className="text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{metrics.loading_speed.toFixed(2)}s</p>
                    <p className="text-sm text-gray-500">Average page load time</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Mobile Friendliness</h3>
                <div className="flex items-center gap-4">
                  <Smartphone size={24} className={metrics.mobile_friendly ? 'text-green-500' : 'text-red-500'} />
                  <div>
                    <p className="text-2xl font-bold">{metrics.mobile_friendly ? 'Optimized' : 'Needs Improvement'}</p>
                    <p className="text-sm text-gray-500">Mobile responsiveness status</p>
                  </div>
                </div>
              </div>
            </div>

            {metrics.errors.length > 0 && (
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-red-700">Issues Found</h3>
                <ul className="space-y-2">
                  {metrics.errors.map((error, index) => (
                    <li key={index} className="flex items-center gap-2 text-red-600">
                      <AlertTriangle size={16} />
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Historical Analysis */}
      {historyMetrics.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Analysis History</h2>
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Trash2 size={16} />
              Clear History
            </button>
          </div>

          {/* Performance Trend Chart */}
          {historyMetrics.length > 1 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[...historyMetrics].reverse().map(item => ({
                      date: new Date(item.timestamp).toLocaleDateString(),
                      performance: Math.round(item.performance_score),
                      accessibility: Math.round(item.accessibility_score),
                      practices: Math.round(item.best_practices_score),
                      seo: Math.round(item.seo_score)
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="performance" stroke="#3B82F6" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="accessibility" stroke="#10B981" />
                    <Line type="monotone" dataKey="practices" stroke="#F59E0B" />
                    <Line type="monotone" dataKey="seo" stroke="#6366F1" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {historyMetrics.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Globe size={16} className="text-gray-500" />
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-500 hover:underline font-medium"
                      >
                        {item.url.replace(/(^\w+:|^)\/\//, '').split('/')[0]}
                      </a>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Analyzed on {formatDate(item.timestamp)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Zap size={16} className={getScoreColor(item.performance_score)} />
                      <span className={`font-medium ${getScoreColor(item.performance_score)}`}>
                        {Math.round(item.performance_score)}%
                      </span>
                    </div>
                    <button
                      onClick={() => deleteHistoryItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                      data-tooltip-id={`delete-history-${item.id}`}
                    >
                      <Trash2 size={16} />
                    </button>
                    <Tooltip id={`delete-history-${item.id}`} content="Delete this record" />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mt-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Performance</p>
                    <p className={`font-medium ${getScoreColor(item.performance_score)}`}>
                      {Math.round(item.performance_score)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Accessibility</p>
                    <p className={`font-medium ${getScoreColor(item.accessibility_score)}`}>
                      {Math.round(item.accessibility_score)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Best Practices</p>
                    <p className={`font-medium ${getScoreColor(item.best_practices_score)}`}>
                      {Math.round(item.best_practices_score)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">SEO</p>
                    <p className={`font-medium ${getScoreColor(item.seo_score)}`}>
                      {Math.round(item.seo_score)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default APIPerformance;
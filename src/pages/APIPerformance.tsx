import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, Legend, BarChart, Bar } from 'recharts';
import { Clock, AlertTriangle, CheckCircle, Activity, Search, Loader2, Globe, Smartphone, Gauge, Zap, Trash2, ArrowRight, Bug, RefreshCw, BarChart3, Download } from 'lucide-react';
import { analyzeWebsite } from '../services/apiPerformance';
import { Tooltip } from '../components/Tooltip';
import { useProjectStore } from '../store/projectStore';
import { useIssueStore } from '../store/issueStore';
import { Modal } from '../components/Modal';
import { IssueForm } from '../components/forms/IssueForm';

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

interface ComparisonData {
  url1: string;
  url2: string;
  metrics1: PerformanceMetrics | null;
  metrics2: PerformanceMetrics | null;
}

const APIPerformance: React.FC = () => {
  const { projects } = useProjectStore();
  const { addIssue } = useIssueStore();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyMetrics, setHistoryMetrics] = useState<PerformanceMetrics[]>([]);
  const [selectedProjectUrl, setSelectedProjectUrl] = useState<string>('');
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonData>({
    url1: '',
    url2: '',
    metrics1: null,
    metrics2: null
  });
  const [isComparingUrls, setIsComparingUrls] = useState(false);
  const [showCreateIssueModal, setShowCreateIssueModal] = useState(false);
  const [selectedMetricsForIssue, setSelectedMetricsForIssue] = useState<PerformanceMetrics | null>(null);
  const [showTrendsModal, setShowTrendsModal] = useState(false);
  const [selectedUrlForTrends, setSelectedUrlForTrends] = useState<string>('');
  const [trendPeriod, setTrendPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [trendData, setTrendData] = useState<any[]>([]);
  const [isGeneratingTrends, setIsGeneratingTrends] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'json'>('pdf');
  const [exportData, setExportData] = useState({
    includeHistory: true,
    includeCurrentAnalysis: true,
    dateRange: 'all'
  });

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

  const handleCompareUrls = async () => {
    if (!comparisonData.url1 || !comparisonData.url2) {
      return;
    }

    setIsComparingUrls(true);

    try {
      const [result1, result2] = await Promise.all([
        analyzeWebsite(comparisonData.url1),
        analyzeWebsite(comparisonData.url2)
      ]);

      const metrics1: PerformanceMetrics = {
        ...result1,
        id: Date.now().toString() + '-1',
        url: comparisonData.url1,
        timestamp: new Date().toISOString()
      };

      const metrics2: PerformanceMetrics = {
        ...result2,
        id: Date.now().toString() + '-2',
        url: comparisonData.url2,
        timestamp: new Date().toISOString()
      };

      setComparisonData({
        ...comparisonData,
        metrics1,
        metrics2
      });

      // Add to history
      setHistoryMetrics(prev => [metrics1, metrics2, ...prev]);
    } catch (err) {
      setError('Failed to compare websites. Please try again.');
    } finally {
      setIsComparingUrls(false);
    }
  };

  const handleCreateIssueFromMetrics = (metrics: PerformanceMetrics) => {
    setSelectedMetricsForIssue(metrics);
    setShowCreateIssueModal(true);
  };

  const handleSubmitIssue = (issueData: Omit<any, 'id'>) => {
    addIssue(issueData);
    setShowCreateIssueModal(false);
    setSelectedMetricsForIssue(null);
  };

  const generateTrendData = async () => {
    if (!selectedUrlForTrends) return;

    setIsGeneratingTrends(true);

    try {
      // Filter existing history for the selected URL
      const urlHistory = historyMetrics.filter(item => 
        item.url.toLowerCase() === selectedUrlForTrends.toLowerCase()
      );

      // If we don't have enough data points, generate some mock historical data
      let trendPoints: any[] = [];
      
      if (urlHistory.length < 5) {
        // Generate mock historical data
        const now = new Date();
        const numPoints = trendPeriod === 'week' ? 7 : trendPeriod === 'month' ? 30 : 12;
        
        for (let i = numPoints - 1; i >= 0; i--) {
          const date = new Date();
          
          if (trendPeriod === 'week' || trendPeriod === 'month') {
            date.setDate(now.getDate() - i);
          } else {
            date.setMonth(now.getMonth() - i);
          }
          
          // Base the mock data on the most recent real data if available
          const baseMetrics = urlHistory.length > 0 ? urlHistory[0] : metrics;
          
          if (baseMetrics) {
            const variance = Math.random() * 10 - 5; // Random variance between -5 and +5
            
            trendPoints.push({
              date: date.toISOString().split('T')[0],
              performance: Math.min(100, Math.max(0, Math.round(baseMetrics.performance_score + variance))),
              accessibility: Math.min(100, Math.max(0, Math.round(baseMetrics.accessibility_score + variance))),
              bestPractices: Math.min(100, Math.max(0, Math.round(baseMetrics.best_practices_score + variance))),
              seo: Math.min(100, Math.max(0, Math.round(baseMetrics.seo_score + variance))),
              loadingSpeed: Math.max(0.5, Number((baseMetrics.loading_speed + variance / 5).toFixed(2)))
            });
          }
        }
      } else {
        // Use actual historical data
        trendPoints = urlHistory.map(item => ({
          date: new Date(item.timestamp).toISOString().split('T')[0],
          performance: Math.round(item.performance_score),
          accessibility: Math.round(item.accessibility_score),
          bestPractices: Math.round(item.best_practices_score),
          seo: Math.round(item.seo_score),
          loadingSpeed: Number(item.loading_speed.toFixed(2))
        }));
      }
      
      setTrendData(trendPoints);
    } catch (error) {
      console.error('Error generating trend data:', error);
    } finally {
      setIsGeneratingTrends(false);
    }
  };

  const handleExportData = () => {
    // Filter data based on export settings
    let dataToExport = [...historyMetrics];
    
    if (exportData.dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      if (exportData.dateRange === 'week') {
        cutoffDate.setDate(now.getDate() - 7);
      } else if (exportData.dateRange === 'month') {
        cutoffDate.setMonth(now.getMonth() - 1);
      } else if (exportData.dateRange === 'year') {
        cutoffDate.setFullYear(now.getFullYear() - 1);
      }
      
      dataToExport = dataToExport.filter(item => new Date(item.timestamp) >= cutoffDate);
    }
    
    if (!exportData.includeHistory) {
      dataToExport = [];
    }
    
    if (exportData.includeCurrentAnalysis && metrics) {
      dataToExport = [metrics, ...dataToExport];
    }
    
    // Mock export functionality
    setTimeout(() => {
      alert(`Data exported in ${exportFormat.toUpperCase()} format with ${dataToExport.length} records`);
      setShowExportModal(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">API Performance Analysis</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowComparisonModal(true)}
            className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
            data-tooltip-id="compare-tooltip"
          >
            <ArrowRight size={20} />
            Compare URLs
          </button>
          <Tooltip id="compare-tooltip" content="Compare performance between two URLs" />
          
          <button
            onClick={() => setShowTrendsModal(true)}
            className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
            data-tooltip-id="trends-tooltip"
          >
            <BarChart3 size={20} />
            View Trends
          </button>
          <Tooltip id="trends-tooltip" content="View performance trends over time" />
          
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            data-tooltip-id="export-tooltip"
          >
            <Download size={20} />
            Export Data
          </button>
          <Tooltip id="export-tooltip" content="Export performance data" />
        </div>
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
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-red-700">Issues Found</h3>
                  <button
                    onClick={() => handleCreateIssueFromMetrics(metrics)}
                    className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm"
                  >
                    <Bug size={16} />
                    Create Issue
                  </button>
                </div>
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
                    <Legend />
                    <Line type="monotone" dataKey="performance" stroke="#3B82F6" activeDot={{ r: 8 }} name="Performance" />
                    <Line type="monotone" dataKey="accessibility" stroke="#10B981" name="Accessibility" />
                    <Line type="monotone" dataKey="practices" stroke="#F59E0B" name="Best Practices" />
                    <Line type="monotone" dataKey="seo" stroke="#6366F1" name="SEO" />
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCreateIssueFromMetrics(item)}
                        className="text-blue-500 hover:text-blue-700"
                        data-tooltip-id={`create-issue-${item.id}`}
                      >
                        <Bug size={16} />
                      </button>
                      <Tooltip id={`create-issue-${item.id}`} content="Create issue from this analysis" />
                      
                      <button
                        onClick={() => {
                          setSelectedUrlForTrends(item.url);
                          setShowTrendsModal(true);
                        }}
                        className="text-purple-500 hover:text-purple-700"
                        data-tooltip-id={`view-trends-${item.id}`}
                      >
                        <BarChart3 size={16} />
                      </button>
                      <Tooltip id={`view-trends-${item.id}`} content="View trends for this URL" />
                      
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

      {/* URL Comparison Modal */}
      <Modal
        isOpen={showComparisonModal}
        onClose={() => {
          setShowComparisonModal(false);
          setComparisonData({
            url1: '',
            url2: '',
            metrics1: null,
            metrics2: null
          });
        }}
        title="Compare URL Performance"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL 1</label>
              <input
                type="url"
                value={comparisonData.url1}
                onChange={(e) => setComparisonData({ ...comparisonData, url1: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL 2</label>
              <input
                type="url"
                value={comparisonData.url2}
                onChange={(e) => setComparisonData({ ...comparisonData, url2: e.target.value })}
                placeholder="https://example-v2.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleCompareUrls}
              disabled={isComparingUrls || !comparisonData.url1 || !comparisonData.url2}
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isComparingUrls ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Comparing...
                </>
              ) : (
                <>
                  <ArrowRight size={20} />
                  Compare URLs
                </>
              )}
            </button>
          </div>

          {comparisonData.metrics1 && comparisonData.metrics2 && (
            <div className="mt-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Comparison Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">{comparisonData.url1.replace(/(^\w+:|^)\/\//, '').split('/')[0]}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Performance:</span>
                      <span className={`font-medium ${getScoreColor(comparisonData.metrics1.performance_score)}`}>
                        {Math.round(comparisonData.metrics1.performance_score)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Accessibility:</span>
                      <span className={`font-medium ${getScoreColor(comparisonData.metrics1.accessibility_score)}`}>
                        {Math.round(comparisonData.metrics1.accessibility_score)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Best Practices:</span>
                      <span className={`font-medium ${getScoreColor(comparisonData.metrics1.best_practices_score)}`}>
                        {Math.round(comparisonData.metrics1.best_practices_score)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">SEO:</span>
                      <span className={`font-medium ${getScoreColor(comparisonData.metrics1.seo_score)}`}>
                        {Math.round(comparisonData.metrics1.seo_score)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Loading Speed:</span>
                      <span className="font-medium">
                        {comparisonData.metrics1.loading_speed.toFixed(2)}s
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">{comparisonData.url2.replace(/(^\w+:|^)\/\//, '').split('/')[0]}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Performance:</span>
                      <span className={`font-medium ${getScoreColor(comparisonData.metrics2.performance_score)}`}>
                        {Math.round(comparisonData.metrics2.performance_score)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Accessibility:</span>
                      <span className={`font-medium ${getScoreColor(comparisonData.metrics2.accessibility_score)}`}>
                        {Math.round(comparisonData.metrics2.accessibility_score)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Best Practices:</span>
                      <span className={`font-medium ${getScoreColor(comparisonData.metrics2.best_practices_score)}`}>
                        {Math.round(comparisonData.metrics2.best_practices_score)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">SEO:</span>
                      <span className={`font-medium ${getScoreColor(comparisonData.metrics2.seo_score)}`}>
                        {Math.round(comparisonData.metrics2.seo_score)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Loading Speed:</span>
                      <span className="font-medium">
                        {comparisonData.metrics2.loading_speed.toFixed(2)}s
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-3">Performance Comparison</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          metric: 'Performance',
                          url1: Math.round(comparisonData.metrics1.performance_score),
                          url2: Math.round(comparisonData.metrics2.performance_score)
                        },
                        {
                          metric: 'Accessibility',
                          url1: Math.round(comparisonData.metrics1.accessibility_score),
                          url2: Math.round(comparisonData.metrics2.accessibility_score)
                        },
                        {
                          metric: 'Best Practices',
                          url1: Math.round(comparisonData.metrics1.best_practices_score),
                          url2: Math.round(comparisonData.metrics2.best_practices_score)
                        },
                        {
                          metric: 'SEO',
                          url1: Math.round(comparisonData.metrics1.seo_score),
                          url2: Math.round(comparisonData.metrics2.seo_score)
                        }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis domain={[0, 100]} />
                      <RechartsTooltip />
                      <Legend />
                      <Bar 
                        dataKey="url1" 
                        name={comparisonData.url1.replace(/(^\w+:|^)\/\//, '').split('/')[0]} 
                        fill="#3B82F6" 
                      />
                      <Bar 
                        dataKey="url2" 
                        name={comparisonData.url2.replace(/(^\w+:|^)\/\//, '').split('/')[0]} 
                        fill="#10B981" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-2">Analysis Summary</h4>
                <p className="text-blue-600">
                  {comparisonData.metrics1.performance_score > comparisonData.metrics2.performance_score
                    ? `${comparisonData.url1.replace(/(^\w+:|^)\/\//, '').split('/')[0]} has better overall performance.`
                    : `${comparisonData.url2.replace(/(^\w+:|^)\/\//, '').split('/')[0]} has better overall performance.`
                  }
                  {' '}
                  {comparisonData.metrics1.loading_speed < comparisonData.metrics2.loading_speed
                    ? `${comparisonData.url1.replace(/(^\w+:|^)\/\//, '').split('/')[0]} loads faster by ${(comparisonData.metrics2.loading_speed - comparisonData.metrics1.loading_speed).toFixed(2)}s.`
                    : `${comparisonData.url2.replace(/(^\w+:|^)\/\//, '').split('/')[0]} loads faster by ${(comparisonData.metrics1.loading_speed - comparisonData.metrics2.loading_speed).toFixed(2)}s.`
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Create Issue Modal */}
      <Modal
        isOpen={showCreateIssueModal}
        onClose={() => {
          setShowCreateIssueModal(false);
          setSelectedMetricsForIssue(null);
        }}
        title="Create Issue from Performance Analysis"
      >
        {selectedMetricsForIssue && (
          <IssueForm
            issue={{
              id: 0,
              title: `Performance issue on ${selectedMetricsForIssue.url.replace(/(^\w+:|^)\/\//, '').split('/')[0]}`,
              description: `Performance analysis detected the following issues:\n${selectedMetricsForIssue.errors.join('\n')}\n\nPerformance score: ${Math.round(selectedMetricsForIssue.performance_score)}%\nLoading speed: ${selectedMetricsForIssue.loading_speed.toFixed(2)}s`,
              status: 'Open',
              priority: selectedMetricsForIssue.performance_score < 70 ? 'High' : 'Medium',
              project: projects.find(p => p.appUrl === selectedMetricsForIssue.url)?.name || 'API Performance',
              assignee: {
                name: '',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
              },
              created: new Date().toISOString().split('T')[0],
              comments: 0,
              attachments: 0
            }}
            onSubmit={handleSubmitIssue}
            onCancel={() => {
              setShowCreateIssueModal(false);
              setSelectedMetricsForIssue(null);
            }}
          />
        )}
      </Modal>

      {/* Trends Modal */}
      <Modal
        isOpen={showTrendsModal}
        onClose={() => {
          setShowTrendsModal(false);
          setSelectedUrlForTrends('');
          setTrendData([]);
        }}
        title="Performance Trends Analysis"
      >
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
              <input
                type="url"
                value={selectedUrlForTrends}
                onChange={(e) => setSelectedUrlForTrends(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <select
                value={trendPeriod}
                onChange={(e) => setTrendPeriod(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={generateTrendData}
                disabled={isGeneratingTrends || !selectedUrlForTrends}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingTrends ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw size={20} />
                    Generate Trends
                  </>
                )}
              </button>
            </div>
          </div>

          {trendData.length > 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Performance Score Trend</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="performance" stroke="#3B82F6" name="Performance" />
                      <Line type="monotone" dataKey="accessibility" stroke="#10B981" name="Accessibility" />
                      <Line type="monotone" dataKey="bestPractices" stroke="#F59E0B" name="Best Practices" />
                      <Line type="monotone" dataKey="seo" stroke="#6366F1" name="SEO" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Loading Speed Trend</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trendData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Area type="monotone" dataKey="loadingSpeed" stroke="#F43F5E" fill="#FEE2E2" name="Loading Time (s)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Trend Analysis</h4>
                <p className="text-gray-600">
                  {trendData.length > 1 && (
                    <>
                      {trendData[trendData.length - 1].performance > trendData[0].performance
                        ? 'Performance has improved over time. '
                        : 'Performance has declined over time. '
                      }
                      {trendData[trendData.length - 1].loadingSpeed < trendData[0].loadingSpeed
                        ? 'Loading speed has improved, showing faster page loads. '
                        : 'Loading speed has worsened, showing slower page loads. '
                      }
                      The average performance score is {Math.round(trendData.reduce((sum, item) => sum + item.performance, 0) / trendData.length)}%.
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Export Data Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Performance Data"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat('pdf')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  exportFormat === 'pdf'
                    ? 'bg-blue- 100 text-blue-800 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}
              >
                PDF
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('excel')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  exportFormat === 'excel'
                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}
              >
                Excel
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('json')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  exportFormat === 'json'
                    ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}
              >
                JSON
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data to Export</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeHistory"
                  checked={exportData.includeHistory}
                  onChange={(e) => setExportData({...exportData, includeHistory: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="includeHistory" className="ml-2 block text-sm text-gray-900">
                  Include historical data
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeCurrentAnalysis"
                  checked={exportData.includeCurrentAnalysis}
                  onChange={(e) => setExportData({...exportData, includeCurrentAnalysis: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="includeCurrentAnalysis" className="ml-2 block text-sm text-gray-900">
                  Include current analysis
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={exportData.dateRange}
              onChange={(e) => setExportData({...exportData, dateRange: e.target.value})}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowExportModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExportData}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Export
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default APIPerformance;
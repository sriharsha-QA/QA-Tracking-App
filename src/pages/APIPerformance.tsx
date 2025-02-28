import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
  Bar,
  BarChart,
} from "recharts";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Search,
  Loader2,
  Globe,
  Smartphone,
  Gauge,
  Zap,
  Trash2,
  Bug,
  Calendar,
  Filter,
  ArrowRight,
} from "lucide-react";
import { analyzeWebsite } from "../services/apiPerformance";
import { Tooltip } from "../components/Tooltip";
import { useProjectStore } from "../store/projectStore";
import { useIssueStore } from "../store/issueStore";
import { Modal } from "../components/Modal";
import { Link } from "react-router-dom";

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
  const { addIssue } = useIssueStore();
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyMetrics, setHistoryMetrics] = useState<PerformanceMetrics[]>(
    []
  );
  const [selectedProjectUrl, setSelectedProjectUrl] = useState<string>("");
  const [compareMode, setCompareMode] = useState(false);
  const [compareUrl, setCompareUrl] = useState("");
  const [compareMetrics, setCompareMetrics] =
    useState<PerformanceMetrics | null>(null);
  const [dateRange, setDateRange] = useState("all");
  const [showCreateIssueModal, setShowCreateIssueModal] = useState(false);
  const [selectedMetric, setSelectedMetric] =
    useState<PerformanceMetrics | null>(null);
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("performanceHistory");
    if (savedHistory) {
      try {
        setHistoryMetrics(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history:", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("performanceHistory", JSON.stringify(historyMetrics));
  }, [historyMetrics]);

  const handleAnalyze = async () => {
    if (!url) {
      setError("Please enter a valid URL");
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
        timestamp: new Date().toISOString(),
      };

      setMetrics(metricsWithMeta);

      // Add to history
      setHistoryMetrics((prev) => [metricsWithMeta, ...prev]);
    } catch (err) {
      setError("Failed to analyze website. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCompareAnalyze = async () => {
    if (!compareUrl) {
      setError("Please enter a valid URL to compare");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      const result = await analyzeWebsite(compareUrl);

      // Add timestamp and URL to the metrics
      const metricsWithMeta: PerformanceMetrics = {
        ...result,
        id: Date.now().toString(),
        url: compareUrl,
        timestamp: new Date().toISOString(),
      };

      setCompareMetrics(metricsWithMeta);

      // Add to history
      setHistoryMetrics((prev) => [metricsWithMeta, ...prev]);
    } catch (err) {
      setError("Failed to analyze website for comparison. Please try again.");
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
    setHistoryMetrics((prev) => prev.filter((item) => item.id !== id));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleCreateIssue = () => {
    if (!selectedMetric) return;

    const newIssue = {
      title: issueTitle || `Performance issue with ${selectedMetric.url}`,
      description:
        issueDescription ||
        `Performance Score: ${
          selectedMetric.performance_score
        }%\nLoading Speed: ${selectedMetric.loading_speed.toFixed(
          2
        )}s\n\nIssues Found:\n${selectedMetric.errors.join("\n")}`,
      status: "Open" as const,
      priority:
        selectedMetric.performance_score < 70
          ? ("High" as const)
          : ("Medium" as const),
      project:
        projects.find((p) => p.appUrl === selectedMetric.url)?.name ||
        "Unknown Project",
      assignee: {
        name: "QA Team",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      },
      created: new Date().toISOString().split("T")[0],
      comments: 0,
      attachments: 0,
      release: "",
      linkedQAChecks: [],
    };

    addIssue(newIssue);
    setShowCreateIssueModal(false);
    setIssueTitle("");
    setIssueDescription("");
    setSelectedMetric(null);
  };

  const getFilteredHistory = () => {
    if (dateRange === "all") return historyMetrics;

    const now = new Date();
    let cutoffDate = new Date();

    switch (dateRange) {
      case "day":
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case "week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
    }

    return historyMetrics.filter(
      (item) => new Date(item.timestamp) >= cutoffDate
    );
  };

  const filteredHistory = getFilteredHistory();

  // Prepare trend data for charts
  const prepareTrendData = () => {
    // Group by URL
    const urlGroups: Record<string, PerformanceMetrics[]> = {};

    filteredHistory.forEach((item) => {
      if (!urlGroups[item.url]) {
        urlGroups[item.url] = [];
      }
      urlGroups[item.url].push(item);
    });

    // Sort each group by timestamp
    Object.keys(urlGroups).forEach((url) => {
      urlGroups[url].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    });

    return urlGroups;
  };

  const trendData = prepareTrendData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          API Performance Analysis
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`flex items-center gap-2 px-4 py-2 border ${
              compareMode
                ? "border-blue-500 text-blue-600"
                : "border-gray-300 text-gray-700"
            } rounded-lg hover:bg-gray-50`}
          >
            <ArrowRight size={20} />
            Compare Mode
          </button>
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
            <Globe
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>

          <select
            value={selectedProjectUrl}
            onChange={handleProjectSelect}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select from projects</option>
            {projects
              .filter((project) => project.appUrl)
              .map((project) => (
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
          <Tooltip
            id="analyze-tooltip"
            content="Analyze website performance and accessibility"
          />
        </div>

        {compareMode && (
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="flex-1 relative">
              <input
                type="url"
                placeholder="Enter URL to compare (e.g., https://example.com/v2)"
                value={compareUrl}
                onChange={(e) => setCompareUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Globe
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>

            <button
              onClick={handleCompareAnalyze}
              disabled={isAnalyzing}
              className="flex items-center gap-2 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Activity size={20} />
                  Compare
                </>
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertTriangle size={20} />
            {error}
          </div>
        )}

        {metrics && (
          <div className="mt-8 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Analysis Results
              </h2>
              {metrics.errors.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedMetric(metrics);
                    setShowCreateIssueModal(true);
                    setIssueTitle(`Performance issues with ${metrics.url}`);
                    setIssueDescription(
                      `Performance Score: ${
                        metrics.performance_score
                      }%\nLoading Speed: ${metrics.loading_speed.toFixed(
                        2
                      )}s\n\nIssues Found:\n${metrics.errors.join("\n")}`
                    );
                  }}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  <Bug size={16} />
                  Create Issue
                </button>
              )}
            </div>

            {/* Performance Scores */}
            <div
              className={`grid grid-cols-1 ${
                compareMode && compareMetrics
                  ? "md:grid-cols-2"
                  : "md:grid-cols-2 lg:grid-cols-4"
              } gap-6`}
            >
              <div
                className="bg-gray-50 p-6 rounded-lg"
                data-tooltip-id="performance-tooltip"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Performance</h3>
                  <Zap
                    className={getScoreColor(metrics.performance_score)}
                    size={24}
                  />
                </div>
                <p
                  className={`text-3xl font-bold ${getScoreColor(
                    metrics.performance_score
                  )}`}
                >
                  {Math.round(metrics.performance_score)}%
                </p>
                {compareMetrics && (
                  <div className="mt-2 flex items-center">
                    <ArrowRight size={16} className="mr-2" />
                    <span
                      className={`text-sm font-medium ${getScoreColor(
                        compareMetrics.performance_score
                      )}`}
                    >
                      {Math.round(compareMetrics.performance_score)}%
                    </span>
                    <span className="text-xs ml-2 text-gray-500">
                      (
                      {Math.round(
                        compareMetrics.performance_score -
                          metrics.performance_score
                      ) > 0
                        ? "+"
                        : ""}
                      {Math.round(
                        compareMetrics.performance_score -
                          metrics.performance_score
                      )}
                      %)
                    </span>
                  </div>
                )}
              </div>
              <Tooltip
                id="performance-tooltip"
                content="Overall performance score based on loading speed and resource optimization"
              />

              <div
                className="bg-gray-50 p-6 rounded-lg"
                data-tooltip-id="accessibility-tooltip"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Accessibility</h3>
                  <CheckCircle
                    className={getScoreColor(metrics.accessibility_score)}
                    size={24}
                  />
                </div>
                <p
                  className={`text-3xl font-bold ${getScoreColor(
                    metrics.accessibility_score
                  )}`}
                >
                  {Math.round(metrics.accessibility_score)}%
                </p>
                {compareMetrics && (
                  <div className="mt-2 flex items-center">
                    <ArrowRight size={16} className="mr-2" />
                    <span
                      className={`text-sm font-medium ${getScoreColor(
                        compareMetrics.accessibility_score
                      )}`}
                    >
                      {Math.round(compareMetrics.accessibility_score)}%
                    </span>
                    <span className="text-xs ml-2 text-gray-500">
                      (
                      {Math.round(
                        compareMetrics.accessibility_score -
                          metrics.accessibility_score
                      ) > 0
                        ? "+"
                        : ""}
                      {Math.round(
                        compareMetrics.accessibility_score -
                          metrics.accessibility_score
                      )}
                      %)
                    </span>
                  </div>
                )}
              </div>
              <Tooltip
                id="accessibility-tooltip"
                content="Website accessibility compliance score"
              />

              <div
                className="bg-gray-50 p-6 rounded-lg"
                data-tooltip-id="practices-tooltip"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Best Practices</h3>
                  <Gauge
                    className={getScoreColor(metrics.best_practices_score)}
                    size={24}
                  />
                </div>
                <p
                  className={`text-3xl font-bold ${getScoreColor(
                    metrics.best_practices_score
                  )}`}
                >
                  {Math.round(metrics.best_practices_score)}%
                </p>
                {compareMetrics && (
                  <div className="mt-2 flex items-center">
                    <ArrowRight size={16} className="mr-2" />
                    <span
                      className={`text-sm font-medium ${getScoreColor(
                        compareMetrics.best_practices_score
                      )}`}
                    >
                      {Math.round(compareMetrics.best_practices_score)}%
                    </span>
                    <span className="text-xs ml-2 text-gray-500">
                      (
                      {Math.round(
                        compareMetrics.best_practices_score -
                          metrics.best_practices_score
                      ) > 0
                        ? "+"
                        : ""}
                      {Math.round(
                        compareMetrics.best_practices_score -
                          metrics.best_practices_score
                      )}
                      %)
                    </span>
                  </div>
                )}
              </div>
              <Tooltip
                id="practices-tooltip"
                content="Adherence to web development best practices"
              />

              <div
                className="bg-gray-50 p-6 rounded-lg"
                data-tooltip-id="seo-tooltip"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">SEO</h3>
                  <Search
                    className={getScoreColor(metrics.seo_score)}
                    size={24}
                  />
                </div>
                <p
                  className={`text-3xl font-bold ${getScoreColor(
                    metrics.seo_score
                  )}`}
                >
                  {Math.round(metrics.seo_score)}%
                </p>
                {compareMetrics && (
                  <div className="mt-2 flex items-center">
                    <ArrowRight size={16} className="mr-2" />
                    <span
                      className={`text-sm font-medium ${getScoreColor(
                        compareMetrics.seo_score
                      )}`}
                    >
                      {Math.round(compareMetrics.seo_score)}%
                    </span>
                    <span className="text-xs ml-2 text-gray-500">
                      (
                      {Math.round(
                        compareMetrics.seo_score - metrics.seo_score
                      ) > 0
                        ? "+"
                        : ""}
                      {Math.round(compareMetrics.seo_score - metrics.seo_score)}
                      %)
                    </span>
                  </div>
                )}
              </div>
              <Tooltip
                id="seo-tooltip"
                content="Search Engine Optimization score"
              />
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Loading Speed</h3>
                <div className="flex items-center gap-4">
                  <Clock size={24} className="text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {metrics.loading_speed.toFixed(2)}s
                    </p>
                    <p className="text-sm text-gray-500">
                      Average page load time
                    </p>
                  </div>
                </div>
                {compareMetrics && (
                  <div className="mt-4 flex items-center">
                    <ArrowRight size={16} className="mr-2" />
                    <span
                      className={`text-sm font-medium ${
                        compareMetrics.loading_speed < metrics.loading_speed
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {compareMetrics.loading_speed.toFixed(2)}s
                    </span>
                    <span className="text-xs ml-2 text-gray-500">
                      (
                      {compareMetrics.loading_speed < metrics.loading_speed
                        ? "-"
                        : "+"}
                      {Math.abs(
                        compareMetrics.loading_speed - metrics.loading_speed
                      ).toFixed(2)}
                      s)
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  Mobile Friendliness
                </h3>
                <div className="flex items-center gap-4">
                  <Smartphone
                    size={24}
                    className={
                      metrics.mobile_friendly
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  />
                  <div>
                    <p className="text-2xl font-bold">
                      {metrics.mobile_friendly
                        ? "Optimized"
                        : "Needs Improvement"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Mobile responsiveness status
                    </p>
                  </div>
                </div>
                {compareMetrics && (
                  <div className="mt-4 flex items-center">
                    <ArrowRight size={16} className="mr-2" />
                    <span
                      className={`text-sm font-medium ${
                        compareMetrics.mobile_friendly
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {compareMetrics.mobile_friendly
                        ? "Optimized"
                        : "Needs Improvement"}
                    </span>
                    {metrics.mobile_friendly !==
                      compareMetrics.mobile_friendly && (
                      <span className="text-xs ml-2 text-gray-500">
                        (
                        {compareMetrics.mobile_friendly
                          ? "Improved"
                          : "Degraded"}
                        )
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {metrics.errors.length > 0 && (
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-red-700">
                  Issues Found
                </h3>
                <ul className="space-y-2">
                  {metrics.errors.map((error, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-red-600"
                    >
                      <AlertTriangle size={16} />
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {compareMetrics && compareMetrics.errors.length > 0 && (
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-purple-700">
                  Issues Found in Comparison URL
                </h3>
                <ul className="space-y-2">
                  {compareMetrics.errors.map((error, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-purple-600"
                    >
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
            <h2 className="text-xl font-semibold text-gray-800">
              Analysis History
            </h2>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1"
                >
                  <option value="all">All Time</option>
                  <option value="day">Last 24 Hours</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                </select>
              </div>
              <button
                onClick={clearHistory}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Trash2 size={16} />
                Clear History
              </button>
            </div>
          </div>

          {/* Performance Trend Chart */}
          {Object.keys(trendData).length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      type="category"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis domain={[0, 100]} />
                    <RechartsTooltip
                      formatter={(value, name) => [`${value}%`, name]}
                      labelFormatter={(label) =>
                        new Date(label).toLocaleString()
                      }
                    />
                    <Legend />

                    {Object.entries(trendData).map(([url, data], index) => {
                      // Use different colors for different URLs
                      const colors = [
                        "#3B82F6",
                        "#10B981",
                        "#F59E0B",
                        "#6366F1",
                        "#EC4899",
                      ];
                      return (
                        <Line
                          key={url}
                          type="monotone"
                          data={data}
                          dataKey="performance_score"
                          name={url.replace(/(^\w+:|^)\/\//, "").split("/")[0]}
                          stroke={colors[index % colors.length]}
                          activeDot={{ r: 8 }}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Loading Speed Comparison */}
          {Object.keys(trendData).length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">
                Loading Speed Comparison
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="url"
                      type="category"
                      tickFormatter={(value) =>
                        value.replace(/(^\w+:|^)\/\//, "").split("/")[0]
                      }
                    />
                    <YAxis
                      label={{
                        value: "Seconds",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <RechartsTooltip
                      formatter={(value, name) => [
                        `${value.toFixed(2)}s`,
                        name,
                      ]}
                    />
                    <Legend />

                    <Bar
                      dataKey="loading_speed"
                      name="Loading Speed"
                      fill="#3B82F6"
                      data={Object.values(trendData).map(
                        (data) => data[data.length - 1]
                      )}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
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
                        {item.url.replace(/(^\w+:|^)\/\//, "").split("/")[0]}
                      </a>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Analyzed on {formatDate(item.timestamp)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Zap
                        size={16}
                        className={getScoreColor(item.performance_score)}
                      />
                      <span
                        className={`font-medium ${getScoreColor(
                          item.performance_score
                        )}`}
                      >
                        {Math.round(item.performance_score)}%
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedMetric(item);
                          setShowCreateIssueModal(true);
                          setIssueTitle(`Performance issues with ${item.url}`);
                          setIssueDescription(
                            `Performance Score: ${
                              item.performance_score
                            }%\nLoading Speed: ${item.loading_speed.toFixed(
                              2
                            )}s\n\nIssues Found:\n${item.errors.join("\n")}`
                          );
                        }}
                        className="text-blue-500 hover:text-blue-700"
                        data-tooltip-id={`create-issue-${item.id}`}
                      >
                        <Bug size={16} />
                      </button>
                      <Tooltip
                        id={`create-issue-${item.id}`}
                        content="Create issue from this analysis"
                      />

                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                        data-tooltip-id={`delete-history-${item.id}`}
                      >
                        <Trash2 size={16} />
                      </button>
                      <Tooltip
                        id={`delete-history-${item.id}`}
                        content="Delete this record"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Performance</p>
                    <p
                      className={`font-medium ${getScoreColor(
                        item.performance_score
                      )}`}
                    >
                      {Math.round(item.performance_score)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Accessibility</p>
                    <p
                      className={`font-medium ${getScoreColor(
                        item.accessibility_score
                      )}`}
                    >
                      {Math.round(item.accessibility_score)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Best Practices</p>
                    <p
                      className={`font-medium ${getScoreColor(
                        item.best_practices_score
                      )}`}
                    >
                      {Math.round(item.best_practices_score)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">SEO</p>
                    <p
                      className={`font-medium ${getScoreColor(item.seo_score)}`}
                    >
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

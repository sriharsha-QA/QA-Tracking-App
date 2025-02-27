import React, { useState } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2, ExternalLink, Activity } from 'lucide-react';
import { useProjectStore, Project } from '../store/projectStore';
import { Modal } from '../components/Modal';
import { ProjectForm } from '../components/forms/ProjectForm';
import { Tooltip } from '../components/Tooltip';
import { analyzeWebsite } from '../services/apiPerformance';

interface PerformanceMetrics {
  performance_score: number;
  accessibility_score: number;
  best_practices_score: number;
  seo_score: number;
  loading_speed: number;
  mobile_friendly: boolean;
  errors: string[];
  timestamp?: string;
  url?: string;
}

const Projects: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<PerformanceMetrics[]>([]);
  const [currentAnalysisProject, setCurrentAnalysisProject] = useState<Project | null>(null);

  const handleCreateProject = (projectData: Omit<Project, 'id'>) => {
    addProject(projectData);
    setIsModalOpen(false);
  };

  const handleUpdateProject = (projectData: Omit<Project, 'id'>) => {
    if (selectedProject) {
      updateProject({ ...projectData, id: selectedProject.id });
      setSelectedProject(null);
      setIsModalOpen(false);
    }
  };

  const handleDeleteProject = (id: number) => {
    deleteProject(id);
    setShowDeleteConfirm(false);
    setSelectedProject(null);
  };

  const handleAnalyzeProject = async (project: Project) => {
    if (!project.appUrl) return;
    
    setCurrentAnalysisProject(project);
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeWebsite(project.appUrl);
      const resultWithMeta = {
        ...result,
        timestamp: new Date().toLocaleString(),
        url: project.appUrl
      };
      
      setAnalysisResults(prev => [resultWithMeta, ...prev]);
    } catch (error) {
      console.error("Error analyzing website:", error);
    } finally {
      setIsAnalyzing(false);
      setCurrentAnalysisProject(null);
    }
  };

  const clearAnalysisResults = () => {
    setAnalysisResults([]);
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <button
          onClick={() => {
            setSelectedProject(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          data-tooltip-id="create-project-tooltip"
        >
          <Plus size={20} />
          New Project
        </button>
        <Tooltip id="create-project-tooltip" content="Create a new project" />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(showDropdown === project.id ? null : project.id)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                  data-tooltip-id={`project-actions-${project.id}`}
                >
                  <MoreVertical size={20} className="text-gray-500" />
                </button>
                <Tooltip id={`project-actions-${project.id}`} content="Project actions" />
                {showDropdown === project.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setIsModalOpen(true);
                        setShowDropdown(null);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit Project
                    </button>
                    {project.appUrl && (
                      <button
                        onClick={() => {
                          handleAnalyzeProject(project);
                          setShowDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left text-blue-600 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Activity size={16} />
                        Analyze Performance
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setShowDeleteConfirm(true);
                        setShowDropdown(null);
                      }}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete Project
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="text-gray-600 mt-2 text-sm">{project.description}</p>
            
            {project.appUrl && (
              <a 
                href={project.appUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-500 text-sm mt-2 hover:underline"
              >
                <ExternalLink size={14} />
                {project.appUrl}
              </a>
            )}
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 rounded-full h-2"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex -space-x-2">
                {project.team.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt={`Team member ${index + 1}`}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Analysis Results */}
      {analysisResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Performance Analysis History</h2>
            <button
              onClick={clearAnalysisResults}
              className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
            >
              Clear History
            </button>
          </div>
          
          <div className="space-y-6">
            {analysisResults.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-gray-800">{result.url}</h3>
                    <p className="text-sm text-gray-500">Analyzed on {result.timestamp}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-lg font-bold ${getScoreColor(result.performance_score)}`}>
                      {Math.round(result.performance_score)}%
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Accessibility</p>
                    <p className={`text-lg font-bold ${getScoreColor(result.accessibility_score)}`}>
                      {Math.round(result.accessibility_score)}%
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Best Practices</p>
                    <p className={`text-lg font-bold ${getScoreColor(result.best_practices_score)}`}>
                      {Math.round(result.best_practices_score)}%
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">SEO</p>
                    <p className={`text-lg font-bold ${getScoreColor(result.seo_score)}`}>
                      {Math.round(result.seo_score)}%
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Loading Speed</p>
                    <p className={`text-lg font-bold ${result.loading_speed < 2 ? 'text-green-500' : result.loading_speed < 4 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {result.loading_speed.toFixed(2)}s
                    </p>
                  </div>
                </div>
                
                {result.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-red-600">Issues Found:</p>
                    <ul className="text-sm text-red-600 list-disc list-inside">
                      {result.errors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-700">Analyzing {currentAnalysisProject?.name}...</p>
            <p className="text-sm text-gray-500 mt-2">{currentAnalysisProject?.appUrl}</p>
          </div>
        </div>
      )}

      {/* Create/Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
        title={selectedProject ? 'Edit Project' : 'Create New Project'}
      >
        <ProjectForm
          project={selectedProject || undefined}
          onSubmit={selectedProject ? handleUpdateProject : handleCreateProject}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedProject(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedProject(null);
        }}
        title="Delete Project"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this project? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setSelectedProject(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => selectedProject && handleDeleteProject(selectedProject.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Projects;
import { create } from 'zustand';

export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Completed' | 'On Hold';
  progress: number;
  team: string[];
  startDate: string;
}

interface ProjectState {
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: number) => void;
  getProject: (id: number) => Project | undefined;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [
    {
      id: 1,
      name: 'E-commerce Platform',
      description: 'Building a modern e-commerce platform with React and Node.js',
      status: 'Active',
      progress: 75,
      team: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150'
      ],
      startDate: '2024-01-15'
    },
    // ... other initial projects
  ],
  addProject: (project) => {
    set((state) => ({
      projects: [...state.projects, { ...project, id: state.projects.length + 1 }]
    }));
  },
  updateProject: (project) => {
    set((state) => ({
      projects: state.projects.map((p) => (p.id === project.id ? project : p))
    }));
  },
  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id)
    }));
  },
  getProject: (id) => {
    return get().projects.find((p) => p.id === id);
  }
}));
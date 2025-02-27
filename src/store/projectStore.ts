import { create } from 'zustand';

export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Completed' | 'On Hold';
  progress: number;
  team: string[];
  startDate: string;
  appUrl?: string;
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
      startDate: '2024-01-15',
      appUrl: 'https://example-ecommerce.com'
    },
    {
      id: 2,
      name: 'Mobile Banking App',
      description: 'Developing a secure mobile banking application with React Native',
      status: 'In Progress',
      progress: 45,
      team: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
      ],
      startDate: '2024-02-10',
      appUrl: 'https://banking-app-demo.com'
    },
    {
      id: 3,
      name: 'Healthcare Portal',
      description: 'Creating a patient management system for healthcare providers',
      status: 'On Hold',
      progress: 30,
      team: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
      ],
      startDate: '2024-01-05',
      appUrl: 'https://healthcare-portal.example.com'
    }
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
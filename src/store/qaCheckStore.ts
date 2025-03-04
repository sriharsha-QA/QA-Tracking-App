import { create } from 'zustand';

export interface QACheck {
  id: number;
  name: string;
  description: string;
  status: 'Passed' | 'Failed' | 'In Review' | 'Blocked';
  project: string;
  assignee: {
    name: string;
    avatar: string;
  };
  lastRun: string;
  type: 'Functional' | 'Performance' | 'Security' | 'UI/UX';
}

interface QACheckState {
  checks: QACheck[];
  addCheck: (check: Omit<QACheck, 'id'>) => void;
  updateCheck: (check: QACheck) => void;
  deleteCheck: (id: number) => void;
  getCheck: (id: number) => QACheck | undefined;
  filterChecks: (status: string, type: string, search: string) => QACheck[];
}

export const useQACheckStore = create<QACheckState>((set, get) => ({
  checks: [
    {
      id: 1,
      name: 'Mobile Responsiveness Test',
      description: 'Verify that all pages display correctly on mobile devices',
      status: 'Failed',
      project: 'E-commerce Platform',
      assignee: {
        name: 'Jane Smith',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
      },
      lastRun: '2024-03-10 14:30',
      type: 'UI/UX'
    },
    {
      id: 2,
      name: 'Checkout Process Flow',
      description: 'Verify the complete checkout process with various payment methods',
      status: 'In Review',
      project: 'E-commerce Platform',
      assignee: {
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150'
      },
      lastRun: '2024-03-09 10:15',
      type: 'Functional'
    },
    {
      id: 3,
      name: 'API Response Time Test',
      description: 'Verify that all API endpoints respond within acceptable time limits',
      status: 'Passed',
      project: 'Mobile Banking App',
      assignee: {
        name: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      },
      lastRun: '2024-03-08 16:45',
      type: 'Performance'
    },
    {
      id: 4,
      name: 'Data Encryption Test',
      description: 'Verify that all sensitive data is properly encrypted',
      status: 'Passed',
      project: 'Healthcare Portal',
      assignee: {
        name: 'Michael Brown',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
      },
      lastRun: '2024-03-07 11:30',
      type: 'Security'
    },
    {
      id: 5,
      name: 'User Authentication Flow',
      description: 'Verify all user authentication scenarios including edge cases',
      status: 'Blocked',
      project: 'Healthcare Portal',
      assignee: {
        name: 'Jane Smith',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
      },
      lastRun: '2024-03-06 09:20',
      type: 'Functional'
    }
  ],
  addCheck: (check) => {
    set((state) => ({
      checks: [...state.checks, { ...check, id: state.checks.length + 1 }]
    }));
  },
  updateCheck: (check) => {
    set((state) => ({
      checks: state.checks.map((c) => (c.id === check.id ? check : c))
    }));
  },
  deleteCheck: (id) => {
    set((state) => ({
      checks: state.checks.filter((c) => c.id !== id)
    }));
  },
  getCheck: (id) => {
    return get().checks.find((c) => c.id === id);
  },
  filterChecks: (status, type, search) => {
    const checks = get().checks;
    return checks.filter((check) => {
      const matchesStatus = status === 'all' || check.status.toLowerCase() === status;
      const matchesType = type === 'all' || check.type.toLowerCase() === type;
      const matchesSearch = check.name.toLowerCase().includes(search.toLowerCase()) ||
                          check.description.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesType && matchesSearch;
    });
  }
}));
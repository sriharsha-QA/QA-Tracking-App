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
    // Initial QA checks data
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
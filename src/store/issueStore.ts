import { create } from 'zustand';

export interface Issue {
  id: number;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  project: string;
  assignee: {
    name: string;
    avatar: string;
  };
  created: string;
  comments: number;
  attachments: number;
  linkedQAChecks?: number[];
  release?: string;
}

interface IssueState {
  issues: Issue[];
  addIssue: (issue: Omit<Issue, 'id'>) => void;
  updateIssue: (issue: Issue) => void;
  deleteIssue: (id: number) => void;
  getIssue: (id: number) => Issue | undefined;
  filterIssues: (status: string, priority: string, search: string) => Issue[];
}

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: [
    {
      id: 1,
      title: 'Login page not responsive on mobile',
      description: 'The login page elements overlap on mobile devices with screen width less than 375px.',
      status: 'Open',
      priority: 'High',
      project: 'E-commerce Platform',
      assignee: {
        name: 'Jane Smith',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
      },
      created: '2024-03-10',
      comments: 3,
      attachments: 2,
      linkedQAChecks: [1],
      release: 'v1.2.0'
    },
    {
      id: 2,
      title: 'Checkout process fails with large cart items',
      description: 'When a user has more than 20 items in cart, the checkout process fails with a 500 error.',
      status: 'In Progress',
      priority: 'High',
      project: 'E-commerce Platform',
      assignee: {
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150'
      },
      created: '2024-03-08',
      comments: 5,
      attachments: 1,
      linkedQAChecks: [2]
    },
    {
      id: 3,
      title: 'Product search returns incorrect results',
      description: 'The search functionality is not properly filtering products based on category selection.',
      status: 'Closed',
      priority: 'Medium',
      project: 'E-commerce Platform',
      assignee: {
        name: 'Jane Smith',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
      },
      created: '2024-03-05',
      comments: 2,
      attachments: 0
    },
    {
      id: 4,
      title: 'Transaction history not loading',
      description: 'Users cannot view their transaction history in the mobile app. API returns 404.',
      status: 'Open',
      priority: 'High',
      project: 'Mobile Banking App',
      assignee: {
        name: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      },
      created: '2024-03-09',
      comments: 1,
      attachments: 0,
      linkedQAChecks: [3]
    },
    {
      id: 5,
      title: 'Password reset email not being sent',
      description: 'Users are not receiving password reset emails when requested.',
      status: 'In Progress',
      priority: 'Medium',
      project: 'Healthcare Portal',
      assignee: {
        name: 'Michael Brown',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
      },
      created: '2024-03-07',
      comments: 4,
      attachments: 1
    }
  ],
  addIssue: (issue) => {
    set((state) => ({
      issues: [...state.issues, { ...issue, id: state.issues.length + 1 }]
    }));
  },
  updateIssue: (issue) => {
    set((state) => ({
      issues: state.issues.map((i) => (i.id === issue.id ? issue : i))
    }));
  },
  deleteIssue: (id) => {
    set((state) => ({
      issues: state.issues.filter((i) => i.id !== id)
    }));
  },
  getIssue: (id) => {
    return get().issues.find((i) => i.id === id);
  },
  filterIssues: (status, priority, search) => {
    const issues = get().issues;
    return issues.filter((issue) => {
      const matchesStatus = status === 'all' || issue.status.toLowerCase() === status;
      const matchesPriority = priority === 'all' || issue.priority.toLowerCase() === priority;
      const matchesSearch = issue.title.toLowerCase().includes(search.toLowerCase()) ||
                          issue.description.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }
}));
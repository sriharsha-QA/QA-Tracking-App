import { create } from "zustand";

export interface Issue {
  linkedQAChecks: boolean;
  release: any;
  id: number;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Closed";
  priority: "High" | "Medium" | "Low";
  project: string;
  assignee: {
    name: string;
    avatar: string;
  };
  created: string;
  comments: number;
  attachments: number;
}

interface IssueState {
  issues: Issue[];
  addIssue: (issue: Omit<Issue, "id">) => void;
  updateIssue: (issue: Issue) => void;
  deleteIssue: (id: number) => void;
  getIssue: (id: number) => Issue | undefined;
  filterIssues: (status: string, priority: string, search: string) => Issue[];
}

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: [
    // Initial issues data
  ],
  addIssue: (issue) => {
    set((state) => ({
      issues: [...state.issues, { ...issue, id: state.issues.length + 1 }],
    }));
  },
  updateIssue: (issue) => {
    set((state) => ({
      issues: state.issues.map((i) => (i.id === issue.id ? issue : i)),
    }));
  },
  deleteIssue: (id) => {
    set((state) => ({
      issues: state.issues.filter((i) => i.id !== id),
    }));
  },
  getIssue: (id) => {
    return get().issues.find((i) => i.id === id);
  },
  filterIssues: (status, priority, search) => {
    const issues = get().issues;
    return issues.filter((issue) => {
      const matchesStatus =
        status === "all" || issue.status.toLowerCase() === status;
      const matchesPriority =
        priority === "all" || issue.priority.toLowerCase() === priority;
      const matchesSearch =
        issue.title.toLowerCase().includes(search.toLowerCase()) ||
        issue.description.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesPriority && matchesSearch;
    });
  },
}));

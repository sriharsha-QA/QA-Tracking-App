import { create } from 'zustand';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'QA Engineer' | 'Developer' | 'Project Manager';
  status: 'Active' | 'Inactive';
  avatar: string;
  phone?: string;
  location?: string;
  department?: string;
  lastActive?: string;
  activities?: UserActivity[];
  twoFactorEnabled?: boolean;
}

export interface UserActivity {
  id: number;
  action: string;
  target: string;
  timestamp: string;
}

interface UserState {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: number) => void;
  getUser: (id: number) => User | undefined;
  filterUsers: (role: string, status: string, search: string) => User[];
  addUserActivity: (userId: number, activity: Omit<UserActivity, 'id'>) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [
    {
      id: 1,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'QA Engineer',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      department: 'Quality Assurance',
      lastActive: '2024-03-10 15:45',
      activities: [
        {
          id: 1,
          action: 'Created QA Check',
          target: 'Mobile Responsiveness Test',
          timestamp: '2024-03-10 14:30'
        },
        {
          id: 2,
          action: 'Updated Issue',
          target: 'Login page not responsive on mobile',
          timestamp: '2024-03-10 13:15'
        }
      ],
      twoFactorEnabled: true
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Developer',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
      phone: '+1 (555) 987-6543',
      location: 'New York, NY',
      department: 'Engineering',
      lastActive: '2024-03-10 14:20',
      activities: [
        {
          id: 1,
          action: 'Updated Issue Status',
          target: 'Checkout process fails with large cart items',
          timestamp: '2024-03-09 16:45'
        }
      ],
      twoFactorEnabled: false
    },
    {
      id: 3,
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      role: 'Project Manager',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      phone: '+1 (555) 456-7890',
      location: 'Chicago, IL',
      department: 'Product Management',
      lastActive: '2024-03-10 11:30',
      activities: [
        {
          id: 1,
          action: 'Created Project',
          target: 'Mobile Banking App',
          timestamp: '2024-03-08 10:15'
        }
      ],
      twoFactorEnabled: true
    },
    {
      id: 4,
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      role: 'Admin',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      phone: '+1 (555) 789-0123',
      location: 'Seattle, WA',
      department: 'IT Administration',
      lastActive: '2024-03-10 16:00',
      activities: [
        {
          id: 1,
          action: 'Added User',
          target: 'Sarah Williams',
          timestamp: '2024-03-07 14:30'
        }
      ],
      twoFactorEnabled: true
    },
    {
      id: 5,
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      role: 'Developer',
      status: 'Inactive',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      phone: '+1 (555) 234-5678',
      location: 'Austin, TX',
      department: 'Engineering',
      lastActive: '2024-03-05 09:45',
      activities: [],
      twoFactorEnabled: false
    }
  ],
  addUser: (user) => {
    set((state) => ({
      users: [...state.users, { ...user, id: state.users.length + 1, activities: [] }]
    }));
  },
  updateUser: (user) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === user.id ? user : u))
    }));
  },
  deleteUser: (id) => {
    set((state) => ({
      users: state.users.filter((u) => u.id !== id)
    }));
  },
  getUser: (id) => {
    return get().users.find((u) => u.id === id);
  },
  filterUsers: (role, status, search) => {
    const users = get().users;
    return users.filter((user) => {
      const matchesRole = role === 'all' || user.role.toLowerCase() === role;
      const matchesStatus = status === 'all' || user.status.toLowerCase() === status;
      const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                          user.email.toLowerCase().includes(search.toLowerCase());
      return matchesRole && matchesStatus && matchesSearch;
    });
  },
  addUserActivity: (userId, activity) => {
    set((state) => {
      const user = state.users.find(u => u.id === userId);
      if (!user) return state;

      const updatedUser = {
        ...user,
        activities: [
          ...(user.activities || []),
          { ...activity, id: user.activities ? user.activities.length + 1 : 1 }
        ],
        lastActive: new Date().toISOString().replace('T', ' ').split('.')[0]
      };

      return {
        users: state.users.map(u => u.id === userId ? updatedUser : u)
      };
    });
  }
}));
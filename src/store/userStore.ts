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
}

interface UserState {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: number) => void;
  getUser: (id: number) => User | undefined;
  filterUsers: (role: string, status: string, search: string) => User[];
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [
    // Initial users data
  ],
  addUser: (user) => {
    set((state) => ({
      users: [...state.users, { ...user, id: state.users.length + 1 }]
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
  }
}));
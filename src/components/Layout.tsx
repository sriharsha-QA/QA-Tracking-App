import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Bug, 
  CheckSquare,
  Activity,
  FileText,
  Users,
  Settings,
  LogOut
} from 'lucide-react';

const Layout: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">QA Tracker</h1>
        </div>
        <nav className="mt-4">
          <NavLink to="/dashboard" icon={<LayoutDashboard size={20} />} active={isActive('/dashboard')}>
            Dashboard
          </NavLink>
          <NavLink to="/projects" icon={<ClipboardList size={20} />} active={isActive('/projects')}>
            Projects
          </NavLink>
          <NavLink to="/issues" icon={<Bug size={20} />} active={isActive('/issues')}>
            Issues
          </NavLink>
          <NavLink to="/qa-checks" icon={<CheckSquare size={20} />} active={isActive('/qa-checks')}>
            QA Checks
          </NavLink>
          <NavLink to="/api-performance" icon={<Activity size={20} />} active={isActive('/api-performance')}>
            API Performance
          </NavLink>
          <NavLink to="/reports" icon={<FileText size={20} />} active={isActive('/reports')}>
            Reports
          </NavLink>
          <NavLink to="/users" icon={<Users size={20} />} active={isActive('/users')}>
            Users
          </NavLink>
          <NavLink to="/settings" icon={<Settings size={20} />} active={isActive('/settings')}>
            Settings
          </NavLink>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <LogOut size={20} className="mr-2" />
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, children, active }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-2 ${
      active 
        ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-500' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <span className="mr-2">{icon}</span>
    {children}
  </Link>
);

export default Layout;
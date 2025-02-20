import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) return <Outlet />;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">QA Tracker</h1>
        </div>
        <nav className="mt-4">
          <NavLink to="/dashboard" icon={<LayoutDashboard size={20} />}>Dashboard</NavLink>
          <NavLink to="/projects" icon={<ClipboardList size={20} />}>Projects</NavLink>
          <NavLink to="/issues" icon={<Bug size={20} />}>Issues</NavLink>
          <NavLink to="/qa-checks" icon={<CheckSquare size={20} />}>QA Checks</NavLink>
          <NavLink to="/api-performance" icon={<Activity size={20} />}>API Performance</NavLink>
          <NavLink to="/reports" icon={<FileText size={20} />}>Reports</NavLink>
          <NavLink to="/users" icon={<Users size={20} />}>Users</NavLink>
          <NavLink to="/settings" icon={<Settings size={20} />}>Settings</NavLink>
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
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, children }) => (
  <Link
    to={to}
    className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
  >
    <span className="mr-2">{icon}</span>
    {children}
  </Link>
);

export default Layout;
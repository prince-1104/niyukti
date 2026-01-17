import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LogOut, Briefcase, Building2, UserCircle, BarChart3, Moon, Sun } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCandidate = user?.role === 'candidate';
  const isInstitution = user?.role === 'institution';

  return (
    <div 
      className="min-h-screen dark:bg-dashboard-dark"
      style={{
        background: theme === 'light' 
          ? 'linear-gradient(to bottom, #7e22ce 0%, #a855f7 25%, #60a5fa 50%, #cbd5e1 75%, #ffffff 100%)'
          : undefined
      }}
    >
      <nav className="bg-purple-800 dark:bg-dashboard-card/95 backdrop-blur-lg shadow-lg border-b border-purple-900/50 dark:border-dashboard-green/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center group">
                <span className="text-2xl font-bold text-dashboard-green group-hover:text-dashboard-green/80 transition-all">
                  Niyukti
                </span>
              </Link>
              
              <div className="ml-10 flex items-center space-x-1">
                {isCandidate && (
                  <>
                    <Link
                      to="/candidate/dashboard"
                      className="text-white dark:text-gray-300 hover:text-white dark:hover:text-dashboard-green hover:bg-purple-700/50 dark:hover:bg-dashboard-card px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200"
                    >
                      <Briefcase className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/candidate/jobs"
                      className="text-white dark:text-gray-300 hover:text-white dark:hover:text-dashboard-green hover:bg-purple-700/50 dark:hover:bg-dashboard-card px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      Find Jobs
                    </Link>
                    <Link
                      to="/candidate/profile"
                      className="text-white dark:text-gray-300 hover:text-white dark:hover:text-dashboard-green hover:bg-purple-700/50 dark:hover:bg-dashboard-card px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      Profile
                    </Link>
                  </>
                )}
                
                {isInstitution && (
                  <>
                    <Link
                      to="/institution/dashboard"
                      className="text-white dark:text-gray-300 hover:text-white dark:hover:text-dashboard-green hover:bg-purple-700/50 dark:hover:bg-dashboard-card px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200"
                    >
                      <Building2 className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/institution/jobs"
                      className="text-white dark:text-gray-300 hover:text-white dark:hover:text-dashboard-green hover:bg-purple-700/50 dark:hover:bg-dashboard-card px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      Jobs
                    </Link>
                    <Link
                      to="/institution/profile"
                      className="text-white dark:text-gray-300 hover:text-white dark:hover:text-dashboard-green hover:bg-purple-700/50 dark:hover:bg-dashboard-card px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/institution/analytics"
                      className="text-white dark:text-gray-300 hover:text-white dark:hover:text-dashboard-green hover:bg-purple-700/50 dark:hover:bg-dashboard-card px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Analytics
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-white dark:text-gray-300 hover:bg-purple-700/50 dark:hover:bg-dashboard-card border border-purple-700/50 dark:border-dashboard-green/20 transition-all duration-200 flex items-center justify-center"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>
              <div className="flex items-center space-x-2 text-sm text-white dark:text-gray-200 bg-purple-700/30 dark:bg-dashboard-card px-4 py-2 rounded-lg border border-purple-600/50 dark:border-dashboard-green/20">
                <UserCircle className="w-5 h-5 text-dashboard-green" />
                <span className="font-medium">{user?.full_name || user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-white dark:text-gray-300 hover:text-white dark:hover:text-dashboard-orange hover:bg-purple-700/50 dark:hover:bg-dashboard-card px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 border border-purple-700/50 dark:border-dashboard-orange/20"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

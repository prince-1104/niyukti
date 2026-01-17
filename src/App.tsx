import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Configure Router for React Router v7 compatibility
const routerConfig = {
  future: {
    v7_relativeSplatPath: true,
    v7_startTransition: true,
  },
};
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateProfile from './pages/candidate/CandidateProfile';
import CandidateJobs from './pages/candidate/CandidateJobs';
import ScreeningPage from './pages/candidate/ScreeningPage';
import InstitutionDashboard from './pages/institution/InstitutionDashboard';
import InstitutionProfile from './pages/institution/InstitutionProfile';
import InstitutionJobs from './pages/institution/InstitutionJobs';
import CreateJobPage from './pages/institution/CreateJobPage';
import JobDetailsPage from './pages/institution/JobDetailsPage';
import AnalyticsPage from './pages/institution/AnalyticsPage';
import Layout from './components/Layout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dashboard-dark">
        <div className="text-lg text-gray-900 dark:text-gray-100">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function RoleRoute({ allowedRoles, children }: { allowedRoles: string[]; children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function IndexRedirect() {
  const { user } = useAuth();
  return (
    <Navigate to={user?.role === 'candidate' ? '/candidate/dashboard' : '/institution/dashboard'} replace />
  );
}

function RootRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dashboard-dark">
        <div className="text-lg text-gray-900 dark:text-gray-100">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignupPage />} />
      
      {/* Landing page for unauthenticated users, protected routes for authenticated */}
      <Route path="/" element={<RootRoute />}>
        <Route index element={<IndexRedirect />} />
        
        {/* Candidate Routes */}
        <Route
          path="candidate/dashboard"
          element={
            <RoleRoute allowedRoles={['candidate']}>
              <CandidateDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="candidate/profile"
          element={
            <RoleRoute allowedRoles={['candidate']}>
              <CandidateProfile />
            </RoleRoute>
          }
        />
        <Route
          path="candidate/jobs"
          element={
            <RoleRoute allowedRoles={['candidate']}>
              <CandidateJobs />
            </RoleRoute>
          }
        />
        <Route
          path="candidate/screening/:attemptId"
          element={
            <RoleRoute allowedRoles={['candidate']}>
              <ScreeningPage />
            </RoleRoute>
          }
        />
        
        {/* Institution Routes */}
        <Route
          path="institution/dashboard"
          element={
            <RoleRoute allowedRoles={['institution']}>
              <InstitutionDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="institution/profile"
          element={
            <RoleRoute allowedRoles={['institution']}>
              <InstitutionProfile />
            </RoleRoute>
          }
        />
        <Route
          path="institution/jobs"
          element={
            <RoleRoute allowedRoles={['institution']}>
              <InstitutionJobs />
            </RoleRoute>
          }
        />
        <Route
          path="institution/jobs/create"
          element={
            <RoleRoute allowedRoles={['institution']}>
              <CreateJobPage />
            </RoleRoute>
          }
        />
        <Route
          path="institution/jobs/:jobId"
          element={
            <RoleRoute allowedRoles={['institution']}>
              <JobDetailsPage />
            </RoleRoute>
          }
        />
        <Route
          path="institution/analytics"
          element={
            <RoleRoute allowedRoles={['institution']}>
              <AnalyticsPage />
            </RoleRoute>
          }
        />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router future={routerConfig.future}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;


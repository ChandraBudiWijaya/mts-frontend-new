import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context & layout
import { AuthProvider } from '../features/auth/context';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Auth
import Login from '../features/auth/components/Login';

// Pages
import Dashboard from '../features/dashboard';
import { Locations, LocationDetail } from '../features/locations';
import Users from '../features/users/Users';
import Rbac from '../features/rbac/Rbac';
import { Parameters } from '../features/parameters';
import WorkPlans from '../features/work-plans/WorkPlans';
import LiveTracking from '../features/live-tracking/LiveTrackingPage';
import ReportPage from '../features/reports';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="rbac" element={<Rbac />} />
              <Route path="parameters" element={<Parameters />} />
              <Route path="locations" element={<Locations />} />
              <Route path="locations/:id" element={<LocationDetail />} />
              <Route path="work-plans" element={<WorkPlans />} />
              <Route path="live-tracking" element={<LiveTracking />} />
              <Route path="reports" element={<ReportPage />} />

              {/* Default redirect */}
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

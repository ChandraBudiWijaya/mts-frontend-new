import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../features/auth/context';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import ErrorBoundary from '../components/common/ErrorBoundary';
import Login from '../features/auth/components/Login';
import Dashboard from '../features/dashboard';
import { Locations, LocationDetail } from '../features/locations';
import Users from '../features/users/Users';
import Rbac from '../features/rbac/Rbac';
import { Parameters } from '../features/parameters';
import WorkPlans from '../features/work-plans/WorkPlans';
import LiveTracking from '../features/live-tracking/LiveTrackingPage';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
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
              <Route path="work-plans" element={<WorkPlans />} />
              <Route path="live-tracking" element={<LiveTracking />} />
              <Route path="locations/:id" element={<LocationDetail />} />
              
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

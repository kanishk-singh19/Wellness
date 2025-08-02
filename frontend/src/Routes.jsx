import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import UserLogin from './pages/user-login';
import SessionDetailView from './pages/session-detail-view';
import PublicSessionDiscovery from './pages/public-session-discovery';
import UserRegistration from './pages/user-registration';
import PersonalSessionDashboard from './pages/personal-session-dashboard';
import SessionEditor from './pages/session-editor';
import PrivateRoute from './utils/PrivateRoute'; // <-- Import PrivateRoute

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>

          {/* Public Routes */}
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-registration" element={<UserRegistration />} />
          <Route path="/public-session-discovery" element={<PublicSessionDiscovery />} />
          <Route path="/session-detail-view" element={<SessionDetailView />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <PersonalSessionDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/personal-session-dashboard"
            element={
              <PrivateRoute>
                <PersonalSessionDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/session-editor"
            element={
              <PrivateRoute>
                <SessionEditor />
              </PrivateRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
          
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

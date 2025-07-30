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

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<PersonalSessionDashboard />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/session-detail-view" element={<SessionDetailView />} />
        <Route path="/public-session-discovery" element={<PublicSessionDiscovery />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="/personal-session-dashboard" element={<PersonalSessionDashboard />} />
        <Route path="/session-editor" element={<SessionEditor />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

// src/pages/session-editor/index.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import sessionService from '../../utils/sessionService';
import GlobalHeader from '../../components/ui/GlobalHeader';
import SessionForm from './components/SessionForm';
import toast from 'react-hot-toast';

const SessionEditor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const existingSession = location.state?.session || null;

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handlePublish = async (formData) => {
    if (!user?.id) return toast.error('Please log in to publish.');

    const result = await sessionService.createOrUpdateSession({
      ...formData,
      status: 'published',
      userId: user.id,
    });

    if (result.success) {
      toast.success('Session published successfully!');
      navigate('/personal-session-dashboard');
    } else {
      toast.error(result.error || 'Failed to publish session.');
    }
  };

  const handleDraftSave = async (formData) => {
    if (!user?.id) return toast.error('Please log in to save.');

    const result = await sessionService.createOrUpdateSession({
      ...formData,
      status: 'draft',
      userId: user.id,
    });

    if (result.success) {
      toast.success('Draft saved!');
    } else {
      toast.error(result.error || 'Failed to save draft.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold text-foreground mb-6">
          {existingSession ? 'Edit Your Session' : 'Create New Session'}
        </h1>
        <SessionForm
          session={existingSession}
          onPublish={handlePublish}
          onDraftSave={handleDraftSave}
          setHasUnsavedChanges={setHasUnsavedChanges}
        />
      </main>
    </div>
  );
};

export default SessionEditor;

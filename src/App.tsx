import React, { useState } from 'react';
import { ActivationGateway } from './components/ActivationGateway';
import { SuperAdminLoginModal } from './components/SuperAdminLoginModal';
import { SuperAdminDashboard } from './components/views/SuperAdminDashboard';
// ... other imports

export default function App() {
  const [isActivated, setIsActivated] = useState<boolean>(() => {
    return localStorage.getItem('genie_activated') === 'true';
  });
  const [isSuperAdminOpen, setIsSuperAdminOpen] = useState(false);
  const [isSuperAdminAuthenticated, setIsSuperAdminAuthenticated] = useState(false);

  // If SuperAdmin logged in successfully, show SuperAdmin Dashboard
  if (isSuperAdminAuthenticated) {
    return (
      <SuperAdminDashboard 
        onExit={() => setIsSuperAdminAuthenticated(false)} 
      />
    );
  }

  // If Workspace is not yet activated, show Activation Gateway
  if (!isActivated) {
    return (
      <>
        <ActivationGateway
          onActivated={() => {
            localStorage.setItem('genie_activated', 'true');
            setIsActivated(true);
          }}
          onOpenSuperAdmin={() => setIsSuperAdminOpen(true)}
        />
        
        {/* Enforced Authentication Gate */}
        <SuperAdminLoginModal
          isOpen={isSuperAdminOpen}
          onClose={() => setIsSuperAdminOpen(false)}
          onSuccess={() => {
            setIsSuperAdminOpen(false);
            setIsSuperAdminAuthenticated(true);
          }}
        />
      </>
    );
  }

  // Regular faculty workspace renders here...

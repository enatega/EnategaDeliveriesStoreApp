import { useState } from 'react';

/**
 * Owns sidebar open/close state and store availability toggle.
 * Shared across the main tab layout so any tab can open the sidebar.
 */
export function useSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [availability, setAvailability] = useState(true);

  return {
    sidebarOpen,
    openSidebar: () => setSidebarOpen(true),
    closeSidebar: () => setSidebarOpen(false),
    availability,
    setAvailability,
  };
}

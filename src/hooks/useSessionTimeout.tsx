import { useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 2 * 60 * 1000; // 2 minutes before timeout

export function useSessionTimeout() {
  const { user, signOut } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningTimeoutRef = useRef<NodeJS.Timeout>();

  const resetTimer = () => {
    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    
    // Hide warning if showing
    setShowWarning(false);

    // Only set timers if user is logged in
    if (!user) return;

    // Set warning timer (show warning 2 minutes before logout)
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
    }, INACTIVITY_TIMEOUT - WARNING_TIME);

    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIMEOUT);
  };

  const handleLogout = async () => {
    setShowWarning(false);
    await signOut();
  };

  const handleRenewSession = () => {
    setShowWarning(false);
    resetTimer();
  };

  useEffect(() => {
    if (!user) {
      setShowWarning(false);
      return;
    }

    // Activity events to monitor
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    // Reset timer on any activity
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Start initial timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, [user]);

  return {
    showWarning,
    handleRenewSession,
    handleLogout,
  };
}

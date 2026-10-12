import { useState, useEffect } from "react";

/**
 * OfflineBanner — Displays a subtle warning at the top of the page when the app goes offline.
 */
const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-2 bg-amber-600 px-4 py-2 text-center text-xs font-semibold text-white shadow-md animate-in slide-in-from-top duration-200 dark:bg-amber-700">
      <span className="text-sm">⚠️</span>
      <span>You are currently offline. Some features may be unavailable.</span>
    </div>
  );
};

export default OfflineBanner;

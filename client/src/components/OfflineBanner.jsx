import { useState, useEffect } from "react";

/**
 * OfflineBanner — Displays a subtle warning when offline, and alerts when connection is restored.
 */
const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    let timer;
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      window.dispatchEvent(new CustomEvent("app:online-sync"));
      timer = setTimeout(() => {
        setShowRestored(false);
      }, 3500);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestored(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (showRestored) {
    return (
      <div className="animate-in slide-in-from-top fixed top-0 right-0 left-0 z-9999 flex items-center justify-center gap-2 bg-emerald-600 px-4 py-2 text-center text-xs font-semibold text-white shadow-md duration-200">
        <span className="text-sm">✓</span>
        <span>Connection restored — synchronizing offline drafts with the server...</span>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <div className="animate-in slide-in-from-top fixed top-0 right-0 left-0 z-9999 flex items-center justify-center gap-2 bg-amber-600 px-4 py-2 text-center text-xs font-semibold text-white shadow-md duration-200 dark:bg-amber-700">
      <span className="text-sm">⚡</span>
      <span>
        You are currently offline — cached content is accessible and score entries are auto-saved
        locally.
      </span>
    </div>
  );
};

export default OfflineBanner;

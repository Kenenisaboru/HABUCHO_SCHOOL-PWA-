/**
 * Offline Storage Utility
 * -----------------------
 * Provides IndexedDB & localStorage persistence for offline draft scores,
 * unsaved admission forms, and background queueing when connection drops.
 */

const DB_NAME = "habucho_offline_db";
const DB_VERSION = 1;
const STORE_DRAFTS = "offline_drafts";

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB is not supported"));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_DRAFTS)) {
        db.createObjectStore(STORE_DRAFTS, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Save a draft (e.g., teacher's unsaved scores or form inputs)
 * @param {string} key Unique draft key (e.g., 'grade_entry_g11_A_math')
 * @param {*} data Data payload to store
 */
export const saveOfflineDraft = async (key, data) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_DRAFTS, "readwrite");
      const store = tx.objectStore(STORE_DRAFTS);
      const item = {
        id: key,
        data,
        updatedAt: new Date().toISOString(),
      };
      const req = store.put(item);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback to localStorage if IndexedDB is blocked in private browsing
    try {
      localStorage.setItem(`draft_${key}`, JSON.stringify({ data, updatedAt: new Date().toISOString() }));
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Get an offline draft
 * @param {string} key
 */
export const getOfflineDraft = async (key) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_DRAFTS, "readonly");
      const store = tx.objectStore(STORE_DRAFTS);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.data : null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem(`draft_${key}`);
      return raw ? JSON.parse(raw).data : null;
    } catch {
      return null;
    }
  }
};

/**
 * Delete an offline draft once synced
 * @param {string} key
 */
export const clearOfflineDraft = async (key) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_DRAFTS, "readwrite");
      const store = tx.objectStore(STORE_DRAFTS);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      localStorage.removeItem(`draft_${key}`);
      return true;
    } catch {
      return false;
    }
  }
};

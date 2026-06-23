import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

/**
 * Custom hook for data fetching with loading and error state management.
 * @param {Function} fetchFn - The API service function to call (must return a Promise).
 * @param {Array} dependencies - Array of dependencies to trigger refetch.
 * @param {boolean} [immediate=true] - Whether to fetch immediately on mount.
 */
const useFetch = (fetchFn, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFn();
      // Most of our API responses wrap data in an outer "data" object and inner "data" payload
      const payload = response?.data?.data !== undefined ? response.data.data : response?.data;
      setData(payload);
      return payload;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "An error occurred during fetch";
      setError(errMsg);
      toast.error(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate, ...dependencies]);

  return { data, loading, error, execute, setData };
};

export default useFetch;

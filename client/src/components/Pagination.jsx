/**
 * Pagination — Reusable pagination controls
 */
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-600"
      >
        Previous
      </button>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-600"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

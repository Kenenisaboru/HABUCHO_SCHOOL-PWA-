import { useState, useMemo } from "react";

/**
 * Custom hook to manage pagination state and logic.
 * @param {number} [initialPage=1] - The starting page number.
 * @param {number} [initialTotalPages=1] - The initial total number of pages.
 */
const usePagination = (initialPage = 1, initialTotalPages = 1) => {
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  const nextPage = () => {
    if (page < totalPages) setPage(p => p + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(p => p - 1);
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  // Generate an array of page numbers to display, e.g., [1, 2, 3, 4, 5]
  // Limits to max 5 visible page buttons around current page for larger datasets
  const visiblePages = useMemo(() => {
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);
    
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [page, totalPages]);

  return {
    page,
    setPage,
    totalPages,
    setTotalPages,
    nextPage,
    prevPage,
    goToPage,
    visiblePages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export default usePagination;

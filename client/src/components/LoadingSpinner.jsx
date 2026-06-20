/**
 * LoadingSpinner — Reusable loading indicator
 */
const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizes = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} animate-spin rounded-full border-3 border-primary/20 border-t-primary`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner;

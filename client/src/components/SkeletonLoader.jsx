/**
 * SkeletonLoader — Loading placeholder for cards and lists
 */
const SkeletonLoader = ({ count = 3, type = "card" }) => {
  if (type === "table") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton h-10 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card space-y-3 border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800/60 dark:bg-slate-900">
          <div className="skeleton h-4 w-3/4 rounded-md" />
          <div className="skeleton h-3 w-full rounded-md" />
          <div className="skeleton h-3 w-5/6 rounded-md" />
          <div className="skeleton h-3 w-1/2 rounded-md" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;

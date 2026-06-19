/**
 * SkeletonLoader — Loading placeholder for cards and lists
 */
const SkeletonLoader = ({ count = 3, type = "card" }) => {
  if (type === "table") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card space-y-3">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-5/6" />
          <div className="skeleton h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;

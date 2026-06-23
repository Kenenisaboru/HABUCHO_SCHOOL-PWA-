/**
 * StatCard — Dashboard statistics card with icon
 */
const StatCard = ({ title, value, icon, color = "emerald" }) => {
  const colors = {
    emerald: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    blue: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    purple: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
    orange: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  };

  return (
    <div className="card flex items-center gap-4 border border-slate-100 bg-white p-5 shadow-xs transition-transform duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-semibold ${colors[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-100 mt-0.5">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;

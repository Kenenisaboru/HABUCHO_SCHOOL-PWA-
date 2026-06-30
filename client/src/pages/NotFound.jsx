/**
 * NotFound Page — 404 error page
 */
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="text-center">
        <p className="font-display text-gradient text-9xl font-extrabold">404</p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Page not found
        </h2>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/" className="btn-primary px-8 py-3">
            Go back home
          </Link>
          <Link to="/login" className="btn-ghost text-primary">
            Sign In →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

/**
 * NotFound Page — 404 error page
 */
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <h1 className="text-8xl font-bold text-blue-600">404</h1>
      <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Page not found</p>
      <Link to="/" className="btn-primary mt-8">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;

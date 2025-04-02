
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-lg px-6">
        <h1 className="text-9xl font-bold text-teach-blue-500 mb-4">404</h1>
        <p className="text-2xl text-gray-800 mb-4 font-display">Oops! Page not found</p>
        <p className="text-gray-600 mb-8">
          We couldn't find the page you're looking for. It might have been removed, renamed, or doesn't exist.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-teach-blue-500 text-white hover:bg-teach-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Terminal } from 'lucide-react';

/**
 * NotFound Component
 * Custom, accessible 404 error page matching the dark charcoal editorial style.
 */
function NotFound() {
  return (
    <div className="page-wrapper not-found-page">
      <div className="container">
        <div className="not-found-card">
          <div className="not-found-icon-wrap">
            <Terminal size={32} className="text-accent" />
          </div>
          <span className="not-found-code">404 // ROUTE_NOT_FOUND</span>
          <h1 className="not-found-title">Page Does Not Exist</h1>
          <p className="not-found-desc">
            The page or resource you requested could not be resolved. Please check the URL or use one of the links
            below to navigate back to the main portfolio.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              <Home size={16} />
              <span>Return Home</span>
            </Link>
            <Link to="/projects" className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Explore Projects</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

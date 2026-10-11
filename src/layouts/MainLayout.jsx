import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * ScrollToTop Component
 * Ensures the viewport resets to the top when navigating between routes.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

/**
 * MainLayout Component
 * Wraps page routes with shared Navbar, Main content wrapper, and Footer.
 */
function MainLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="main-content" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;

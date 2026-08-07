import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';



/** Setting page scroll to 0 when changing the route */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    if (document.scrollingElement) {
      document.scrollingElement.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '@/utils/scrollToTop';

/**
 * Hook that automatically scrolls to top when route changes
 * Use this in page components to ensure they start at the top
 */
export const useScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    scrollToTop('instant'); // Use instant scroll for page loads
  }, [location.pathname]);
};

export default useScrollToTop;

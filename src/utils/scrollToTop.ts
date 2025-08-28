/**
 * Utility function to scroll to the top of the page
 * @param behavior - Scroll behavior: 'smooth' for smooth scrolling, 'instant' for immediate
 */
export const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior
  });
};

/**
 * Hook to scroll to top on route changes
 */
export const useScrollToTop = () => {
  return scrollToTop;
};

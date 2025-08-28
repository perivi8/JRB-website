// Navigation utility to handle page navigation with scroll to top
export const navigateToPage = (url: string) => {
  // Scroll to top first
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Small delay to ensure scroll completes before navigation
  setTimeout(() => {
    window.location.href = url;
  }, 100);
};

// Alternative for immediate navigation with scroll to top
export const navigateToPageImmediate = (url: string) => {
  window.location.href = url;
  // Scroll to top after navigation
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 50);
};

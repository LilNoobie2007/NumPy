export const triggerHaptic = (type: 'light' | 'heavy' | 'success' = 'light') => {
  // Fail silently if the browser/device doesn't support the vibration API
  if (!('vibrate' in navigator)) return;
  
  switch (type) {
    case 'light':
      navigator.vibrate(10); // A tiny, sharp tick for minor button taps
      break;
    case 'heavy':
      navigator.vibrate(40); // A solid thump
      break;
    case 'success':
      navigator.vibrate([20, 50, 30]); // Two quick ticks for completing a log
      break;
  }
};
export const triggerHaptic = (type: 'light' | 'heavy' | 'success' = 'light') => {
  if (!('vibrate' in navigator)) return;
  
  switch (type) {
    case 'light':
      navigator.vibrate(10); // A tiny, sharp tick
      break;
    case 'heavy':
      navigator.vibrate(40); // A solid thump
      break;
    case 'success':
      navigator.vibrate([20, 50, 30]); // Two quick ticks
      break;
  }
};
// Export all services
import apiService from './api';
import { AppContext, AppProvider, APP_MODES, THEMES } from './AppContext';

// Common utility functions
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getStreakCount = (completedDates) => {
  if (!completedDates || completedDates.length === 0) {
    return 0;
  }

  // Sort dates in ascending order
  const sortedDates = [...completedDates].sort((a, b) => new Date(a) - new Date(b));
  
  let currentStreak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if the most recent date is today or yesterday
  const lastDate = new Date(sortedDates[sortedDates.length - 1]);
  lastDate.setHours(0, 0, 0, 0);
  
  const diff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  
  // If the last completed date is more than 1 day ago, streak is broken
  if (diff > 1) {
    return 0;
  }
  
  // Calculate streak by checking consecutive days
  for (let i = sortedDates.length - 1; i > 0; i--) {
    const currentDate = new Date(sortedDates[i]);
    const prevDate = new Date(sortedDates[i - 1]);
    
    currentDate.setHours(0, 0, 0, 0);
    prevDate.setHours(0, 0, 0, 0);
    
    const dayDiff = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  return currentStreak;
};

// Export everything
export {
  apiService,
  AppContext,
  AppProvider,
  APP_MODES,
  THEMES,
  formatDate,
  getStreakCount,
}; 
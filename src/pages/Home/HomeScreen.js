import React, { useContext, useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Animated,
  Dimensions,
  Alert,
  RefreshControl,
  useWindowDimensions,
  Platform,
  PixelRatio
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../../services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import RewardsSystem from '../../components/rewards/RewardsSystem';

// Context and Services
import { AppContext, APP_MODES, THEMES } from '../../services/AppContext';
import { formatDate, getStreakCount } from '../../services';

// Get screen dimensions for responsive design
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Scale factors for responsive typography and spacing
const scale = Math.min(SCREEN_WIDTH / 375, 1.0); // Cap scale at 1.0 for more compact UI
const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

// Use a default theme for static styles
const DefaultTheme = THEMES[APP_MODES.PERSONAL_GROWTH];

// Add this function before the HomeScreen component definition
// This function provides a simple way to access theme styles safely
const getThemeStyles = (themeObj, fallbackTheme = DefaultTheme) => {
  // If we have a valid theme from context, use it, otherwise use fallback
  
  // Define some presets for the unique themes
  const NEON_CYBERPUNK = {
    primary: '#00f2ff',
    secondary: '#ff00e4',
    background: '#0a0b2e',
    text: '#ffffff',
    textSecondary: '#b3b3ff',
    card: '#151638',
    cardShadow: 'rgba(0, 242, 255, 0.2)',
    accent: '#ff9400',
    completedColor: '#00f2ff',
    gradientStart: '#ff00e4',
    gradientEnd: '#00f2ff',
  };
  
  const COSMIC_ENERGY = {
    primary: '#8b5cf6',
    secondary: '#c026d3',
    background: '#130c25',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    card: '#1e1b2f',
    cardShadow: 'rgba(139, 92, 246, 0.3)',
    accent: '#f59e0b',
    completedColor: '#a78bfa',
    gradientStart: '#8b5cf6',
    gradientEnd: '#c026d3',
  };
  
  const DREAMSCAPE = {
    primary: '#06b6d4',
    secondary: '#0ea5e9',
    background: '#f0fdfa',
    text: '#334155',
    textSecondary: '#64748b',
    card: '#ffffff',
    cardShadow: 'rgba(6, 182, 212, 0.2)',
    accent: '#f472b6',
    completedColor: '#06b6d4',
    gradientStart: '#38bdf8',
    gradientEnd: '#818cf8',
  };
  
  const SUNSET_VIBES = {
    primary: '#f97316',
    secondary: '#fb923c',
    background: '#fffbeb',
    text: '#44403c',
    textSecondary: '#78716c',
    card: '#ffffff',
    cardShadow: 'rgba(249, 115, 22, 0.2)',
    accent: '#ec4899',
    completedColor: '#f97316',
    gradientStart: '#f97316',
    gradientEnd: '#db2777',
  };
  
  // Select theme based on current mode, or create something totally new
  let selectedTheme;
  
  if (themeObj?.name === 'PERSONAL_GROWTH') {
    selectedTheme = DREAMSCAPE;
  } else if (themeObj?.name === 'ACTION') {
    selectedTheme = NEON_CYBERPUNK;
  } else if (themeObj?.name === 'COSMIC') {
    selectedTheme = COSMIC_ENERGY;
  } else if (themeObj?.name === 'SUNSET') {
    selectedTheme = SUNSET_VIBES;
  } else {
    selectedTheme = fallbackTheme;
  }
  
  return {
    // Basic colors
    text: themeObj?.text || selectedTheme.text || fallbackTheme.text || '#333333',
    textSecondary: themeObj?.textSecondary || selectedTheme.textSecondary || fallbackTheme.textSecondary || '#666666',
    primary: themeObj?.primary || selectedTheme.primary || fallbackTheme.primary || '#8b5cf6',
    secondary: themeObj?.secondary || selectedTheme.secondary || fallbackTheme.secondary || '#c4b5fd',
    background: themeObj?.background || selectedTheme.background || fallbackTheme.background || '#f5f3ff',
    card: themeObj?.card || selectedTheme.card || fallbackTheme.card || '#ffffff',
    accent: themeObj?.accent || selectedTheme.accent || fallbackTheme.accent || '#a78bfa',
    success: themeObj?.success || selectedTheme.success || fallbackTheme.success || '#10b981',
    warning: themeObj?.warning || selectedTheme.warning || fallbackTheme.warning || '#f59e0b',
    error: themeObj?.error || selectedTheme.error || fallbackTheme.error || '#ef4444',
    info: themeObj?.info || selectedTheme.info || fallbackTheme.info || '#3b82f6',
    border: themeObj?.border || selectedTheme.border || fallbackTheme.border || '#e9e4ff',
    buttonText: themeObj?.buttonText || selectedTheme.buttonText || fallbackTheme.buttonText || '#ffffff',
    cardShadow: themeObj?.cardShadow || selectedTheme.cardShadow || fallbackTheme.cardShadow || 'rgba(0, 0, 0, 0.1)',
    gradientStart: themeObj?.gradientStart || selectedTheme.gradientStart || fallbackTheme.gradientStart || '#a78bfa',
    gradientEnd: themeObj?.gradientEnd || selectedTheme.gradientEnd || fallbackTheme.gradientEnd || '#8b5cf6',
    divider: themeObj?.divider || selectedTheme.divider || fallbackTheme.divider || '#e5e7eb',
    iconBackground: themeObj?.iconBackground || selectedTheme.iconBackground || fallbackTheme.iconBackground || '#f3f0ff',
    completedColor: themeObj?.completedColor || selectedTheme.completedColor || fallbackTheme.completedColor || '#10b981',
    incompletedColor: themeObj?.incompletedColor || selectedTheme.incompletedColor || fallbackTheme.incompletedColor || '#e5e7eb',
    progressTrack: themeObj?.progressTrack || selectedTheme.progressTrack || fallbackTheme.progressTrack || '#f3f0ff',
    badgeBackground: themeObj?.badgeBackground || selectedTheme.badgeBackground || fallbackTheme.badgeBackground || '#f3f0ff',
    cardHeader: themeObj?.cardHeader || selectedTheme.cardHeader || fallbackTheme.cardHeader || '#f5f3ff',
    
    // UI styles
    borderRadius: themeObj?.borderRadius || selectedTheme.borderRadius || fallbackTheme.borderRadius || 16,
    cardElevation: themeObj?.cardElevation || selectedTheme.cardElevation || fallbackTheme.cardElevation || 4,
    buttonElevation: themeObj?.buttonElevation || selectedTheme.buttonElevation || fallbackTheme.buttonElevation || 6,
    
    // Typography
    fontFamily: themeObj?.fontFamily || selectedTheme.fontFamily || fallbackTheme.fontFamily || {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: themeObj?.fontSize || selectedTheme.fontSize || fallbackTheme.fontSize || {
      h1: 28,
      h2: 24,
      h3: 20,
      h4: 18,
      body: 16,
      caption: 14,
      small: 12,
    },
    fontWeight: themeObj?.fontWeight || selectedTheme.fontWeight || fallbackTheme.fontWeight || {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    headingStyle: themeObj?.headingStyle || selectedTheme.headingStyle || fallbackTheme.headingStyle || {
      letterSpacing: 0.2,
      lineHeight: 1.4,
    },
    
    // Special effects for the new theme system
    glassmorphism: {
      backgroundColor: themeObj?.glassBg || 'rgba(255, 255, 255, 0.1)',
      borderColor: themeObj?.glassBorder || 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(8px)',
    },
    
    neomorphism: {
      lightShadow: themeObj?.neoLightShadow || 'rgba(255, 255, 255, 0.7)',
      darkShadow: themeObj?.neoDarkShadow || 'rgba(0, 0, 0, 0.1)',
      intensity: themeObj?.neoIntensity || 0.2,
    },
    
    // Animation presets
    animation: {
      duration: {
        fast: 300,
        medium: 500,
        slow: 700,
      },
      easing: {
        bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
    },
    
    // Helper method for semi-transparent colors
    withOpacity: (color, opacity) => {
      const baseColor = themeObj?.[color] || selectedTheme[color] || fallbackTheme[color];
      return baseColor ? baseColor + opacity : fallbackTheme.text + opacity;
    }
  };
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme, currentMode, habits, setHabits, switchMode } = useContext(AppContext);
  // Create a theme helper that will work even if theme is undefined
  const themeStyles = getThemeStyles(theme);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const [weather, setWeather] = useState(null);
  const [quote, setQuote] = useState({
    text: "Habits are the compound interest of self-improvement.",
    author: "James Clear"
  });
  const [dateTime, setDateTime] = useState(new Date());
  const [showTips, setShowTips] = useState(true);
  const [waterIntake, setWaterIntake] = useState(0);
  const [showRewards, setShowRewards] = useState(false);
  const [lastRewardPoints, setLastRewardPoints] = useState(0);
  const [rewardNotification, setRewardNotification] = useState(false);
  const [userPoints, setUserPoints] = useState(125); // Mock points
  const [achievements, setAchievements] = useState([
    { id: 1, title: "Early Bird", description: "Complete a habit before 8am", icon: "sunny-outline", earned: true },
    { id: 2, title: "Streak Master", description: "Maintain a 7-day streak", icon: "flame-outline", earned: true },
    { id: 3, title: "Hydration Hero", description: "Drink 8 glasses of water for 3 days", icon: "water-outline", earned: false },
    { id: 4, title: "Habit Builder", description: "Create 5 habits", icon: "build-outline", earned: false }
  ]);
  
  // Animated values for interactive UI
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const windowDimensions = useWindowDimensions();

  // Add a new state for calendar streak
  const [calendarStreak, setCalendarStreak] = useState([
    { date: '2023-08-15', completed: true },
    { date: '2023-08-16', completed: true },
    { date: '2023-08-17', completed: true },
    { date: '2023-08-18', completed: true },
    { date: '2023-08-19', completed: false }, // weekend
    { date: '2023-08-20', completed: false }, // weekend
    { date: '2023-08-21', completed: true },
    { date: '2023-08-22', completed: true },
    { date: '2023-08-23', completed: true },
    { date: '2023-08-24', completed: true },
    { date: '2023-08-25', completed: true },
    { date: '2023-08-26', completed: false }, // weekend
    { date: '2023-08-27', completed: false }, // weekend
    { date: '2023-08-28', completed: true }
  ]);

  // Add after the getDayName function
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthCalendarDays = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const totalDays = getDaysInMonth(currentYear, currentMonth);
    
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const calendarDays = [];
    
    // Add empty spaces for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push({ date: null, empty: true });
    }
    
    // Add all days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateStr = date.toISOString().split('T')[0];
      
      // Check if there's a habit completed on this day
      const hasCompletedHabit = habits.some(habit => 
        habit.completedDates.includes(dateStr)
      );
      
      calendarDays.push({
        date: dateStr,
        dayNumber: day,
        isToday: day === today.getDate(),
        completed: hasCompletedHabit
      });
    }
    
    return calendarDays;
  };

  // Add a new state for the full month calendar
  const [monthCalendar, setMonthCalendar] = useState([]);
  
  // Update the loadData function to also set the month calendar
  useEffect(() => {
    setMonthCalendar(getMonthCalendarDays());
  }, [habits]);

  // Load dummy data for demo
  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    // Mock data
    const dummyHabits = [
      {
        id: '1',
        title: 'Morning Meditation',
        description: 'Start the day with 10 minutes of mindfulness',
        frequency: 'daily',
        completedDates: ['2023-04-15', '2023-04-16', '2023-04-17', '2023-04-18'],
        icon: 'leaf',
        color: '#8b5cf6',
        mode: 'personal_growth', // Mode-specific habit
        streak: 4
      },
      {
        id: '2',
        title: 'Read 20 pages',
        description: 'Read at least 20 pages of a book',
        frequency: 'daily',
        completedDates: ['2023-04-15', '2023-04-17', '2023-04-18'],
        icon: 'book',
        color: '#3b82f6',
        mode: 'both', // Available in both modes
        streak: 2
      },
      {
        id: '3',
        title: 'Workout',
        description: '30 minutes of exercise',
        frequency: 'weekly',
        completedDates: ['2023-04-14', '2023-04-17'],
        icon: 'fitness',
        color: '#ef4444',
        mode: 'action', // Mode-specific habit
        streak: 1
      },
      {
        id: '4',
        title: 'Learn coding',
        description: 'Practice programming for 30 minutes',
        frequency: 'daily',
        completedDates: ['2023-04-15', '2023-04-16', '2023-04-17'],
        icon: 'code-slash',
        color: '#10b981',
        mode: 'action', // Mode-specific habit
        streak: 3
      },
      {
        id: '5',
        title: 'Drink water',
        description: 'Drink 8 glasses of water',
        frequency: 'daily',
        completedDates: ['2023-04-15', '2023-04-16', '2023-04-17', '2023-04-18'],
        icon: 'water',
        color: '#0ea5e9',
        mode: 'both', // Available in both modes
        streak: 4
      },
      {
        id: '6',
        title: 'Journal writing',
        description: 'Write in journal for 10 minutes',
        frequency: 'daily',
        completedDates: ['2023-04-16', '2023-04-17', '2023-04-18'],
        icon: 'pencil',
        color: '#f59e0b',
        mode: 'personal_growth', // Mode-specific habit
        streak: 3
      },
      {
        id: '7',
        title: 'Power hour',
        description: 'One hour of focused deep work',
        frequency: 'daily',
        completedDates: ['2023-04-17', '2023-04-18'],
        icon: 'timer',
        color: '#ec4899',
        mode: 'action', // Mode-specific habit
        streak: 2
      }
    ];

    setHabits(dummyHabits);

    // Simulate weather data with accurate temperature conversion
    const tempC = 22; // 22°C
    const tempF = Math.round(tempC * 9/5 + 32); // Convert to Fahrenheit
    setWeather({
      tempC: tempC,
      tempF: tempF,
      condition: 'Sunny',
      icon: 'sunny'
    });

    // Daily quote
    setQuote({
      text: "Habits are the compound interest of self-improvement.",
      author: "James Clear"
    });

    // Mock user points for display
    setUserPoints(125);

    loadData();

    // Timer to update current time
    const timerID = setInterval(() => setDateTime(new Date()), 60000);
    return () => clearInterval(timerID);
  }, []);

  // Load data function for pull to refresh
  const loadData = () => {
    // Generate last 7 days for the streak calendar (excluding current date)
    const today = new Date();
    const last7Days = Array(7).fill().map((_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });
    
    // Check if each day has at least one completed habit
    const streakData = last7Days.map(day => {
      const hasCompletedHabit = habits.some(habit => habit.completedDates.includes(day));
      return {
        date: day,
        completed: hasCompletedHabit
      };
    });
    
    setCalendarStreak(streakData);

    // Calculate streak using the improved function
    const streak = calculateImprovedStreak(habits);
    setCurrentStreak(streak);

    // Get today's habits based on current mode
    const filteredHabits = habits.filter(habit => 
      (habit.frequency === 'daily' || 
       (habit.frequency === 'weekly' && today.getDay() === 1)) // Show weekly habits on Monday
      && (habit.mode === 'both' || habit.mode === currentMode.toLowerCase().replace(' ', '_'))
    );
    
    setTodayHabits(filteredHabits);
    
    // Count completed habits for today
    const todayStr = today.toISOString().split('T')[0];
    const completed = habits.filter(habit => 
      habit.completedDates.includes(todayStr)
    ).length;
    
    setCompletedToday(completed);
    
    // Update the monthly calendar
    setMonthCalendar(getMonthCalendarDays());
  };

  // Re-animate when mode changes
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    // Reload data when mode changes to update today's habits
    loadData();
  }, [currentMode]);

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    loadData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const toggleAppMode = () => {
    // Animation for mode switch
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Cycle through modes:
    // PERSONAL_GROWTH -> ACTION -> COSMIC -> SUNSET
    let newMode;
    if (currentMode === APP_MODES.PERSONAL_GROWTH) {
      newMode = APP_MODES.ACTION;
    } else if (currentMode === APP_MODES.ACTION) {
      newMode = 'COSMIC'; // New custom mode
    } else if (currentMode === 'COSMIC') {
      newMode = 'SUNSET'; // Another custom mode
    } else {
      newMode = APP_MODES.PERSONAL_GROWTH;
    }
    
    switchMode(newMode);
  };

  const getModeIcon = () => {
    switch(currentMode) {
      case APP_MODES.PERSONAL_GROWTH:
        return 'leaf-outline';
      case APP_MODES.ACTION:
        return 'flash-outline';
      case 'COSMIC':
        return 'planet-outline';
      case 'SUNSET':
        return 'sunny-outline';
      default:
        return 'leaf-outline';
    }
  };

  const getModeDescription = () => {
    switch(currentMode) {
      case APP_MODES.PERSONAL_GROWTH:
        return 'Grow mindfully with a calm approach';
      case APP_MODES.ACTION:
        return 'High-energy productivity mode';
      case 'COSMIC':
        return 'Expand your consciousness & potential';
      case 'SUNSET':
        return 'Creativity & inspiration mode';
      default:
        return 'Focus on mindful progress';
    }
  };

  const handleHabitCheck = (habitId) => {
    // In a real app, this would mark the habit as completed for today
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const today = new Date().toISOString().split('T')[0];
        const alreadyCompleted = habit.completedDates.includes(today);
        
        if (alreadyCompleted) {
          // Remove today's date from completedDates
          return {
            ...habit,
            completedDates: habit.completedDates.filter(date => date !== today)
          };
        } else {
          // Add today's date to completedDates
          return {
            ...habit,
            completedDates: [...habit.completedDates, today]
          };
        }
      }
      return habit;
    });
    
    setHabits(updatedHabits);
    
    // Update completed count
    const today = new Date().toISOString().split('T')[0];
    const completed = updatedHabits.filter(habit => 
      habit.completedDates.includes(today)
    ).length;
    
    setCompletedToday(completed);
    
    // Show success message
    Alert.alert('Success', 'Habit status updated!');
  };

  const increaseWaterIntake = () => {
    setWaterIntake(prev => {
      // Only increase if we haven't hit the max
      if (prev < 8) {
        // If we just completed the goal, show a success message and award points
        if (prev === 7) {
          setUserPoints(prevPoints => prevPoints + 5);
          setLastRewardPoints(5);
          setRewardNotification(true);
          setTimeout(() => setRewardNotification(false), 3000);
          Alert.alert('Great job!', 'You\'ve met your water intake goal for today!');
        } else if (prev === 3) {
          // Midway encouragement
          Alert.alert('Halfway there!', 'Keep going with your water intake!');
        } else {
          // Subtle feedback
          Platform.OS === 'ios' ? 
            Alert.alert('Water intake logged!', `${prev + 1} of 8 glasses completed.`) :
            console.log(`Water intake: ${prev + 1}/8 glasses`);
        }
        return prev + 1;
      }
      return prev;
    });
  };

  // Handle reward earned callback
  const handleRewardEarned = (points) => {
    setLastRewardPoints(points);
    setRewardNotification(true);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setRewardNotification(false);
    }, 3000);
  };

  // Update the toggleHabitCompletion function to have better feedback
  const toggleHabitCompletion = async (habitId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const habitIndex = todayHabits.findIndex(h => h.id === habitId);
      
      if (habitIndex !== -1) {
        const habit = {...todayHabits[habitIndex]};
        const isCompleted = habit.completedDates.includes(today);
        
        // Haptic feedback would be added here in a real app
        
        // Toggle completion status
        let updatedCompletedDates = [...habit.completedDates];
        if (isCompleted) {
          // Remove today's date if already completed
          updatedCompletedDates = updatedCompletedDates.filter(date => date !== today);
          // Show a message when unchecking
          Alert.alert('Habit Unmarked', `"${habit.title}" has been marked as incomplete.`);
        } else {
          // Add today's date if not completed
          updatedCompletedDates.push(today);
          
          // Add a streak milestone message
          const newStreak = calculateStreak([...updatedCompletedDates]);
          if (newStreak === 3) {
            Alert.alert('Streak Milestone!', `You've completed "${habit.title}" for 3 days in a row! Keep it up!`);
          } else if (newStreak === 7) {
            Alert.alert('Impressive Streak!', `7 day streak for "${habit.title}"! You're building a solid habit!`);
            // Give extra points for 7-day streak
            setUserPoints(prev => prev + 10);
            setLastRewardPoints(10);
            setRewardNotification(true);
          } else if (newStreak === 21) {
            Alert.alert('Habit Master!', `21 days of "${habit.title}"! Science says you've formed a true habit!`);
            // Give extra points for 21-day streak
            setUserPoints(prev => prev + 20);
            setLastRewardPoints(20);
            setRewardNotification(true);
          } else {
            // Regular completion message
            Alert.alert('Habit Completed!', `Great job completing "${habit.title}"!`);
          }
        }
        
        // This logs the update to the console, simulating a database update
        await firebase.firestore.collection('habits').doc(habitId).update({
          completedDates: updatedCompletedDates,
        });
        
        // Update local state with new completion data
        const updatedHabits = [...habits].map(h => {
          if (h.id === habitId) {
            return { ...h, completedDates: updatedCompletedDates };
          }
          return h;
        });
        setHabits(updatedHabits);
        
        // Update today's habits list
        const updatedTodayHabits = [...todayHabits];
        updatedTodayHabits[habitIndex] = {
          ...habit,
          completedDates: updatedCompletedDates
        };
        setTodayHabits(updatedTodayHabits);
        
        // Update completed count
        setCompletedToday(isCompleted ? completedToday - 1 : completedToday + 1);
        
        // Update the calendar to reflect the new completion status
        setMonthCalendar(getMonthCalendarDays());
          
        // Show animation if completing a habit
        if (!isCompleted) {
          // Add points when completing a habit
          setUserPoints(prev => prev + 5);
          setLastRewardPoints(5);
          setRewardNotification(true);
          
          // Hide notification after some time
          setTimeout(() => {
            setRewardNotification(false);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error toggling habit completion:', error);
      Alert.alert('Error', 'There was a problem updating your habit. Please try again.');
    }
  };

  // Improved streak calculation that handles daily habits better
  const calculateImprovedStreak = (habits) => {
    if (!habits || habits.length === 0) return 0;
    
    // Get all dates where at least one habit was completed
    const allCompletionDates = new Set();
    habits.forEach(habit => {
      habit.completedDates.forEach(date => {
        allCompletionDates.add(date);
      });
    });
    
    // Convert to array and sort in descending order (newest first)
    const sortedDates = Array.from(allCompletionDates).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    if (sortedDates.length === 0) return 0;
    
    // Check if today or yesterday has a completion
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    today.setDate(today.getDate() - 1);
    const yesterdayStr = today.toISOString().split('T')[0];
    
    const hasToday = sortedDates.includes(todayStr);
    const hasYesterday = sortedDates.includes(yesterdayStr);
    
    // If neither today nor yesterday has a completion, streak is 0
    if (!hasToday && !hasYesterday) return 0;
    
    // Start with current streak as 1 if today has completion, otherwise 0
    let currentStreak = hasToday ? 1 : 0;
    
    // If we're counting from yesterday, add it to the streak
    if (hasYesterday && (!hasToday || currentStreak === 0)) {
      currentStreak = 1;
    }
    
    // Start checking from yesterday or the day before, depending on our starting point
    let dateToCheck = new Date(hasToday ? todayStr : yesterdayStr);
    dateToCheck.setDate(dateToCheck.getDate() - 1);
    
    // Continue checking previous days until we find a gap
    while (true) {
      const dateStr = dateToCheck.toISOString().split('T')[0];
      
      if (sortedDates.includes(dateStr)) {
        currentStreak++;
        // Move to the previous day
        dateToCheck.setDate(dateToCheck.getDate() - 1);
      } else {
        // Found a gap in the streak
        break;
      }
    }
    
    return currentStreak;
  };

  // Add this function after calculateStreak
  const handleAcceptChallenge = () => {
    // Show a success message
    Alert.alert('Challenge Accepted!', 
      `You've accepted the daily ${currentMode === APP_MODES.PERSONAL_GROWTH ? 'boost' : 'challenge'}. 
      Complete it to earn extra points!`
    );
    
    // Award points for accepting the challenge
    setUserPoints(prev => prev + 3);
    setLastRewardPoints(3);
    setRewardNotification(true);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setRewardNotification(false);
    }, 3000);
    
    // In a real app, this would also update the backend
    // navigation.navigate('Habits');
  };

  // Add a function to format day name
  const getDayName = (dateString) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  // Streak calculation for individual habits
  const calculateStreak = (completedDates) => {
    if (!completedDates || completedDates.length === 0) return 0;
    
    // Sort dates in ascending order
    const sortedDates = [...completedDates].sort();
    
    // Get today's date and yesterday's date
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    today.setDate(today.getDate() - 1);
    const yesterdayStr = today.toISOString().split('T')[0];
    
    // Check if we completed the habit today or yesterday
    const hasToday = completedDates.includes(todayStr);
    const hasYesterday = completedDates.includes(yesterdayStr);
    
    // If neither today nor yesterday is completed, streak is 0
    if (!hasToday && !hasYesterday) return 0;
    
    // Start counting streak
    let streak = hasToday ? 1 : 0;
    let currentDate = new Date(hasToday ? todayStr : yesterdayStr);
    
    // Keep checking previous days until we find a break in the streak
    while (true) {
      currentDate.setDate(currentDate.getDate() - 1);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      if (completedDates.includes(dateStr)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Add a safety check for habits
  const [todayHabits, setTodayHabits] = useState([]);

  // Add a basic error handler to help with debugging
  useEffect(() => {
    // Add error boundary using try-catch
    const handleRender = () => {
      try {
        // Validate critical data
        if (!habits) {
          console.warn('HomeScreen: habits is null or undefined');
          setHabits([]);
        }
        
        if (!todayHabits) {
          console.warn('HomeScreen: todayHabits is null or undefined');
          setTodayHabits([]);
        }
        
        // Calculate streak safely
        const calculatedStreak = calculateImprovedStreak(habits || []);
        setCurrentStreak(calculatedStreak);
      } catch (error) {
        console.error('HomeScreen rendering error:', error);
        // Set fallback values
        setCurrentStreak(0);
      }
    };
    
    handleRender();
  }, [habits, todayHabits]);

  // Add a conditional check around showTips
  {showTips && (
    <Card style={styles.tipsCard}>
      {/* Card content */}
    </Card>
  )}

  // At the start of the HomeScreen component, add this useEffect
  useEffect(() => {
    console.log('HomeScreen loaded directly');
    
    // Ensure we have a token set for proper authentication state
    const ensureAuthenticated = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          await AsyncStorage.setItem('userToken', 'demo-token');
          console.log('Authentication token set in HomeScreen');
        }
      } catch (error) {
        console.error('Error setting authentication in HomeScreen:', error);
      }
    };
    
    ensureAuthenticated();
  }, []);

  return (
    <View style={[styles.container, { 
      backgroundColor: themeStyles.background,
      paddingTop: Platform.OS === 'ios' ? normalize(8) : 0
    }]}>
      <Header 
        title="Rick&Morty" 
        rightIcon="trophy-outline"
        onRightIconPress={() => setShowRewards(!showRewards)}
        style={{ 
          backgroundColor: themeStyles.withOpacity('card', '90'),
          borderBottomColor: themeStyles.withOpacity('primary', '20'),
          borderBottomWidth: 1
        }}
        titleStyle={{ color: themeStyles.primary }}
      />
      
      {/* Reward notification */}
      {rewardNotification && (
        <Animated.View 
          style={[
            styles.rewardNotification,
            { 
              backgroundColor: themeStyles.withOpacity('primary', 'DD'),
              borderWidth: 1,
              borderColor: themeStyles.withOpacity('secondary', '50'),
              shadowColor: themeStyles.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 10,
            }
          ]}
        >
          <Ionicons name="trophy" size={normalize(16)} color="#FFF" />
          <Text style={styles.rewardNotificationText}>
            Achievement unlocked! +{lastRewardPoints} points
          </Text>
        </Animated.View>
      )}
      
      {showRewards ? (
        <Card style={[styles.rewardsCard, { 
          backgroundColor: themeStyles.card,
          borderColor: themeStyles.withOpacity('primary', '30'),
          borderWidth: 1,
        }]}>
          <RewardsSystem 
            habits={habits}
            streakCount={currentStreak}
            waterIntake={waterIntake}
            onRewardEarned={handleRewardEarned}
            theme={themeStyles}
          />
        </Card>
      ) : (
        <Animated.ScrollView 
          style={[styles.scrollView, { 
            opacity: fadeAnim 
          }]} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[themeStyles.primary]}
              tintColor={themeStyles.primary}
            />
          }
        >
          <View 
            style={[styles.greetingContainer, {
              backgroundColor: 'transparent',
              marginTop: normalize(16),
            }]}>
            <View style={{
              backgroundColor: themeStyles.withOpacity('primary', '10'),
              borderRadius: themeStyles.borderRadius,
              padding: normalize(16),
              borderLeftWidth: 3,
              borderLeftColor: themeStyles.primary,
              shadowColor: themeStyles.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
            }}>
              <Text style={[styles.greeting, { 
                fontSize: normalize(28),
                fontWeight: 'bold',
                color: themeStyles.primary,
              }]}>{getGreeting()}</Text>
              <Text style={[styles.modeName, { 
                color: themeStyles.primary, 
                fontSize: normalize(16),
                fontWeight: '600'
              }]}>
                {currentMode === APP_MODES.PERSONAL_GROWTH 
                  ? 'Personal Growth Mode' 
                  : currentMode === APP_MODES.ACTION 
                    ? 'Action Mode' 
                    : currentMode === 'COSMIC' 
                      ? 'Cosmic Energy Mode' 
                      : 'Sunset Vibes Mode'
                }
              </Text>
            </View>
          </View>

          {/* Monthly Calendar Card */}
          <View style={{marginBottom: normalize(16)}}>
            <Card style={[styles.calendarCard, {
              backgroundColor: themeStyles.card,
              borderRadius: themeStyles.borderRadius,
              shadowColor: themeStyles.cardShadow,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 16,
              borderWidth: 1,
              borderColor: themeStyles.withOpacity('primary', '30'),
              overflow: 'hidden',
            }]}>
              <View style={{
                backgroundColor: themeStyles.withOpacity('card', 'FF'),
                padding: normalize(14)
              }}>
                <View style={styles.calendarHeader}>
                  <View style={styles.calendarTitleContainer}>
                    <Ionicons name="calendar" size={normalize(18)} color={themeStyles.primary} />
                    <Text style={[styles.calendarTitle, { color: themeStyles.text, fontSize: normalize(14) }]}>
                      Monthly Progress
                    </Text>
                  </View>
                  <Animated.View 
                    style={[
                      styles.calendarBadge,
                      { 
                        backgroundColor: themeStyles.primary,
                        borderRadius: normalize(12),
                        paddingHorizontal: normalize(8),
                        paddingVertical: normalize(4),
                      }
                    ]}
                  >
                    <Text style={[styles.calendarBadgeText, { color: '#FFF' }]}>
                      {currentStreak} day streak
                    </Text>
                  </Animated.View>
                </View>

                <View style={styles.calendarWrapper}>
                  <View style={styles.calendarLeft}>
                    <Text style={[styles.calendarDescription, { color: themeStyles.textSecondary }]}>
                      {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </Text>
                    
                    <Text style={[styles.streakInfo, { color: themeStyles.text }]}>
                      <Text style={{ fontWeight: 'bold', color: themeStyles.primary }}>{completedToday}</Text> completed today
                    </Text>

                    <Text style={[styles.streakInfo, { color: themeStyles.text, marginTop: normalize(4) }]}>
                      Current streak: <Text style={{ fontWeight: 'bold', color: themeStyles.primary }}>{currentStreak}</Text> days
                    </Text>
                    
                    <TouchableOpacity 
                      style={[
                        styles.calendarButton, 
                        { 
                          backgroundColor: themeStyles.progressTrack,
                          borderRadius: themeStyles.borderRadius,
                          marginTop: normalize(8)
                        }
                      ]}
                      onPress={() => {
                        setUserPoints(prev => prev + 2);
                        setLastRewardPoints(2);
                        setRewardNotification(true);
                        setTimeout(() => setRewardNotification(false), 3000);
                        Alert.alert('Streak Bonus!', 'You earned 2 points for checking your progress today!');
                      }}
                    >
                      <Text style={[
                        styles.calendarButtonText, 
                        { 
                          color: themeStyles.primary,
                          fontWeight: themeStyles.fontWeight.semibold,
                          fontSize: normalize(12)
                        }
                      ]}>
                        Claim Bonus (+2 pts)
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.calendarRight}>
                    {/* Day names row */}
                    <View style={styles.calendarDayNames}>
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                        <Text 
                          key={index} 
                          style={[
                            styles.calendarDayName, 
                            { 
                              color: index === 0 || index === 6 
                                ? themeStyles.primary + 'AA' 
                                : themeStyles.textSecondary
                            }
                          ]}
                        >
                          {day}
                        </Text>
                      ))}
                    </View>
                    
                    {/* Calendar grid */}
                    <View style={styles.calendarGrid}>
                      {monthCalendar.map((day, index) => (
                        <View 
                          key={index} 
                          style={[
                            styles.calendarDay,
                            day.empty && styles.calendarDayEmpty
                          ]}
                        >
                          {!day.empty && (
                            <View style={[
                              styles.calendarDayCircle,
                              day.isToday && { 
                                borderColor: themeStyles.primary,
                                borderWidth: 1
                              },
                              day.completed && { 
                                backgroundColor: themeStyles.primary + '20'
                              }
                            ]}>
                              <Text style={[
                                styles.calendarDayNumber,
                                { 
                                  color: day.completed 
                                    ? themeStyles.primary 
                                    : day.isToday 
                                      ? themeStyles.primary
                                      : themeStyles.text 
                                },
                                day.isToday && { fontWeight: 'bold' }
                              ]}>
                                {day.dayNumber}
                              </Text>
                              {day.completed && (
                                <View style={[
                                  styles.calendarCompletedDot,
                                  { backgroundColor: themeStyles.completedColor }
                                ]} />
                              )}
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            </Card>
          </View>

          {/* Date & Weather Card */}
          <Card style={styles.weatherCard}>
            <View style={styles.weatherContent}>
              <View>
                <Text style={[styles.dateText, { color: themeStyles.text }]}>
                  {dateTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </Text>
                <Text style={[styles.timeText, { color: themeStyles.text + '99' }]}>
                  {dateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              
              {weather && (
                <View style={styles.weatherInfo}>
                  <Ionicons name={weather.icon} size={normalize(24)} color={DefaultTheme.primary} />
                  <Text style={[styles.tempText, { color: themeStyles.text }]}>{weather.tempC}°C / {weather.tempF}°F</Text>
                  <Text style={[styles.weatherDesc, { color: themeStyles.text + '99' }]}>{weather.condition}</Text>
                </View>
              )}
            </View>
          </Card>

          {/* Mode Switcher Card with enhanced styling */}
          <View style={{marginBottom: normalize(16)}}>
            <Card style={[
              styles.modeCard, 
              { 
                overflow: 'hidden',
                borderRadius: themeStyles.borderRadius,
              }
            ]}>
              <View style={{
                borderWidth: 2, 
                borderColor: themeStyles.withOpacity('primary', '30'),
                backgroundColor: themeStyles.withOpacity('card', 'FF'),
                shadowColor: themeStyles.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 10,
                borderRadius: themeStyles.borderRadius,
              }}>
                <Animated.View 
                  style={{
                    transform: [{scale: scaleAnim}],
                    padding: normalize(12),
                  }}
                >
                  <View style={styles.modeContent}>
                    <View style={styles.modeIconContainer}>
                      <View style={[
                        styles.modeIconCircle, 
                        { 
                          backgroundColor: themeStyles.withOpacity('primary', '30'),
                          borderRadius: themeStyles.borderRadius,
                          borderWidth: 1,
                          borderColor: themeStyles.withOpacity('primary', '50'),
                        }
                      ]}>
                        <Ionicons 
                          name={getModeIcon()} 
                          size={normalize(24)} 
                          color={themeStyles.primary} 
                        />
                      </View>
                    </View>
                    <View style={styles.modeInfo}>
                      <Text style={[
                        styles.modeTitle, 
                        { 
                          color: themeStyles.text, 
                          fontSize: normalize(16),
                          fontWeight: '600'
                        }
                      ]}>
                        {currentMode === APP_MODES.PERSONAL_GROWTH 
                          ? 'Personal Growth Mode' 
                          : currentMode === APP_MODES.ACTION 
                            ? 'Action Mode' 
                            : currentMode === 'COSMIC' 
                              ? 'Cosmic Energy Mode' 
                              : 'Sunset Vibes Mode'
                        }
                      </Text>
                      <Text style={[
                        styles.modeDescription, 
                        { 
                          color: themeStyles.textSecondary, 
                          fontSize: normalize(14) 
                        }
                      ]}>
                        {getModeDescription()}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={[
                        styles.modeSwitchButton, 
                        { 
                          overflow: 'hidden',
                          borderRadius: themeStyles.borderRadius,
                          elevation: themeStyles.buttonElevation,
                          shadowColor: themeStyles.primary,
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.4,
                          shadowRadius: 8,
                          backgroundColor: themeStyles.primary,
                        }
                      ]}
                      onPress={toggleAppMode}
                    >
                      <Ionicons 
                        name="swap-horizontal" 
                        size={normalize(18)} 
                        color={themeStyles.buttonText} 
                      />
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </View>
            </Card>
          </View>

          {/* Quote of the day */}
          {quote && (
            <TouchableOpacity
              onPress={() => {
                const quotes = [
                  { text: "Habits are the compound interest of self-improvement.", author: "James Clear" },
                  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
                  { text: "The quality of your life is determined by the quality of your habits.", author: "Brian Tracy" },
                  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
                  { text: "Successful people are simply those with successful habits.", author: "Brian Tracy" }
                ];
                
                // Get a new random quote that's different from the current one
                let newQuote;
                do {
                  newQuote = quotes[Math.floor(Math.random() * quotes.length)];
                } while (quote && quote.text === newQuote.text);
                
                setQuote(newQuote);
                Alert.alert("New Quote!", "Refreshed with wisdom for your day.");
              }}
            >
              <Card style={styles.quoteCard}>
                <Ionicons name="quote" size={normalize(20)} color={DefaultTheme.primary} style={styles.quoteIcon} />
                <Text style={[styles.quoteText, { color: themeStyles.text, fontSize: normalize(15) }]}>
                  "{quote?.text || "Habits are the compound interest of self-improvement."}"
                </Text>
                <Text style={[styles.quoteAuthor, { color: themeStyles.text + '80', fontSize: normalize(13) }]}>
                  — {quote?.author || "James Clear"}
                </Text>
              </Card>
            </TouchableOpacity>
          )}

          {/* Stats card */}
          <View style={{marginBottom: normalize(16)}}>
            <Card style={[styles.statsCard, {
              overflow: 'hidden',
              borderRadius: themeStyles.borderRadius,
            }]}>
              <View style={{
                backgroundColor: themeStyles.withOpacity('card', 'FF'),
                borderRadius: themeStyles.borderRadius,
                padding: normalize(16),
                borderWidth: 1,
                borderColor: themeStyles.withOpacity('primary', '20'),
              }}>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text 
                      style={[styles.statValue, { 
                        color: themeStyles.primary, 
                        fontSize: normalize(32),
                        fontWeight: 'bold',
                      }]}
                    >
                      {currentStreak}
                    </Text>
                    <Text style={[styles.statLabel, { color: themeStyles.text, fontSize: normalize(14) }]}>Day Streak</Text>
                  </View>
                  <View style={[styles.divider, { backgroundColor: themeStyles.divider }]} />
                  <View style={styles.statItem}>
                    <Text 
                      style={[styles.statValue, { 
                        color: themeStyles.primary, 
                        fontSize: normalize(32),
                        fontWeight: 'bold',
                      }]}
                    >
                      {completedToday}
                    </Text>
                    <Text style={[styles.statLabel, { color: themeStyles.text, fontSize: normalize(14) }]}>Completed Today</Text>
                  </View>
                  <View style={[styles.divider, { backgroundColor: themeStyles.divider }]} />
                  <View style={styles.statItem}>
                    <Text 
                      style={[styles.statValue, { 
                        color: themeStyles.primary, 
                        fontSize: normalize(32),
                        fontWeight: 'bold',
                      }]}
                    >
                      {habits.length}
                    </Text>
                    <Text style={[styles.statLabel, { color: themeStyles.text, fontSize: normalize(14) }]}>Total Habits</Text>
                  </View>
                </View>
              </View>
            </Card>
          </View>

          {/* Water Tracker - Modified to be smaller */}
          <Card style={styles.waterTrackerCard}>
            <View style={styles.waterTrackerHeader}>
              <View style={styles.waterTitleContainer}>
                <Ionicons name="water-outline" size={normalize(22)} color={DefaultTheme.primary} />
                <Text style={[styles.sectionTitle, { color: themeStyles.text }]}>
                  Water Tracker
                </Text>
              </View>
              <Text style={[styles.waterCount, { color: themeStyles.primary, fontSize: normalize(15) }]}>
                {waterIntake}/8 glasses
              </Text>
            </View>
            
            <Text style={[styles.itemDescription, { color: themeStyles.text + '99', marginBottom: normalize(12) }]}>
              Stay hydrated! Tap the glasses below to track your water intake for the day.
            </Text>
            
            <View style={styles.waterGlassesContainer}>
              {[...Array(8)].map((_, i) => {
                // Calculate dynamic size based on screen width
                const screenWidth = windowDimensions.width - normalize(64); // Account for padding
                const size = Math.min(normalize(45), screenWidth / 4.5); // Limit to 4-5 per row
                
                return (
                  <TouchableOpacity 
                    key={i} 
                    style={[
                      styles.waterGlass, 
                      { 
                        borderColor: themeStyles.primary,
                        backgroundColor: i < waterIntake ? themeStyles.primary + '20' : 'transparent',
                        transform: [{ scale: i < waterIntake ? 1 : 0.9 }],
                        width: size,
                        height: size,
                        borderRadius: size / 2
                      }
                    ]}
                    onPress={increaseWaterIntake}
                  >
                    <Ionicons 
                      name="water" 
                      size={size * 0.5} // Make icon size proportional to container
                      color={i < waterIntake ? themeStyles.primary : themeStyles.primary + '40'} 
                    />
                    {i < waterIntake && (
                      <View style={styles.checkmarkBadge}>
                        <Ionicons name="checkmark-circle" size={normalize(14)} color={themeStyles.primary} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          {/* Profile and Points Section - New */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={{marginBottom: normalize(16)}}
          >
            <Card style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <View style={styles.profileInfo}>
                  <View style={styles.profileAvatar}>
                    <Text style={styles.profileInitials}>RM</Text>
                  </View>
                  <View style={styles.profileDetails}>
                    <Text style={[styles.profileName, { color: themeStyles.text, fontSize: normalize(16) }]}>
                      Rick Morty
                    </Text>
                    <Text style={[styles.profileBio, { color: themeStyles.text + '99', fontSize: normalize(13) }]}>
                      Habit enthusiast
                    </Text>
                  </View>
                </View>
                <View style={styles.pointsContainer}>
                  <Ionicons name="star" size={normalize(18)} color="#FFD700" />
                  <Text style={[styles.pointsText, { color: themeStyles.text, fontSize: normalize(18) }]}>
                    {userPoints} pts
                  </Text>
                </View>
              </View>
              
              <View style={styles.levelProgress}>
                <View style={[styles.progressBar, { backgroundColor: themeStyles.primary + '30' }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${(userPoints % 100) / 100 * 100}%`, backgroundColor: themeStyles.primary }
                    ]}
                  />
                </View>
                <Text style={[styles.levelText, { color: themeStyles.text + '80', fontSize: normalize(12) }]}>
                  Level {Math.floor(userPoints / 100) + 1} • {100 - (userPoints % 100)} points to next level
                </Text>
              </View>
            </Card>
          </TouchableOpacity>

          {/* Achievements Section - New */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Achievements')}>
                <Text style={styles.seeAllBtn}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.achievementsScrollView}
            >
              {achievements.map((achievement) => (
                <TouchableOpacity 
                  key={achievement.id} 
                  onPress={() => {
                    if (achievement.earned) {
                      setUserPoints(prev => prev + 1);
                      setLastRewardPoints(1);
                      setRewardNotification(true);
                      setTimeout(() => setRewardNotification(false), 3000);
                      Alert.alert('Achievement Details', achievement.description);
                    } else {
                      Alert.alert('Locked Achievement', 'Complete the requirements to unlock this achievement!');
                    }
                  }}
                  style={styles.achievementCard}
                >
                  <View style={[
                    styles.achievementIconContainer, 
                    { 
                      backgroundColor: achievement.earned ? themeStyles.primary + '20' : themeStyles.textSecondary + '20',
                      borderColor: achievement.earned ? themeStyles.primary : themeStyles.textSecondary + '50',
                    }
                  ]}>
                    <Ionicons 
                      name={achievement.icon} 
                      size={normalize(22)} 
                      color={achievement.earned ? themeStyles.primary : themeStyles.textSecondary} 
                    />
                  </View>
                  <Text style={[
                    styles.achievementTitle, 
                    { 
                      color: achievement.earned ? themeStyles.text : themeStyles.textSecondary,
                      fontSize: normalize(13)
                    }
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDesc, 
                    { 
                      color: themeStyles.text + '80',
                      fontSize: normalize(11)
                    }
                  ]}>
                    {achievement.description}
                  </Text>
                  {!achievement.earned && (
                    <View style={styles.achievementLock}>
                      <Ionicons name="lock-closed" size={normalize(12)} color={DefaultTheme.textSecondary + '90'} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Habit Criteria - New */}
          <Card style={styles.criteriaCard}>
            <View style={styles.criteriaHeader}>
              <Ionicons name="checkmark-circle-outline" size={normalize(20)} color={DefaultTheme.primary} />
              <Text style={[styles.criteriaTitle, { color: themeStyles.text, fontSize: normalize(16) }]}>
                Habit Criteria
              </Text>
            </View>
            <View style={styles.criteriaList}>
              <View style={styles.criteriaItem}>
                <Ionicons name="time-outline" size={normalize(16)} color={DefaultTheme.primary} />
                <Text style={[styles.criteriaText, { color: themeStyles.text + '99', fontSize: normalize(14) }]}>
                  Consistency is key: same time daily
                </Text>
              </View>
              <View style={styles.criteriaItem}>
                <Ionicons name="flag-outline" size={normalize(16)} color={DefaultTheme.primary} />
                <Text style={[styles.criteriaText, { color: themeStyles.text + '99', fontSize: normalize(14) }]}>
                  Start with small, specific goals
                </Text>
              </View>
              <View style={styles.criteriaItem}>
                <Ionicons name="link-outline" size={normalize(16)} color={DefaultTheme.primary} />
                <Text style={[styles.criteriaText, { color: themeStyles.text + '99', fontSize: normalize(14) }]}>
                  Stack with existing habits
                </Text>
              </View>
            </View>
          </Card>

          {/* Today's Habits */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { 
                color: themeStyles.text,
                fontSize: normalize(18),
                fontWeight: '700',
              }]}>Today's Habits</Text>
              <TouchableOpacity 
                style={{
                  backgroundColor: themeStyles.primary,
                  paddingHorizontal: normalize(12),
                  paddingVertical: normalize(6),
                  borderRadius: normalize(16),
                }}
                onPress={() => navigation.navigate('Habits')}
              >
                <Text style={[styles.seeAllBtn, { color: '#FFF' }]}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {todayHabits.length > 0 ? (
              <View style={styles.habitsContainer}>
                {todayHabits.map((habit, index) => {
                  const today = new Date().toISOString().split('T')[0];
                  const isCompleted = habit.completedDates.includes(today);
                  const streakCount = habit.streak || calculateStreak(habit.completedDates);
                  
                  return (
                    <TouchableOpacity
                      key={habit.id}
                      style={[styles.habitCard, { 
                        backgroundColor: themeStyles.card,
                        borderWidth: 1,
                        borderColor: isCompleted 
                          ? themeStyles.withOpacity('primary', '50') 
                          : themeStyles.withOpacity('primary', '20'),
                        shadowColor: themeStyles.primary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        marginBottom: normalize(12),
                        width: '100%',
                      }]}
                      onPress={() => toggleHabitCompletion(habit.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.habitIconContainer}>
                        <View
                          style={[
                            styles.habitIcon,
                            { 
                              backgroundColor: habit.color || themeStyles.primary,
                              width: normalize(48),
                              height: normalize(48),
                              borderRadius: normalize(24),
                            }
                          ]}
                        >
                          <Ionicons name={habit.icon || "water-outline"} size={normalize(24)} color="#fff" />
                        </View>
                      </View>
                      
                      <View style={styles.habitInfo}>
                        <Text style={[styles.habitName, { 
                          color: themeStyles.text,
                          fontWeight: '700',
                          fontSize: normalize(16),
                          marginBottom: normalize(6),
                        }]}>{habit.title}</Text>
                        <View style={styles.streakContainer}>
                          <Ionicons name="flame-outline" size={normalize(14)} color={themeStyles.accent} />
                          <Text style={[styles.streakText, { 
                            color: themeStyles.text + '80',
                            fontSize: normalize(13), 
                          }]}>{streakCount} day{streakCount !== 1 ? 's' : ''}</Text>
                        </View>
                      </View>
                      
                      <TouchableOpacity
                        style={[
                          styles.habitCheckbox,
                          { 
                            borderColor: themeStyles.primary,
                            width: normalize(28),
                            height: normalize(28),
                            borderRadius: normalize(14),
                            borderWidth: 2,
                            transform: [{ scale: isCompleted ? 1.1 : 1 }],
                          },
                          isCompleted && { 
                            backgroundColor: themeStyles.primary,
                            shadowColor: themeStyles.primary,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.4,
                            shadowRadius: 4,
                          }
                        ]}
                        onPress={() => toggleHabitCompletion(habit.id)}
                      >
                        {isCompleted && (
                          <Ionicons name="checkmark" size={normalize(18)} color="#fff" />
                        )}
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={[styles.emptyHabitsContainer, { padding: normalize(20) }]}>
                <Text style={[styles.emptyText, { color: themeStyles.text + '80', marginBottom: normalize(16) }]}>No habits scheduled for today</Text>
                <TouchableOpacity 
                  style={[styles.addHabitBtn, { 
                    borderRadius: normalize(8),
                    backgroundColor: themeStyles.primary,
                    paddingVertical: normalize(12),
                  }]}
                  onPress={() => navigation.navigate('CreateHabit')}
                >
                  <Text style={[styles.addHabitBtnText, { fontSize: normalize(16) }]}>Add a new habit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Daily Challenge Card */}
          <Card style={styles.challengeCard}>
            <TouchableOpacity 
              style={styles.challengeHeader}
              onPress={() => {
                Alert.alert(
                  currentMode === APP_MODES.PERSONAL_GROWTH ? 'Daily Boost' : 'Daily Challenge',
                  'Complete this activity to boost your personal growth or productivity!',
                  [
                    {text: 'Learn More', onPress: () => handleAcceptChallenge()},
                    {text: 'Cancel', style: 'cancel'}
                  ]
                );
              }}
            >
              <Ionicons 
                name={currentMode === APP_MODES.PERSONAL_GROWTH ? "star" : "trophy"} 
                size={normalize(22)} 
                color={DefaultTheme.primary} 
              />
              <Text style={[styles.challengeTitle, { color: DefaultTheme.text, fontSize: normalize(16) }]}>
                Daily {currentMode === APP_MODES.PERSONAL_GROWTH ? 'Boost' : 'Challenge'}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.challengeText, { color: DefaultTheme.text + '99', fontSize: normalize(14) }]}>
              {currentMode === APP_MODES.PERSONAL_GROWTH 
                ? "Take 5 minutes to express gratitude for one thing in your life."
                : "Complete all your tasks 10 minutes faster than usual today!"}
            </Text>
            <Button 
              title="Accept" 
              variant="outline"
              size="small"
              style={styles.challengeButton}
              onPress={handleAcceptChallenge}
            />
          </Card>

          {/* Quick Tips */}
          {showTips && (
            <Card style={styles.tipsCard}>
              <View style={styles.tipsHeader}>
                <View style={styles.tipsHeaderLeft}>
                  <Ionicons name="bulb-outline" size={normalize(22)} color={DefaultTheme.primary} />
                  <Text style={[styles.tipsTitle, { color: DefaultTheme.text, fontSize: normalize(16) }]}>
                    Quick Tips
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={() => {
                    // Animate the hiding
                    Animated.timing(fadeAnim, {
                      toValue: 0,
                      duration: 300,
                      useNativeDriver: true,
                    }).start(() => {
                      setShowTips(false);
                      // Fade back in
                      Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                      }).start();
                    });
                  }}
                >
                  <Ionicons name="close-outline" size={normalize(22)} color={DefaultTheme.text + '60'} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.tipText, { color: DefaultTheme.text + '99', fontSize: normalize(14) }]}>
                {currentMode === APP_MODES.PERSONAL_GROWTH 
                  ? "Start small: Focus on one habit at a time for better results."
                  : "Batch similar tasks together to increase efficiency."}
              </Text>
            </Card>
          )}
        </Animated.ScrollView>
      )}

      {/* Add a floating action button for adding habits */}
      <TouchableOpacity
        style={[styles.floatingIcon, {
          backgroundColor: themeStyles.primary,
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 6,
          zIndex: 1000,
        }]}
        onPress={() => navigation.navigate('CreateHabit')}
      >
        <Ionicons name="add" size={normalize(28)} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: normalize(16),
  },
  greetingContainer: {
    marginBottom: normalize(20),
  },
  greeting: {
    fontWeight: 'bold',
  },
  modeName: {
    marginTop: normalize(4),
  },
  weatherCard: {
    marginBottom: normalize(16),
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: normalize(16),
    fontWeight: '500',
  },
  timeText: {
    fontSize: normalize(14),
    marginTop: normalize(2),
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tempText: {
    fontSize: normalize(18),
    fontWeight: '600',
    marginLeft: normalize(4),
    marginRight: normalize(4),
  },
  weatherDesc: {
    fontSize: normalize(14),
  },
  modeCard: {
    marginBottom: normalize(16),
    overflow: 'hidden',
  },
  modeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(2),
  },
  modeIconContainer: {
    marginRight: normalize(14),
  },
  modeIconCircle: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    fontWeight: '600',
    marginBottom: normalize(4),
  },
  modeDescription: {
  },
  modeSwitchButton: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteCard: {
    marginBottom: normalize(16),
    paddingVertical: normalize(16),
    alignItems: 'center',
  },
  quoteIcon: {
    marginBottom: normalize(8),
  },
  quoteText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: normalize(8),
    lineHeight: normalize(22),
  },
  quoteAuthor: {
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
  statsCard: {
    marginBottom: normalize(16),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
  },
  statLabel: {
    marginTop: normalize(4),
  },
  divider: {
    width: 1,
    height: normalize(40),
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  waterTrackerCard: {
    marginBottom: normalize(16),
  },
  waterTrackerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(14),
  },
  waterTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterTitle: {
    fontWeight: '600',
    marginLeft: normalize(8),
  },
  waterCount: {
    fontSize: normalize(14),
    fontWeight: '500',
  },
  waterGlassesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: normalize(8),
  },
  waterGlass: {
    width: normalize(45),
    height: normalize(45),
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: normalize(22.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: normalize(8),
    marginHorizontal: normalize(4),
  },
  section: {
    marginBottom: normalize(16),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  sectionTitle: {
    fontWeight: '600',
  },
  seeAllBtn: {
    color: DefaultTheme.primary,
    fontWeight: '500',
  },
  habitsContainer: {
    width: '100%',
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: normalize(16),
    padding: normalize(16),
    marginBottom: normalize(12),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  habitIconContainer: {
    marginRight: normalize(16),
  },
  habitIcon: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(22),
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: normalize(16),
    fontWeight: '600',
    marginBottom: normalize(4),
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: normalize(12),
    marginLeft: normalize(4),
  },
  habitActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitCheckbox: {
    width: normalize(24),
    height: normalize(24),
    borderRadius: normalize(12),
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitCheckboxCompleted: {
    // The background color will be set dynamically
  },
  emptyHabitsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontStyle: 'italic',
  },
  addHabitBtn: {
    width: '100%',
    padding: normalize(16),
    borderRadius: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addHabitBtnText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: normalize(16),
  },
  challengeCard: {
    marginBottom: normalize(16),
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  challengeTitle: {
    fontWeight: '600',
    marginLeft: normalize(8),
  },
  challengeText: {
    marginBottom: normalize(12),
    lineHeight: normalize(20),
  },
  challengeButton: {
    alignSelf: 'flex-start',
  },
  tipsCard: {
    marginBottom: normalize(16),
  },
  tipsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  tipsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipsTitle: {
    fontWeight: '600',
    marginLeft: normalize(8),
  },
  tipText: {
    lineHeight: normalize(20),
  },
  rewardNotification: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? normalize(90) : normalize(70),
    left: normalize(16),
    right: normalize(16),
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(8),
    borderRadius: normalize(8),
    zIndex: 10,
  },
  rewardNotificationText: {
    color: '#FFF',
    marginLeft: normalize(8),
    fontWeight: '500',
    fontSize: normalize(13),
  },
  rewardsCard: {
    flex: 1,
    marginHorizontal: normalize(12),
    marginBottom: normalize(12),
    marginTop: normalize(4),
  },
  profileCard: {
    marginBottom: normalize(16),
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: DefaultTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: normalize(12),
  },
  profileInitials: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  profileDetails: {
    justifyContent: 'center',
  },
  profileName: {
    fontWeight: '600',
    marginBottom: normalize(2),
  },
  profileBio: {
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DefaultTheme.primary + '10',
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(6),
    borderRadius: normalize(16),
  },
  pointsText: {
    fontWeight: '600',
    marginLeft: normalize(4),
  },
  levelProgress: {
    marginTop: normalize(4),
  },
  progressBar: {
    height: normalize(6),
    borderRadius: normalize(3),
    marginBottom: normalize(6),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: normalize(3),
  },
  levelText: {
    textAlign: 'right',
  },
  achievementsScrollView: {
    marginBottom: normalize(10),
  },
  achievementCard: {
    width: normalize(120),
    backgroundColor: '#ffffff',
    borderRadius: normalize(12),
    padding: normalize(10),
    marginRight: normalize(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  achievementIconContainer: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(25),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: normalize(8),
    borderWidth: 1,
  },
  achievementTitle: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: normalize(4),
  },
  achievementDesc: {
    textAlign: 'center',
  },
  achievementLock: {
    position: 'absolute',
    top: normalize(8),
    right: normalize(8),
    backgroundColor: '#ffffff90',
    width: normalize(20),
    height: normalize(20),
    borderRadius: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  criteriaCard: {
    marginBottom: normalize(16),
  },
  criteriaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  criteriaTitle: {
    fontWeight: '600',
    marginLeft: normalize(8),
  },
  criteriaList: {
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  criteriaText: {
    marginLeft: normalize(10),
  },
  itemDescription: {
    fontSize: normalize(13),
    lineHeight: normalize(18),
  },
  checkmarkBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 1,
  },
  calendarCard: {
    marginBottom: normalize(16),
    padding: normalize(14),
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  calendarTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarTitle: {
    fontWeight: '600',
    marginLeft: normalize(6),
  },
  calendarBadge: {
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    borderRadius: normalize(12),
  },
  calendarBadgeText: {
    fontWeight: '600',
    fontSize: normalize(11),
  },
  calendarWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  calendarLeft: {
    flex: 1,
    paddingRight: normalize(10),
  },
  calendarRight: {
    width: '60%',
  },
  calendarDescription: {
    fontSize: normalize(13),
    lineHeight: normalize(18),
    fontWeight: '500',
    marginBottom: normalize(8),
  },
  streakInfo: {
    fontSize: normalize(12),
    marginBottom: normalize(2),
    lineHeight: normalize(16),
  },
  calendarDayNames: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(4),
  },
  calendarDayName: {
    fontSize: normalize(10),
    width: '14.28%',
    textAlign: 'center',
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: normalize(1),
  },
  calendarDayEmpty: {
    backgroundColor: 'transparent',
  },
  calendarDayCircle: {
    width: normalize(20),
    height: normalize(20),
    borderRadius: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  calendarDayNumber: {
    fontSize: normalize(10),
    fontWeight: '500',
  },
  calendarCompletedDot: {
    width: normalize(4),
    height: normalize(4),
    borderRadius: normalize(2),
    position: 'absolute',
    bottom: normalize(1),
  },
  calendarButton: {
    padding: normalize(8),
    borderRadius: normalize(8),
    alignItems: 'center',
  },
  calendarButtonText: {
    fontWeight: '600',
    fontSize: normalize(12),
  },
  floatingIcon: {
    position: 'absolute',
    right: normalize(20),
    bottom: normalize(20),
    width: normalize(56),
    height: normalize(56),
    borderRadius: normalize(28),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 999,
  },
  gradientCard: {
    borderRadius: normalize(16),
    marginBottom: normalize(16),
    overflow: 'hidden',
  },
  cardContent: {
    padding: normalize(16),
  },
  statsGlow: {
    textShadowColor: 'rgba(139, 92, 246, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  achievementItem: {
    position: 'relative',
    overflow: 'visible',
  },
  badgeOverlay: {
    position: 'absolute',
    top: -normalize(6),
    right: -normalize(6),
    backgroundColor: '#FF3B30',
    width: normalize(18),
    height: normalize(18),
    borderRadius: normalize(9),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  pillButton: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
    borderRadius: normalize(20),
    marginTop: normalize(12),
    alignSelf: 'center',
  },
  fluidShape: {
    position: 'absolute',
    top: -normalize(40),
    right: -normalize(30),
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
    opacity: 0.1,
    transform: [{ scale: 1.5 }],
  }
});

export default HomeScreen; 
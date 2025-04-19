import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Animated,
  Dimensions,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Components
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

// Context and Services
import { AppContext, APP_MODES } from '../../services/AppContext';
import { formatDate, getStreakCount } from '../../services';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme, currentMode, habits, setHabits, switchMode } = useContext(AppContext);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [todayHabits, setTodayHabits] = useState([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));

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
      },
      {
        id: '2',
        title: 'Read 20 pages',
        description: 'Read at least 20 pages of a book',
        frequency: 'daily',
        completedDates: ['2023-04-15', '2023-04-17', '2023-04-18'],
        icon: 'book',
        color: '#3b82f6',
      },
      {
        id: '3',
        title: 'Workout',
        description: '30 minutes of exercise',
        frequency: 'weekly',
        completedDates: ['2023-04-14', '2023-04-17'],
        icon: 'fitness',
        color: '#ef4444',
      },
    ];

    setHabits(dummyHabits);

    // Calculate streak
    const allCompletedDates = dummyHabits.reduce(
      (dates, habit) => [...dates, ...habit.completedDates],
      []
    );
    const streak = getStreakCount(allCompletedDates);
    setCurrentStreak(streak);

    // Get today's habits
    const today = new Date();
    setTodayHabits(dummyHabits.filter(habit => habit.frequency === 'daily'));
    
    // Count completed habits for today
    const todayStr = today.toISOString().split('T')[0];
    const completed = dummyHabits.filter(habit => 
      habit.completedDates.includes(todayStr)
    ).length;
    
    setCompletedToday(completed);
  }, []);

  // Re-animate when mode changes
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [currentMode]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const toggleAppMode = () => {
    const newMode = currentMode === APP_MODES.PERSONAL_GROWTH 
      ? APP_MODES.ACTION 
      : APP_MODES.PERSONAL_GROWTH;
    
    switchMode(newMode);
  };

  const getModeIcon = () => {
    return currentMode === APP_MODES.PERSONAL_GROWTH
      ? 'leaf-outline'
      : 'flash-outline';
  };

  const getModeDescription = () => {
    return currentMode === APP_MODES.PERSONAL_GROWTH
      ? 'Focus on mindful progress with a calm approach'
      : 'Maximize productivity with high energy';
  };

  const handleHabitCheck = (habitId) => {
    // In a real app, this would mark the habit as completed for today
    Alert.alert('Success', 'Habit marked as completed for today!');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header 
        title="Rick&Morty" 
        rightIcon="settings-outline"
        onRightIconPress={() => navigation.navigate('Settings')}
      />
      
      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim }]} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greetingContainer}>
          <Text style={[styles.greeting, { color: theme.text }]}>{getGreeting()}</Text>
          <Text style={[styles.modeName, { color: theme.primary }]}>
            {currentMode === APP_MODES.PERSONAL_GROWTH ? 'Personal Growth Mode' : 'Action Mode'}
          </Text>
        </View>

        {/* Mode Switcher Card */}
        <Card style={styles.modeCard}>
          <View style={styles.modeContent}>
            <View style={styles.modeIconContainer}>
              <View style={[
                styles.modeIconCircle, 
                { backgroundColor: theme.primary + '20' }
              ]}>
                <Ionicons name={getModeIcon()} size={24} color={theme.primary} />
              </View>
            </View>
            <View style={styles.modeInfo}>
              <Text style={[styles.modeTitle, { color: theme.text }]}>
                {currentMode === APP_MODES.PERSONAL_GROWTH ? 'Personal Growth' : 'Action Mode'}
              </Text>
              <Text style={[styles.modeDescription, { color: theme.text + '99' }]}>
                {getModeDescription()}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.modeSwitchButton, { backgroundColor: theme.primary }]}
              onPress={toggleAppMode}
            >
              <Ionicons 
                name="swap-horizontal" 
                size={18} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Stats card */}
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>{currentStreak}</Text>
              <Text style={[styles.statLabel, { color: theme.text }]}>Day Streak</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>{completedToday}</Text>
              <Text style={[styles.statLabel, { color: theme.text }]}>Completed Today</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>{habits.length}</Text>
              <Text style={[styles.statLabel, { color: theme.text }]}>Total Habits</Text>
            </View>
          </View>
        </Card>

        {/* Today's habits */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Habits</Text>
          
          {todayHabits.length > 0 ? (
            todayHabits.map(habit => (
              <Card key={habit.id} style={styles.habitCard}>
                <View style={styles.habitHeader}>
                  <View style={[styles.habitIconContainer, { backgroundColor: habit.color + '20' }]}>
                    <Ionicons name={habit.icon} size={24} color={habit.color} />
                  </View>
                  <View style={styles.habitInfo}>
                    <Text style={[styles.habitTitle, { color: theme.text }]}>{habit.title}</Text>
                    <Text style={[styles.habitDescription, { color: theme.text + '99' }]}>
                      {habit.description}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.checkButton}
                    onPress={() => handleHabitCheck(habit.id)}
                  >
                    <Ionicons 
                      name="checkmark-circle-outline" 
                      size={28} 
                      color={theme.primary} 
                    />
                  </TouchableOpacity>
                </View>
              </Card>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: theme.text + '80' }]}>
              No habits scheduled for today.
            </Text>
          )}
        </View>

        {/* Daily Challenge Card */}
        <Card style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <Ionicons 
              name={currentMode === APP_MODES.PERSONAL_GROWTH ? "star" : "trophy"} 
              size={22} 
              color={theme.primary} 
            />
            <Text style={[styles.challengeTitle, { color: theme.text }]}>
              Daily {currentMode === APP_MODES.PERSONAL_GROWTH ? 'Boost' : 'Challenge'}
            </Text>
          </View>
          <Text style={[styles.challengeText, { color: theme.text + '99' }]}>
            {currentMode === APP_MODES.PERSONAL_GROWTH 
              ? "Take 5 minutes to express gratitude for one thing in your life."
              : "Complete all your tasks 10 minutes faster than usual today!"}
          </Text>
          <Button 
            title="Accept" 
            variant="outline"
            size="small"
            style={styles.challengeButton}
          />
        </Card>

        {/* Add Habit Button */}
        <Button 
          title="Add New Habit" 
          onPress={() => navigation.navigate('Habits')}
          style={styles.addButton}
          fullWidth
        />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  greetingContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  modeName: {
    fontSize: 16,
    marginTop: 4,
  },
  modeCard: {
    marginBottom: 20,
  },
  modeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeIconContainer: {
    marginRight: 14,
  },
  modeIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
  },
  modeSwitchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCard: {
    marginBottom: 24,
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
    fontSize: 32,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  habitCard: {
    marginBottom: 12,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  habitDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  checkButton: {
    padding: 8,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
  challengeCard: {
    marginBottom: 24,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  challengeText: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  challengeButton: {
    alignSelf: 'flex-start',
  },
  addButton: {
    marginBottom: 30,
  },
});

export default HomeScreen; 
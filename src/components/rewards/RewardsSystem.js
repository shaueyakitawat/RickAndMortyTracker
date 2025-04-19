import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  FlatList,
  Modal,
  Dimensions,
  Platform,
  PixelRatio,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../../services/AppContext';
import Card from '../common/Card';

// For responsive design
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = Math.min(SCREEN_WIDTH / 375, 1.0);
const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

// Rewards data - achievements that can be unlocked
const REWARDS_DATA = [
  {
    id: '1',
    title: 'Early Bird',
    description: 'Complete a habit before 9 AM',
    icon: 'sunny-outline',
    color: '#fbbf24',
    points: 20,
    isUnlocked: false,
    requiredCount: 1,
    currentCount: 0
  },
  {
    id: '2',
    title: 'Streak Master',
    description: 'Maintain a 7-day streak',
    icon: 'flame-outline',
    color: '#ef4444',
    points: 50,
    isUnlocked: false,
    requiredCount: 7,
    currentCount: 0
  },
  {
    id: '3',
    title: 'Hydration Hero',
    description: 'Track 8 glasses of water for 3 days',
    icon: 'water-outline',
    color: '#3b82f6',
    points: 30,
    isUnlocked: false,
    requiredCount: 3,
    currentCount: 0
  },
  {
    id: '4',
    title: 'Habit Builder',
    description: 'Create 5 habits',
    icon: 'construct-outline',
    color: '#8b5cf6',
    points: 40,
    isUnlocked: false,
    requiredCount: 5,
    currentCount: 0
  },
  {
    id: '5',
    title: 'Perfect Day',
    description: 'Complete all habits in a day',
    icon: 'checkmark-done-outline',
    color: '#10b981',
    points: 50,
    isUnlocked: false,
    requiredCount: 1,
    currentCount: 0
  }
];

const RewardsSystem = ({ habits, streakCount, waterIntake, onRewardEarned }) => {
  const { theme } = React.useContext(AppContext);
  const [rewards, setRewards] = useState(REWARDS_DATA);
  const [points, setPoints] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [achievementModal, setAchievementModal] = useState(false);
  const [earnedAchievement, setEarnedAchievement] = useState(null);
  const confettiAnimation = React.useRef(new Animated.Value(0)).current;

  // Update rewards based on user activity
  useEffect(() => {
    updateRewards();
  }, [habits, streakCount, waterIntake]);

  const updateRewards = () => {
    let updatedRewards = [...rewards];
    let newPoints = points;
    let newRewardEarned = false;
    let rewardItem = null;

    // Check for Early Bird achievement
    const todayHabits = habits.filter(habit => {
      const today = new Date().toISOString().split('T')[0];
      return habit.completedDates.includes(today);
    });
    const completedBeforeNineAM = todayHabits.some(habit => {
      // In a real app, would check the actual completion time
      return true;
    });
    
    if (completedBeforeNineAM && !updatedRewards[0].isUnlocked) {
      updatedRewards[0].currentCount = 1;
      if (updatedRewards[0].currentCount >= updatedRewards[0].requiredCount) {
        if (!updatedRewards[0].isUnlocked) {
          updatedRewards[0].isUnlocked = true;
          newPoints += updatedRewards[0].points;
          newRewardEarned = true;
          rewardItem = updatedRewards[0];
        }
      }
    }

    // Check for Streak Master achievement
    updatedRewards[1].currentCount = streakCount;
    if (streakCount >= 7 && !updatedRewards[1].isUnlocked) {
      updatedRewards[1].isUnlocked = true;
      newPoints += updatedRewards[1].points;
      newRewardEarned = true;
      rewardItem = updatedRewards[1];
    }

    // Check for Hydration Hero achievement
    if (waterIntake >= 8 && !updatedRewards[2].isUnlocked) {
      updatedRewards[2].currentCount += 1;
      if (updatedRewards[2].currentCount >= updatedRewards[2].requiredCount) {
        updatedRewards[2].isUnlocked = true;
        newPoints += updatedRewards[2].points;
        newRewardEarned = true;
        rewardItem = updatedRewards[2];
      }
    }

    // Check for Habit Builder achievement
    updatedRewards[3].currentCount = habits.length;
    if (habits.length >= 5 && !updatedRewards[3].isUnlocked) {
      updatedRewards[3].isUnlocked = true;
      newPoints += updatedRewards[3].points;
      newRewardEarned = true;
      rewardItem = updatedRewards[3];
    }

    // Check for Perfect Day achievement
    const totalDailyHabits = habits.filter(habit => habit.frequency === 'daily').length;
    const completedToday = todayHabits.length;
    
    if (totalDailyHabits > 0 && completedToday === totalDailyHabits && !updatedRewards[4].isUnlocked) {
      updatedRewards[4].currentCount = 1;
      updatedRewards[4].isUnlocked = true;
      newPoints += updatedRewards[4].points;
      newRewardEarned = true;
      rewardItem = updatedRewards[4];
    }

    setRewards(updatedRewards);
    
    if (newPoints !== points) {
      setPoints(newPoints);
    }
    
    if (newRewardEarned) {
      onRewardEarned(newPoints);
      setEarnedAchievement(rewardItem);
      setAchievementModal(true);
      showConfettiAnimation();
    }
  };

  const showConfettiAnimation = () => {
    setShowConfetti(true);
    confettiAnimation.setValue(0);
    Animated.timing(confettiAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setShowConfetti(false);
      }, 1000);
    });
  };

  const renderRewardItem = ({ item }) => {
    const progress = Math.min(item.currentCount / item.requiredCount, 1);
    
    return (
      <TouchableOpacity 
        style={[
          styles.rewardItem, 
          { 
            backgroundColor: item.isUnlocked ? item.color + '20' : theme.card,
            borderColor: item.color + '40'
          }
        ]}
      >
        <View style={styles.rewardHeader}>
          <View style={[styles.rewardIcon, { backgroundColor: item.color + '20' }]}>
            <Ionicons name={item.icon} size={normalize(18)} color={item.color} />
          </View>
          <View style={styles.rewardInfo}>
            <Text style={[styles.rewardTitle, { color: theme.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.rewardDesc, { color: theme.text + '99' }]}>
              {item.description}
            </Text>
          </View>
          <View style={styles.pointBadge}>
            <Text style={styles.pointText}>+{item.points}</Text>
          </View>
        </View>
        
        <View style={[styles.progressBar, { backgroundColor: theme.text + '10' }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: item.color,
                width: `${progress * 100}%` 
              }
            ]} 
          />
        </View>
        
        <Text style={[styles.progressText, { color: theme.text + '80' }]}>
          {item.currentCount}/{item.requiredCount} {item.isUnlocked ? '• Completed!' : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAchievementModal = () => {
    if (!earnedAchievement) return null;
    
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={achievementModal}
        onRequestClose={() => {
          setAchievementModal(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            {showConfetti && (
              <View style={styles.confettiContainer}>
                {Array.from({ length: 50 }).map((_, i) => {
                  const size = Math.random() * 8 + 4;
                  const color = [
                    '#f44336', '#2196f3', '#ffeb3b', 
                    '#4caf50', '#9c27b0', '#ff9800'
                  ][Math.floor(Math.random() * 6)];
                  
                  return (
                    <Animated.View
                      key={i}
                      style={{
                        position: 'absolute',
                        top: confettiAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 400 * Math.random()],
                        }),
                        left: Math.random() * 300,
                        width: size,
                        height: size,
                        backgroundColor: color,
                        borderRadius: size / 2,
                        opacity: confettiAnimation.interpolate({
                          inputRange: [0, 0.7, 1],
                          outputRange: [1, 1, 0],
                        }),
                        transform: [{
                          translateX: confettiAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, (Math.random() - 0.5) * 200],
                          })
                        }]
                      }}
                    />
                  );
                })}
              </View>
            )}
            
            <View style={[
              styles.achievementIcon, 
              { backgroundColor: earnedAchievement.color + '20' }
            ]}>
              <Ionicons 
                name={earnedAchievement.icon} 
                size={normalize(40)} 
                color={earnedAchievement.color} 
              />
            </View>
            
            <Text style={[styles.achievementTitle, { color: theme.text }]}>
              Achievement Unlocked!
            </Text>
            
            <Text style={[styles.achievementName, { color: earnedAchievement.color }]}>
              {earnedAchievement.title}
            </Text>
            
            <Text style={[styles.achievementDesc, { color: theme.text + '99' }]}>
              {earnedAchievement.description}
            </Text>
            
            <View style={[styles.pointsEarned, { backgroundColor: earnedAchievement.color + '20' }]}>
              <Text style={[styles.pointsText, { color: earnedAchievement.color }]}>
                +{earnedAchievement.points} points
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.closeButton, { backgroundColor: theme.primary }]}
              onPress={() => setAchievementModal(false)}
            >
              <Text style={styles.closeButtonText}>Great!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="trophy-outline" size={normalize(18)} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>Achievements & Rewards</Text>
        </View>
        
        <View style={[styles.pointsContainer, { backgroundColor: theme.primary + '20' }]}>
          <Ionicons name="star" size={normalize(14)} color={theme.primary} />
          <Text style={[styles.points, { color: theme.primary }]}>{points} pts</Text>
        </View>
      </View>
      
      <FlatList
        data={rewards}
        renderItem={renderRewardItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.rewardsList}
      />
      
      {renderAchievementModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: normalize(16),
    fontWeight: '600',
    marginLeft: normalize(6),
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    borderRadius: normalize(12),
  },
  points: {
    marginLeft: normalize(4),
    fontWeight: '600',
    fontSize: normalize(13),
  },
  rewardsList: {
    paddingBottom: normalize(8),
  },
  rewardItem: {
    borderRadius: normalize(8),
    padding: normalize(12),
    marginBottom: normalize(10),
    borderWidth: 1,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  rewardIcon: {
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: normalize(8),
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: normalize(14),
    fontWeight: '600',
    marginBottom: normalize(2),
  },
  rewardDesc: {
    fontSize: normalize(12),
  },
  pointBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: normalize(6),
    paddingVertical: normalize(2),
    borderRadius: normalize(10),
  },
  pointText: {
    color: '#000',
    fontSize: normalize(11),
    fontWeight: '600',
  },
  progressBar: {
    height: normalize(6),
    borderRadius: normalize(3),
    marginVertical: normalize(4),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: normalize(3),
  },
  progressText: {
    fontSize: normalize(11),
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '80%',
    borderRadius: normalize(12),
    padding: normalize(20),
    alignItems: 'center',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  achievementIcon: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: normalize(12),
  },
  achievementTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    marginBottom: normalize(6),
  },
  achievementName: {
    fontSize: normalize(16),
    fontWeight: '600',
    marginBottom: normalize(8),
  },
  achievementDesc: {
    fontSize: normalize(14),
    textAlign: 'center',
    marginBottom: normalize(16),
  },
  pointsEarned: {
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    borderRadius: normalize(16),
    marginBottom: normalize(16),
  },
  pointsText: {
    fontSize: normalize(14),
    fontWeight: '600',
  },
  closeButton: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
    borderRadius: normalize(20),
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default RewardsSystem; 
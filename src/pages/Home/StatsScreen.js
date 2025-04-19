import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Components
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';

// Context and Services
import { AppContext } from '../../services/AppContext';
import { formatDate } from '../../services';

const StatsScreen = () => {
  const { theme, habits } = useContext(AppContext);
  const [timeframe, setTimeframe] = useState('week'); // week, month, year
  const [chartData, setChartData] = useState([]);
  const [xAxisLabels, setXAxisLabels] = useState([]);

  // Update chart data when timeframe changes
  useEffect(() => {
    generateChartData();
  }, [timeframe, habits]);

  // Generate chart data based on selected timeframe
  const generateChartData = () => {
    let data = [];
    let labels = [];

    switch (timeframe) {
      case 'week':
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        // Sample week data
        data = [4, 3, 5, 2, 0, 0, 0];
        break;
      
      case 'month':
        // Show consecutive dates evenly distributed across the month
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        
        // Option 1: Show consecutive days (e.g., 1, 2, 3, 4, 5...)
        // Uncomment this section if you want consecutive days at the beginning of the month
        /*
        const daysToShow = Math.min(7, daysInMonth); // Show at most 7 days
        for (let i = 1; i <= daysToShow; i++) {
          labels.push(i.toString());
        }
        */
        
        // Option 2: Evenly distribute dates across the month
        const totalBars = 7; // Number of bars to show
        const interval = Math.floor(daysInMonth / (totalBars - 1));
        
        for (let i = 0; i < totalBars; i++) {
          const day = Math.min(1 + (i * interval), daysInMonth);
          labels.push(day.toString());
        }
        
        // Sample month data (should match the number of labels)
        data = Array(labels.length).fill(0).map(() => Math.floor(Math.random() * 10));
        break;
      
      case 'year':
        // Month abbreviations for the year
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Sample year data
        data = Array(12).fill(0).map(() => Math.floor(Math.random() * 20) + 5);
        break;
    }

    setChartData(data);
    setXAxisLabels(labels);
  };

  const getTotalCompletions = () => {
    return habits.reduce((total, habit) => total + habit.completedDates.length, 0);
  };

  const getCompletionRate = () => {
    if (habits.length === 0) return 0;
    
    let totalPossible;
    switch (timeframe) {
      case 'week':
        totalPossible = habits.length * 7;
        break;
      case 'month':
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        totalPossible = habits.length * daysInMonth;
        break;
      case 'year':
        totalPossible = habits.length * 365;
        break;
    }
    
    const completed = getTotalCompletions();
    return Math.round((completed / totalPossible) * 100);
  };

  const getCurrentStreak = () => {
    // This would be more complex in a real app, using the utility function
    return 4; // Dummy value
  };

  const getLongestStreak = () => {
    // This would use more advanced logic in a real app
    return 12; // Dummy value
  };

  const renderBarChart = () => {
    const maxValue = Math.max(...chartData);
    
    return (
      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yAxisLabels}>
          {/* Using different scales based on timeframe */}
          {timeframe === 'year' 
            ? [maxValue, Math.floor(maxValue * 0.75), Math.floor(maxValue * 0.5), Math.floor(maxValue * 0.25), 0].map((value, index) => (
                <Text 
                  key={index} 
                  style={[styles.axisLabel, { color: theme.text + '80' }]}
                >
                  {value}
                </Text>
              ))
            : [maxValue, Math.floor(maxValue * 0.5), 0].map((value, index) => (
                <Text 
                  key={index} 
                  style={[styles.axisLabel, { color: theme.text + '80' }]}
                >
                  {value}
                </Text>
              ))
          }
        </View>
        
        {/* Bars */}
        <View style={styles.barsContainer}>
          {chartData.map((value, index) => {
            const barHeight = maxValue > 0 ? (value / maxValue) * 150 : 0;
            
            return (
              <View key={index} style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: barHeight, 
                      backgroundColor: theme.primary
                    }
                  ]}
                />
                <Text style={[styles.axisLabel, { color: theme.text + '80' }]}>
                  {xAxisLabels[index]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Statistics" />
      
      <View style={styles.timeframeContainer}>
        {['week', 'month', 'year'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.timeframeButton,
              timeframe === option && { backgroundColor: theme.primary },
            ]}
            onPress={() => setTimeframe(option)}
          >
            <Text
              style={[
                styles.timeframeText,
                timeframe === option ? { color: 'white' } : { color: theme.text },
              ]}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Summary</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statBlock}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {getTotalCompletions()}
              </Text>
              <Text style={[styles.statLabel, { color: theme.text + '80' }]}>
                Completions
              </Text>
            </View>
            
            <View style={styles.statBlock}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {getCompletionRate()}%
              </Text>
              <Text style={[styles.statLabel, { color: theme.text + '80' }]}>
                Completion Rate
              </Text>
            </View>
            
            <View style={styles.statBlock}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {getCurrentStreak()}
              </Text>
              <Text style={[styles.statLabel, { color: theme.text + '80' }]}>
                Current Streak
              </Text>
            </View>
            
            <View style={styles.statBlock}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {getLongestStreak()}
              </Text>
              <Text style={[styles.statLabel, { color: theme.text + '80' }]}>
                Best Streak
              </Text>
            </View>
          </View>
        </Card>

        {/* Chart Card */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeaderContainer}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              {timeframe === 'week' ? 'This Week' : timeframe === 'month' ? 'This Month' : 'This Year'} 
            </Text>
            <Text style={[styles.chartSubtitle, { color: theme.text + '80' }]}>
              {timeframe === 'week' 
                ? 'Daily completions'
                : timeframe === 'month'
                  ? `Day of ${new Date().toLocaleString('default', { month: 'long' })}`
                  : `Monthly completions in ${new Date().getFullYear()}`
              }
            </Text>
          </View>
          {renderBarChart()}
        </Card>

        {/* Habits Performance */}
        <Card>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Habit Performance</Text>
          
          {habits.length > 0 ? (
            habits.map((habit) => {
              // Calculate completion percentage based on timeframe
              const completed = habit.completedDates.length;
              let total;
              
              switch(timeframe) {
                case 'week':
                  total = 7;
                  break;
                case 'month':
                  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
                  total = daysInMonth;
                  break;
                case 'year':
                  total = 365;
                  break;
              }
              
              const percentage = Math.min(100, Math.round((completed / total) * 100));
              
              return (
                <View key={habit.id} style={styles.habitPerformance}>
                  <View style={styles.habitInfo}>
                    <View style={[styles.habitIcon, { backgroundColor: habit.color + '20' }]}>
                      <Ionicons name={habit.icon} size={18} color={habit.color} />
                    </View>
                    <Text style={[styles.habitName, { color: theme.text }]}>{habit.title}</Text>
                  </View>
                  
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBackground}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${percentage}%`,
                            backgroundColor: habit.color 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.progressText, { color: theme.text }]}>
                      {percentage}%
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={[styles.emptyText, { color: theme.text + '80' }]}>
              No habits to show stats for.
            </Text>
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timeframeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  summaryCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  chartHeaderContainer: {
    marginBottom: 8,
  },
  chartSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBlock: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  chartCard: {
    marginBottom: 16,
    paddingBottom: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 200,
    alignItems: 'flex-end',
  },
  yAxisLabels: {
    width: 30,
    height: 150,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180,
  },
  barWrapper: {
    alignItems: 'center',
    width: 30,
  },
  bar: {
    width: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  axisLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  habitPerformance: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
  },
  habitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  habitName: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '55%',
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
});

export default StatsScreen; 
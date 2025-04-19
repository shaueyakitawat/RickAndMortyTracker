import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

// Context and Services
import { AppContext, APP_MODES } from '../../services/AppContext';

const ProfileScreen = () => {
  const { theme, currentMode, switchMode } = useContext(AppContext);
  
  // Profile settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [weeklyReportsEnabled, setWeeklyReportsEnabled] = useState(true);
  const [username, setUsername] = useState('User');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Dummy user data
  const userStats = {
    totalHabits: 12,
    totalCompletions: 87,
    memberSince: 'April 2023',
    longestStreak: 15,
  };

  // Handle app mode switch
  const handleModeSwitch = () => {
    const newMode = currentMode === APP_MODES.PERSONAL_GROWTH 
      ? APP_MODES.ACTION 
      : APP_MODES.PERSONAL_GROWTH;
    
    switchMode(newMode);
  };

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              setIsLoggedIn(false);
              // In a real app, we would navigate to the login screen
            } catch (error) {
              console.log('Error logging out:', error);
            }
          },
        },
      ]
    );
  };

  // Handle export data
  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your habit data will be exported as a CSV file and shared.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Export',
          onPress: () => {
            // In a real app, this would trigger the export function
            Alert.alert('Success', 'Your data has been exported successfully.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Profile" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image 
              source={require('../../../assets/images/icon.png')}
              style={styles.avatar}
              defaultSource={require('../../../assets/images/icon.png')}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.username, { color: theme.text }]}>{username}</Text>
              <Text style={[styles.memberSince, { color: theme.text + '80' }]}>
                Member since {userStats.memberSince}
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {userStats.totalHabits}
              </Text>
              <Text style={[styles.statLabel, { color: theme.text + '80' }]}>
                Habits
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {userStats.totalCompletions}
              </Text>
              <Text style={[styles.statLabel, { color: theme.text + '80' }]}>
                Completions
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {userStats.longestStreak}
              </Text>
              <Text style={[styles.statLabel, { color: theme.text + '80' }]}>
                Best Streak
              </Text>
            </View>
          </View>
        </Card>

        {/* App Mode Section */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>App Mode</Text>
          
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={[styles.switchTitle, { color: theme.text }]}>
                {currentMode === APP_MODES.PERSONAL_GROWTH 
                  ? 'Personal Growth Mode' 
                  : 'Action Mode'}
              </Text>
              <Text style={[styles.switchDescription, { color: theme.text + '80' }]}>
                {currentMode === APP_MODES.PERSONAL_GROWTH
                  ? 'Focus on mindful progress with calming visuals'
                  : 'Energetic interface for maximum productivity'}
              </Text>
            </View>
            
            <Switch
              trackColor={{ false: '#767577', true: theme.primary + '80' }}
              thumbColor={currentMode === APP_MODES.ACTION ? theme.primary : '#f4f3f4'}
              onValueChange={handleModeSwitch}
              value={currentMode === APP_MODES.ACTION}
            />
          </View>
        </Card>

        {/* Notifications Section */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
          
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={[styles.switchTitle, { color: theme.text }]}>
                Push Notifications
              </Text>
              <Text style={[styles.switchDescription, { color: theme.text + '80' }]}>
                Get reminders for your daily habits
              </Text>
            </View>
            
            <Switch
              trackColor={{ false: '#767577', true: theme.primary + '80' }}
              thumbColor={notificationsEnabled ? theme.primary : '#f4f3f4'}
              onValueChange={setNotificationsEnabled}
              value={notificationsEnabled}
            />
          </View>
          
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={[styles.switchTitle, { color: theme.text }]}>
                Weekly Report
              </Text>
              <Text style={[styles.switchDescription, { color: theme.text + '80' }]}>
                Receive weekly progress summaries
              </Text>
            </View>
            
            <Switch
              trackColor={{ false: '#767577', true: theme.primary + '80' }}
              thumbColor={weeklyReportsEnabled ? theme.primary : '#f4f3f4'}
              onValueChange={setWeeklyReportsEnabled}
              value={weeklyReportsEnabled}
            />
          </View>
        </Card>

        {/* Data Section */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Data</Text>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={handleExportData}
          >
            <View style={styles.actionInfo}>
              <Ionicons name="download-outline" size={22} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Export Habit Data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionInfo}>
              <Ionicons name="cloud-upload-outline" size={22} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Backup to Cloud
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
        </Card>

        {/* Account Section */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionInfo}>
              <Ionicons name="person-outline" size={22} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Account Settings
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionInfo}>
              <Ionicons name="help-circle-outline" size={22} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Help & Support
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionItem, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
          >
            <View style={styles.actionInfo}>
              <Ionicons name="log-out-outline" size={22} color="#ef4444" />
              <Text style={[styles.actionText, { color: '#ef4444' }]}>
                Log Out
              </Text>
            </View>
          </TouchableOpacity>
        </Card>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.text + '60' }]}>
            Rick&Morty v1.0.0
          </Text>
        </View>
      </ScrollView>
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
  profileCard: {
    marginTop: 8,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e5e7eb',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  memberSince: {
    fontSize: 14,
    marginTop: 2,
  },
  editButton: {
    padding: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  switchLabel: {
    flex: 1,
    paddingRight: 16,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  switchDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 14,
  },
});

export default ProfileScreen; 
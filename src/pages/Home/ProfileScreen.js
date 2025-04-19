import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Components
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

// Context and Services
import { AppContext, APP_MODES } from '../../services/AppContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { theme, currentMode, switchMode, logout, isAuthenticated } = useContext(AppContext);
  
  // Profile settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [weeklyReportsEnabled, setWeeklyReportsEnabled] = useState(true);
  const [username, setUsername] = useState('User');
  
  // Check login status on mount
  useEffect(() => {
    // Check for auth token to update UI
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        // Set username if logged in
        if (token) {
          setUsername('User'); // In a real app, fetch user profile data here
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };
    
    checkAuthStatus();
  }, [isAuthenticated]);

  // Handle app mode switch
  const handleModeSwitch = () => {
    const newMode = currentMode === APP_MODES.PERSONAL_GROWTH 
      ? APP_MODES.ACTION 
      : APP_MODES.PERSONAL_GROWTH;
    
    switchMode(newMode);
  };

  // Handle edit profile
  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'What would you like to change?',
      [
        {
          text: 'Change Username',
          onPress: () => {
            // In a real app, this would open a text input dialog
            const newName = 'Rick Sanchez'; // Simulated new name
            setUsername(newName);
            Alert.alert('Success', 'Username updated successfully!');
          }
        },
        {
          text: 'Change Avatar',
          onPress: () => {
            Alert.alert('Coming Soon', 'This feature will be available in the next update.');
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
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
          style: 'destructive',
          onPress: async () => {
            try {
              // Use the global logout function which handles everything
              const success = await logout();
              
              if (!success) {
                // Only show error if the logout function fails
                Alert.alert('Error', 'Something went wrong. Please try again.');
              }
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Something went wrong. Please try again.');
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

  // Handle backup to cloud
  const handleBackupToCloud = () => {
    Alert.alert(
      'Backup to Cloud',
      'Do you want to backup your data to the cloud?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Backup',
          onPress: () => {
            // Simulate a backup process
            setTimeout(() => {
              Alert.alert('Success', 'Your data has been backed up to the cloud.');
            }, 1000);
          },
        },
      ]
    );
  };

  // Handle account settings
  const handleAccountSettings = () => {
    Alert.alert(
      'Account Settings',
      'Manage your account preferences',
      [
        {
          text: 'Change Email',
          onPress: () => Alert.alert('Coming Soon', 'This feature will be available in the next update.')
        },
        {
          text: 'Change Password',
          onPress: () => Alert.alert('Coming Soon', 'This feature will be available in the next update.')
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Delete Account',
              'Are you sure? This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => Alert.alert('Action Required', 'Please contact support to delete your account.')
                }
              ]
            );
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  // Handle privacy settings
  const handlePrivacySettings = () => {
    Alert.alert(
      'Privacy Settings',
      'Manage your privacy preferences',
      [
        {
          text: 'Data Collection',
          onPress: () => {
            Alert.alert(
              'Data Collection',
              'We collect anonymous usage data to improve our app. Would you like to opt out?',
              [
                { text: 'Keep Enabled', style: 'cancel' },
                { text: 'Opt Out', onPress: () => Alert.alert('Success', 'You have opted out of data collection.') }
              ]
            );
          }
        },
        {
          text: 'Privacy Policy',
          onPress: () => {
            Alert.alert(
              'Privacy Policy',
              'Would you like to view our privacy policy?',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'View',
                  onPress: () => Linking.openURL('https://www.example.com/privacy-policy')
                }
              ]
            );
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  // Handle help and support
  const handleHelpSupport = () => {
    Alert.alert(
      'Help & Support',
      'How can we assist you?',
      [
        {
          text: 'FAQ',
          onPress: () => Alert.alert('Frequently Asked Questions', 'Our FAQ section is currently being updated.')
        },
        {
          text: 'Contact Support',
          onPress: () => {
            Alert.alert(
              'Contact Support',
              'How would you like to reach us?',
              [
                { 
                  text: 'Email',
                  onPress: () => Linking.openURL('mailto:support@example.com')
                },
                { 
                  text: 'Live Chat',
                  onPress: () => Alert.alert('Coming Soon', 'Live chat support will be available in the next update.')
                },
                { text: 'Cancel', style: 'cancel' }
              ]
            );
          }
        },
        {
          text: 'Report Bug',
          onPress: () => Alert.alert('Coming Soon', 'Bug reporting will be available in the next update.')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
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
                Member since April 2023
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: theme.withOpacity ? theme.withOpacity('primary', '10') : 'rgba(0,0,0,0.05)' }]}
              onPress={handleEditProfile}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                12
              </Text>
              <Text style={[styles.statLabel, { color: theme.text + '80' }]}>
                Habits
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                87
              </Text>
              <Text style={[styles.statLabel, { color: theme.text + '80' }]}>
                Completions
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                15
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
              onValueChange={(value) => {
                setNotificationsEnabled(value);
                Alert.alert(
                  value ? 'Notifications Enabled' : 'Notifications Disabled',
                  value ? 'You will receive habit reminders' : 'You will not receive habit reminders'
                );
              }}
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
              onValueChange={(value) => {
                setWeeklyReportsEnabled(value);
                Alert.alert(
                  value ? 'Weekly Reports Enabled' : 'Weekly Reports Disabled',
                  value ? 'You will receive weekly summaries' : 'You will not receive weekly summaries'
                );
              }}
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
            activeOpacity={0.7}
          >
            <View style={styles.actionInfo}>
              <Ionicons name="download-outline" size={22} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Export Habit Data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={handleBackupToCloud}
            activeOpacity={0.7}
          >
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
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={handleAccountSettings}
            activeOpacity={0.7}
          >
            <View style={styles.actionInfo}>
              <Ionicons name="person-outline" size={22} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Account Settings
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={handlePrivacySettings}
            activeOpacity={0.7}
          >
            <View style={styles.actionInfo}>
              <Ionicons name="shield-checkmark-outline" size={22} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Privacy Settings
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={handleHelpSupport}
            activeOpacity={0.7}
          >
            <View style={styles.actionInfo}>
              <Ionicons name="help-circle-outline" size={22} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Help & Support
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
        </Card>
        
        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          style={[styles.logoutButton, { backgroundColor: theme.error }]}
          textStyle={{ color: '#ffffff' }}
        />
        
        <View style={styles.versionInfo}>
          <Text style={[styles.versionText, { color: theme.text + '60' }]}>
            Version 1.0.0
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
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchLabel: {
    flex: 1,
    paddingRight: 16,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    borderBottomWidth: 1,
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 12,
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  versionInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
  },
});

export default ProfileScreen; 
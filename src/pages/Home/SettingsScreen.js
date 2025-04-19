import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

// Context and Services
import { AppContext } from '../../services/AppContext';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useContext(AppContext);

  const handleNavBack = () => {
    navigation.goBack();
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all your habits and progress? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              // In a real app, this would clear all user data
              await AsyncStorage.setItem('habits', JSON.stringify([]));
              Alert.alert('Success', 'All data has been cleared.');
              navigation.goBack();
            } catch (error) {
              console.log('Error clearing data:', error);
            }
          },
        },
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate Rick&Morty',
      'You will be redirected to the app store to rate Rick&Morty.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open App Store',
          onPress: () => {
            // In a real app, this would open the app store
            Alert.alert('Thank You', 'Thanks for your support!');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header 
        title="Settings" 
        showBackButton={true}
        onBackPress={handleNavBack}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* App Settings */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>App Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="color-palette-outline" size={22} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>
                App Themes
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={22} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>
                Notification Settings
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="language-outline" size={22} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>
                Language
              </Text>
            </View>
            <Text style={[styles.settingValue, { color: theme.text + '80' }]}>
              English
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Privacy & Data */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Privacy & Data</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="lock-closed-outline" size={22} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>
                Privacy Policy
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="document-text-outline" size={22} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>
                Terms of Service
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="cloud-download-outline" size={22} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>
                Export All Data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
        </Card>

        {/* Support & Feedback */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Support & Feedback</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="help-circle-outline" size={22} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>
                Help Center
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="bug-outline" size={22} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>
                Report a Bug
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleRateApp}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="star-outline" size={22} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>
                Rate the App
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '60'} />
          </TouchableOpacity>
        </Card>

        {/* Danger Zone */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Danger Zone</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomWidth: 0 }]}
            onPress={handleClearData}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
              <Text style={[styles.settingText, { color: '#ef4444' }]}>
                Clear All Data
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 14,
  },
});

export default SettingsScreen; 
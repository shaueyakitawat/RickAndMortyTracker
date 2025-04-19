import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

// Components
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

// Context and Services
import { AppContext } from '../../services/AppContext';

const HabitsScreen = () => {
  const { theme, habits, setHabits } = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState('all'); // all, daily, weekly, monthly
  const route = useRoute();
  
  // Check if we should show the create modal automatically
  useEffect(() => {
    if (route.params?.showCreateModal) {
      setModalVisible(true);
      // Clear the parameter to prevent reopening on subsequent renders
      route.params.showCreateModal = false;
    }
  }, [route.params]);
  
  // New habit form state
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    frequency: 'daily',
    icon: 'leaf',
    color: '#8b5cf6',
  });

  const filteredHabits = habits.filter(habit => {
    if (filter === 'all') return true;
    return habit.frequency === filter;
  });

  const iconOptions = [
    { name: 'leaf', color: '#8b5cf6' },
    { name: 'book', color: '#3b82f6' },
    { name: 'fitness', color: '#ef4444' },
    { name: 'water', color: '#0ea5e9' },
    { name: 'bed', color: '#8b5cf6' },
    { name: 'restaurant', color: '#f59e0b' },
  ];

  const frequencyOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ];

  const handleCreateHabit = () => {
    if (!newHabit.title.trim()) return;

    const habit = {
      id: Date.now().toString(),
      title: newHabit.title,
      description: newHabit.description,
      frequency: newHabit.frequency,
      completedDates: [],
      icon: newHabit.icon,
      color: newHabit.color,
    };

    setHabits([...habits, habit]);
    setModalVisible(false);
    setNewHabit({
      title: '',
      description: '',
      frequency: 'daily',
      icon: 'leaf',
      color: '#8b5cf6',
    });
  };

  const handleDeleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="My Habits" />
      
      <View style={styles.filterContainer}>
        {['all', 'daily', 'weekly', 'monthly'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterButton,
              filter === option && { backgroundColor: theme.primary },
            ]}
            onPress={() => setFilter(option)}
          >
            <Text
              style={[
                styles.filterText,
                filter === option ? { color: 'white' } : { color: theme.text },
              ]}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredHabits.length > 0 ? (
          filteredHabits.map(habit => (
            <Card key={habit.id} style={styles.habitCard}>
              <View style={styles.habitHeader}>
                <View style={[styles.habitIconContainer, { backgroundColor: habit.color + '20' }]}>
                  <Ionicons name={habit.icon} size={24} color={habit.color} />
                </View>
                <View style={styles.habitInfo}>
                  <Text style={[styles.habitTitle, { color: theme.text }]}>{habit.title}</Text>
                  <Text style={[styles.habitMeta, { color: theme.text + '99' }]}>
                    {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteHabit(habit.id)}
                >
                  <Ionicons name="trash-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
              </View>
              {habit.description ? (
                <Text style={[styles.habitDescription, { color: theme.text + '99' }]}>
                  {habit.description}
                </Text>
              ) : null}
            </Card>
          ))
        ) : (
          <Text style={[styles.emptyText, { color: theme.text + '80' }]}>
            No habits found. Create a new habit to get started!
          </Text>
        )}

        {/* Add Button */}
        <Button 
          title="Create New Habit" 
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
          fullWidth
        />
      </ScrollView>

      {/* Create Habit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Create New Habit</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Title</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    color: theme.text,
                    borderColor: theme.text + '20',
                    backgroundColor: theme.background 
                  }
                ]}
                placeholder="Habit name"
                placeholderTextColor={theme.text + '60'}
                value={newHabit.title}
                onChangeText={(text) => setNewHabit({ ...newHabit, title: text })}
              />

              <Text style={[styles.inputLabel, { color: theme.text }]}>Description (optional)</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { 
                    color: theme.text,
                    borderColor: theme.text + '20',
                    backgroundColor: theme.background 
                  }
                ]}
                placeholder="Add details about your habit"
                placeholderTextColor={theme.text + '60'}
                multiline
                numberOfLines={3}
                value={newHabit.description}
                onChangeText={(text) => setNewHabit({ ...newHabit, description: text })}
              />

              <Text style={[styles.inputLabel, { color: theme.text }]}>Frequency</Text>
              <View style={styles.optionsContainer}>
                {frequencyOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      newHabit.frequency === option.value && { 
                        backgroundColor: theme.primary,
                        borderColor: theme.primary 
                      },
                      { borderColor: theme.text + '30' }
                    ]}
                    onPress={() => setNewHabit({ ...newHabit, frequency: option.value })}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        newHabit.frequency === option.value 
                          ? { color: 'white' } 
                          : { color: theme.text }
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.inputLabel, { color: theme.text }]}>Icon</Text>
              <View style={styles.iconsContainer}>
                {iconOptions.map((icon) => (
                  <TouchableOpacity
                    key={icon.name}
                    style={[
                      styles.iconButton,
                      newHabit.icon === icon.name && styles.selectedIconButton,
                      { 
                        borderColor: icon.color,
                        backgroundColor: newHabit.icon === icon.name 
                          ? icon.color + '20' 
                          : 'transparent'
                      }
                    ]}
                    onPress={() => setNewHabit({ 
                      ...newHabit, 
                      icon: icon.name,
                      color: icon.color 
                    })}
                  >
                    <Ionicons name={icon.name} size={24} color={icon.color} />
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                title="Create Habit"
                onPress={handleCreateHabit}
                fullWidth
                style={styles.createButton}
                disabled={!newHabit.title.trim()}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
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
  habitMeta: {
    fontSize: 14,
    marginTop: 2,
  },
  habitDescription: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  deleteButton: {
    padding: 8,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
  addButton: {
    marginTop: 16,
    marginBottom: 30,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalScroll: {
    maxHeight: '100%',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12,
  },
  selectedIconButton: {
    borderWidth: 2,
  },
  createButton: {
    marginTop: 20,
    marginBottom: 30,
  },
});

export default HabitsScreen; 
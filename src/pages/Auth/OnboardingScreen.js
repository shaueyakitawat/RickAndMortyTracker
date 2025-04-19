import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Dimensions, 
  TouchableOpacity, 
  FlatList,
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import Button from '../../components/common/Button';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ onDone }) => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const onboardingData = [
    {
      id: '1',
      title: 'Welcome to Rick&Morty',
      description: 'Your mood-driven habit tracker that adapts to how you feel.',
      image: require('../../../assets/images/icon.png'),
    },
    {
      id: '2',
      title: 'Two Distinct Modes',
      description: 'Switch between Personal Growth mode for mindful progress or Action mode for high energy days.',
      image: require('../../../assets/images/adaptive-icon.png'),
    },
    {
      id: '3',
      title: 'Track Your Way',
      description: 'Create customized habits with flexible schedules that fit your lifestyle.',
      image: require('../../../assets/images/react-logo.png'),
    },
    {
      id: '4',
      title: 'Ready to Begin?',
      description: 'Start building better habits in a way that matches your personal vibe.',
      image: require('../../../assets/images/splash-icon.png'),
    },
  ];

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem('firstLaunch', 'false');
      if (onDone) {
        onDone();
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log('Error saving first launch status:', error);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <Image 
          source={item.image}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      
      <View style={styles.skipContainer}>
        {currentIndex < onboardingData.length - 1 ? (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      
      <FlatList
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        extraData={currentIndex}
        initialScrollIndex={currentIndex}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
      
      <View style={styles.bottomContainer}>
        <View style={styles.indicatorContainer}>
          {onboardingData.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.indicator,
                index === currentIndex ? styles.activeIndicator : null
              ]} 
            />
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title={currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
            onPress={handleNext}
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  skipContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  slide: {
    width,
    alignItems: 'center',
    padding: 40,
    paddingTop: 100,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    color: '#666',
    lineHeight: 24,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#8b5cf6',
    width: 20,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    width: '100%',
  },
});

export default OnboardingScreen; 
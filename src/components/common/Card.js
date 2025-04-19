import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions, Platform, PixelRatio, TouchableOpacity } from 'react-native';
import { AppContext } from '../../services/AppContext';

// For responsive design with reduced scaling
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = Math.min(SCREEN_WIDTH / 375, 1.0); // Cap scale at 1.0 for more compact UI
const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

const Card = ({
  children,
  style,
  elevation = 1,
  padding = 'medium', // none, small, medium, large
  onPress,
}) => {
  const { theme, currentMode } = useContext(AppContext);
  
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return normalize(8);
      case 'medium':
        return normalize(12);
      case 'large':
        return normalize(16);
      default:
        return normalize(12);
    }
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          padding: getPadding(),
          shadowColor: theme.cardShadow || theme.text + '30',
          elevation: theme.cardElevation || elevation,
          borderRadius: theme.borderRadius || normalize(8),
          borderColor: theme.border,
          borderWidth: 0.5,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: normalize(12),
    marginBottom: normalize(12),
    shadowOffset: {
      width: 0,
      height: normalize(1),
    },
    shadowOpacity: 0.08,
    shadowRadius: normalize(2),
  },
});

export default Card; 
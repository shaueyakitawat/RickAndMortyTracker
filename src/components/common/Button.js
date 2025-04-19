import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
  PixelRatio,
  View
} from 'react-native';
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

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  variant = 'filled',
  size = 'medium',
  loading = false,
  icon = null,
  fullWidth = false,
  disabled = false,
}) => {
  const { theme } = React.useContext(AppContext);

  // Determine the button's style based on variant
  const getButtonStyle = () => {
    if (variant === 'outline') {
      return {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.primary,
      };
    } else if (variant === 'text') {
      return {
        backgroundColor: 'transparent',
        paddingHorizontal: normalize(4),
        paddingVertical: normalize(2),
      };
    }
    return { backgroundColor: theme.primary };
  };

  // Determine text color based on variant
  const getTextColor = () => {
    if (variant === 'outline' || variant === 'text') {
      return theme.primary;
    }
    return '#FFFFFF';
  };

  // Determine button size
  const getButtonSize = () => {
    if (size === 'small') {
      return {
        paddingVertical: normalize(4),
        paddingHorizontal: normalize(8),
        height: normalize(28),
      };
    } else if (size === 'large') {
      return {
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(16),
        height: normalize(44),
      };
    }
    return {
      paddingVertical: normalize(6),
      paddingHorizontal: normalize(12),
      height: normalize(36),
    };
  };

  // Determine text size
  const getTextSize = () => {
    if (size === 'small') {
      return normalize(12);
    } else if (size === 'large') {
      return normalize(15);
    }
    return normalize(13);
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getButtonSize(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.buttonText,
              { color: getTextColor(), fontSize: getTextSize() },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: normalize(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: normalize(4),
  },
  fullWidth: {
    width: '100%',
  },
  buttonText: {
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button; 
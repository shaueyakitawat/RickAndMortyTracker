import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useContext } from 'react';
import { AppContext } from '../../services/AppContext';

const Button = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, text
  size = 'medium', // small, medium, large
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const { theme } = useContext(AppContext);

  const getButtonStyles = () => {
    let buttonStyles = [styles.button];
    let textStyles = [styles.text];

    // Variant styles
    switch (variant) {
      case 'primary':
        buttonStyles.push({ backgroundColor: theme.primary });
        textStyles.push({ color: '#ffffff' });
        break;
      case 'secondary':
        buttonStyles.push({ backgroundColor: theme.secondary });
        textStyles.push({ color: theme.text });
        break;
      case 'outline':
        buttonStyles.push({
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.primary,
        });
        textStyles.push({ color: theme.primary });
        break;
      case 'text':
        buttonStyles.push({
          backgroundColor: 'transparent',
          paddingHorizontal: 0,
          paddingVertical: 0,
        });
        textStyles.push({ color: theme.primary });
        break;
    }

    // Size styles
    switch (size) {
      case 'small':
        buttonStyles.push(styles.smallButton);
        textStyles.push(styles.smallText);
        break;
      case 'large':
        buttonStyles.push(styles.largeButton);
        textStyles.push(styles.largeText);
        break;
    }

    // Full width
    if (fullWidth) {
      buttonStyles.push(styles.fullWidth);
    }

    // Disabled state
    if (disabled || loading) {
      buttonStyles.push(styles.disabledButton);
      textStyles.push(styles.disabledText);
    }

    return { buttonStyles, textStyles };
  };

  const { buttonStyles, textStyles } = getButtonStyles();

  return (
    <TouchableOpacity
      style={[...buttonStyles, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'outline' ? theme.primary : '#ffffff'} />
      ) : (
        <Text style={[...textStyles, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  smallText: {
    fontSize: 14,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  largeText: {
    fontSize: 18,
    fontWeight: '700',
  },
  fullWidth: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.8,
  },
});

export default Button; 
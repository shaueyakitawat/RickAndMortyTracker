import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext, APP_MODES } from '../../services/AppContext';

const Header = ({
  title,
  showBackButton = false,
  onBackPress,
  rightIcon,
  onRightIconPress,
  style,
}) => {
  const { theme, currentMode, switchMode } = useContext(AppContext);

  const toggleAppMode = () => {
    const newMode = 
      currentMode === APP_MODES.PERSONAL_GROWTH 
        ? APP_MODES.ACTION 
        : APP_MODES.PERSONAL_GROWTH;
    
    switchMode(newMode);
  };

  return (
    <View style={[styles.header, { backgroundColor: theme.background }, style]}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.primary} />
          </TouchableOpacity>
        )}
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      </View>

      <View style={styles.rightContainer}>
        {/* Mode toggle button */}
        <TouchableOpacity onPress={toggleAppMode} style={styles.modeButton}>
          <Ionicons 
            name={currentMode === APP_MODES.PERSONAL_GROWTH ? 'flash' : 'leaf'} 
            size={22} 
            color={theme.primary} 
          />
        </TouchableOpacity>

        {/* Optional right icon */}
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconButton}>
            <Ionicons name={rightIcon} size={24} color={theme.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  modeButton: {
    padding: 8,
    marginRight: 8,
  },
  rightIconButton: {
    padding: 4,
  },
});

export default Header; 
import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Platform,
  Dimensions,
  PixelRatio
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext, APP_MODES } from '../../services/AppContext';

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

// Get status bar height
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight;

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

  const headerBg = style?.backgroundColor || theme.card;
  const textColor = style?.color || theme.text;
  const iconTint = style?.tintColor || theme.primary;

  return (
    <View style={[
      styles.header, 
      { 
        backgroundColor: headerBg,
        shadowOpacity: style?.shadowOpacity || 0.1,
        elevation: style?.elevation || 2
      }
    ]}>
      <StatusBar 
        backgroundColor={headerBg} 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
      />
      
      <View style={styles.headerContent}>
        {showBackButton ? (
          <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={normalize(20)} color={iconTint} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
        
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        
        <View style={styles.rightContainer}>
          {/* Mode toggle button */}
          <TouchableOpacity onPress={toggleAppMode} style={styles.iconButton}>
            <Ionicons 
              name={currentMode === APP_MODES.PERSONAL_GROWTH ? 'flash' : 'leaf'} 
              size={normalize(18)} 
              color={iconTint} 
            />
          </TouchableOpacity>

          {/* Optional right icon */}
          {rightIcon && (
            <TouchableOpacity onPress={onRightIconPress} style={styles.iconButton}>
              <Ionicons name={rightIcon} size={normalize(20)} color={iconTint} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: STATUSBAR_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: normalize(1) },
    shadowRadius: normalize(2),
    zIndex: 10,
  },
  headerContent: {
    height: normalize(48),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(12),
  },
  title: {
    fontSize: normalize(16),
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  iconButton: {
    width: normalize(32),
    height: normalize(32),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(16),
  },
  iconPlaceholder: {
    width: normalize(32),
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default Header; 
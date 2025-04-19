import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppContext } from '../../services/AppContext';

const Card = ({
  children,
  style,
  elevation = 2,
  padding = 'medium', // none, small, medium, large
}) => {
  const { theme } = useContext(AppContext);
  
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return 12;
      case 'medium':
        return 16;
      case 'large':
        return 24;
      default:
        return 16;
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          padding: getPadding(),
          shadowColor: theme.text,
          elevation: elevation,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginVertical: 8,
  },
});

export default Card; 
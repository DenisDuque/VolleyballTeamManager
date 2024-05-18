import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Avatar = ({ number, size, color, undefinedAvatar }) => {
  const backgrounds = {
    'primary': '#131417',
    'secondary': '#1D1F24',
  };

  const styles = StyleSheet.create({
    avatarContainer: {
      backgroundColor: backgrounds[color],
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
    },
    avatarText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
    },
  });

  return (
    <View style={[styles.avatarContainer, { width: size, height: size }]}>
      {undefinedAvatar ? (
        <Icon name="user" size={size / 2} color="#676D75" />
      ) : (
        <Text style={styles.avatarText}>{number ? number : '+'}</Text>
      )}
    </View>
  );
};

export default Avatar;
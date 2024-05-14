import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Avatar = ({ number, size, color }) => {

  const backgrounds = {
    'primary': '#131417',
    'secondary': '#1D1F24',
  }

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
      <Text style={styles.avatarText}>{number ? number : '+'}</Text>
    </View>
  );
}

export default Avatar;

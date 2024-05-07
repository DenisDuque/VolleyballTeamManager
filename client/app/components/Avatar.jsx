import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Avatar = ({ number, size }) => (
  <View style={[styles.avatarContainer, { width: size, height: size }]}>
    <Text style={styles.avatarText}>{number}</Text>
  </View>
);

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: '#1D1F24', 
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

export default Avatar;

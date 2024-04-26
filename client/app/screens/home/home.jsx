import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>Este es el home</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationBar: {
    width: '100%',
    height: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;

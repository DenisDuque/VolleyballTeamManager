import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider } from './context/UserContext';
import LoginScreen from './screens/auth/sign-in';
import HomeScreen from './screens/matches/matches';

const Stack = createStackNavigator();

export default function App() {
  return (
    <UserProvider>
        <SafeAreaView style={styles.root}>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </SafeAreaView>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
});

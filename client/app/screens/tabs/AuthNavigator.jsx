import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../auth/sign-in';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      {/* Register */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
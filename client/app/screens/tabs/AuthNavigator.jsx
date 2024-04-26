import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../auth/sign-in';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SignInScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
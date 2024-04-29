import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserContext } from './context/UserContext';
import AuthNavigator from './screens/tabs/AuthNavigator';
import MainNavigator from './screens/tabs/MainNavigator';
import SignInScreen from './screens/auth/sign-in';
import HomeScreen from './screens/home/home';
// import TeamsScreen from './screens/teams/TeamsScreen';
// import PlayersScreen from './screens/players/PlayersScreen';
import MatchesScreen from './screens/matches/matches';
// import ProfileScreen from './screens/profile/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NavigationContainer independent={true}>
        <Stack.Navigator headerShown="false">
          {user ? (
            <Stack.Screen name="Main" component={MainNavigator} options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}
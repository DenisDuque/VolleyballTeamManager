import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserContext } from './context/UserContext';
import AuthNavigator from './screens/tabs/AuthNavigator';
import MainNavigator from './screens/tabs/MainNavigator';
import MatchDetailsScreen from './screens/matches/MatchDetails';
import SignInScreen from './screens/auth/sign-in';
import HomeScreen from './screens/home/home';
import MatchesScreen from './screens/matches/matches';
import LineupsScreen from './screens/matches/lineups/lineups';
import { useNavigation } from '@react-navigation/native';
const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  

  const options = {
    default: {
      headerStyle: {
        backgroundColor: '#131417',
      },
      headerTintColor: '#EBEBEB',
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NavigationContainer independent={true}>
        <Stack.Navigator headerShown={false}>
          {user ? (
            <>
              <Stack.Screen name="Main" options={{ headerShown: false }}>
                {(props) => <MainNavigator {...props} navigation={navigation} />}
              </Stack.Screen>
              <Stack.Screen name="MatchDetails" component={MatchDetailsScreen} navigation={navigation} 
                options={({ route }) => ({ 
                  title: route.params.itemName, 
                  ...options.default
                })} 
              />
              <Stack.Screen name="Lineups" component={LineupsScreen} navigation={navigation} 
                options={({ route }) => ({ 
                  matchId: route.params.matchId, 
                  ...options.default
                })} 
              />
            </>
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }}/>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}

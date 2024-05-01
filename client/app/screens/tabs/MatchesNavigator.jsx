import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MatchesScreen from '../matches/matches';
import MatchDetailsScreen from '../matches/MatchDetails';

const Stack = createStackNavigator();

const options = {
    default: {
      headerStyle: {
        backgroundColor: '#131417',
      },
      headerTintColor: '#EBEBEB',
    }
  };

const MatchesStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Matches" component={MatchesScreen} />
      <Stack.Screen name="MatchDetails" component={MatchDetailsScreen} options={({ route }) => ({ title: route.params.itemName, ...options.default })} />
    </Stack.Navigator>
  );
};

export default MatchesStackNavigator;
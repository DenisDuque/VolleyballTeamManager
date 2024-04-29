import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MatchesScreen from '../matches/matches';
import MatchDetailsScreen from '../matches/MatchDetails';

const Stack = createStackNavigator();

const options = {
    default: {
      headerStyle: {
        backgroundColor: '#131417', // Cambia aquí al color que desees para el encabezado de Home
      },
      headerTintColor: '#EBEBEB', // Cambia aquí el color del texto del encabezado si es necesario
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  };

const MatchesStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Matches" component={MatchesScreen} />
      <Stack.Screen name="MatchDetails" component={MatchDetailsScreen} />
    </Stack.Navigator>
  );
};

export default MatchesStackNavigator;
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../home/home';
///import TeamsScreen from '../teams/TeamsScreen';
//import PlayersScreen from '../players/PlayersScreen';
import MatchesScreen from '../matches/matches';
//import ProfileScreen from '../profile/ProfileScreen';

const Tab = createBottomTabNavigator();
/*
const MainNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Teams" component={TeamsScreen} />
      <Tab.Screen name="Players" component={PlayersScreen} />
      <Tab.Screen name="Matches" component={MatchesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
*/
const MainNavigator = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Matches" component={MatchesScreen} />
      </Tab.Navigator>
    );
  };

export default MainNavigator;

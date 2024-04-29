import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Usamos Ionicons de expo/vector-icons
import HomeScreen from '../home/home';
// import TeamsScreen from '../teams/TeamsScreen';
// import PlayersScreen from '../players/PlayersScreen';
import MatchesScreen from '../matches/matches';
import MatchesStackNavigator from '../tabs/MatchesNavigator';
// import ProfileScreen from '../profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const icons = {
  'Home': 'home-outline',
  'Matches': 'calendar-outline',
}

const options = {
  default: {
    headerStyle: {
      backgroundColor: '#131417',
    },
    headerTintColor: '#EBEBEB',
  }
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconColor;

          if (icons[route.name]) {
            iconName = icons[route.name];
          }

          iconColor = focused ? '#539DF3' : '#676D75';

          return <Ionicons name={iconName} size={size} color={iconColor} />;
        },
        tabBarStyle: {
          backgroundColor: '#1D1F24',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={options.default}/>
      {/*<Tab.Screen name="Teams" component={TeamsScreen} options={options.default} />*/}
      {/*<Tab.Screen name="Players" component={PlayersScreen} options={options.default} />*/}
      <Tab.Screen name="Matches" component={MatchesStackNavigator} options={options.default}/>
      {/*<Tab.Screen name="Profile" component={ProfileScreen} options={options.default} />*/}
    </Tab.Navigator>
  );
};

export default MainNavigator;

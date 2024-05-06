import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, ActivityIndicator,  FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../../../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LineupsScreen = ({ route }) => {
  const { matchId } = route.params;
  const [currentSet, setCurrentSet] = useState(1);
  const [matchDetails, setMatchDetails] = useState(null);
  const [currentSetDetails, setCurrentSetDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await fetch(`http://192.168.0.30:3000/matches/getMatch/${matchId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const matchData = await response.json();
        setMatchDetails(matchData);
        setLoading(false);
      } catch (error) {
        console.error('There was a problem fetching the data:', error);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  useEffect(() => {


  }, [currentSet]);

  if (loading || !matchDetails) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const goToPreviousSet = () => {
    if (currentSet > 1) {
      setCurrentSet(currentSet - 1);
    }
  };

  const goToNextSet = () => {
    const totalSets = 5;
    if (currentSet < totalSets) {
      setCurrentSet(currentSet + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.setNavigator}>
        <TouchableOpacity onPress={goToPreviousSet}>
          <Icon name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.setNumber}>Set {currentSet}</Text>
        <TouchableOpacity onPress={goToNextSet}>
          <Icon name="chevron-right" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.court}>
        <View style={styles.frontCourt}></View>
        <View style={styles.backCourt}></View>
      </View>
      <Text>{JSON.stringify(matchDetails.lineups)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  setNavigator: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  setNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 6,
  },
  court: {
    // Estilos para el área de la cancha
  },
  frontCourt: {
    // Estilos para el frente de la cancha
  },
  backCourt: {
    // Estilos para la parte trasera de la cancha
  },
});

export default LineupsScreen;

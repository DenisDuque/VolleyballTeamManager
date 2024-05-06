import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, Button, TouchableOpacity  } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Badges from '../../components/badges';
import { useNavigation } from '@react-navigation/native';

const MatchDetailsScreen = ({ route }) => {
  const { matchId } = route.params;
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const categoryType = {
    0: 'senior',
    1: 'junior',
    2: 'juvenile',
    3: 'cadet',
  }

  const genderType = {
    0: 'male',
    1: 'female',
    2: 'mixed',
  }

  const statusType = {
    0: 'pending',
    1: 'won',
    2: 'lost',
  }
  
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

  if (loading || !matchDetails) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear().toString().slice(2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}h`;
    return formattedDate;
  };

  const handleLineupsPress = (matchId) => {
    navigation.navigate('Lineups', { matchId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{formatDate(matchDetails.date)}</Text>
      <View style={styles.scoreboard}>
        <View style={styles.square}>
          <Text style={styles.number}>0</Text>
        </View>
        <Text style={styles.scoreboardBreadcumb}></Text>
        <View style={styles.square}>
          <Text style={styles.number}>0</Text>
        </View>
      </View>
      <View style={styles.teamContainer}>
        <Text style={styles.teamName} numberOfLines={1} ellipsizeMode="tail">{matchDetails.team.name}</Text>
        <View style={styles.teamMargin}></View>
        <Text style={styles.teamName} numberOfLines={1} ellipsizeMode="tail">{matchDetails.rival}</Text>
      </View>
      <View style={styles.badgesContainer}>
        <Badges type={categoryType[matchDetails.team.category]}/>
        <Badges type={genderType[matchDetails.team.gender]} />
        <Badges type={statusType[matchDetails.status]} />
      </View>
      <View style={styles.playersContainer}>
        <Text style={styles.playersTitle}>Players</Text>
        <ScrollView style={styles.playerScroll}>
          {matchDetails.players.map((player, index) => (
            <View style={styles.player} key={index}>
              <Text style={styles.playerName}>{player.name} {player.surname}</Text>
              {player._id === matchDetails.team.captain && <Badges type="captain" />}
              <Text style={styles.playerPosition}>{player.position}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.buttonsContainer}>
          <View style={styles.buttonsLeft}>
            <TouchableOpacity style={styles.lineupsButton} onPress={() => handleLineupsPress(matchDetails._id)}>
                <Icon name="assignment" size={36} color="white" />
                <Text style={{ color: 'white', fontSize: 18, marginLeft: 8 }}>Lineups</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.downloadLineupsButton}>
                <Icon name="file-download" size={36} color="white" />
                <Text style={{ color: 'white', fontSize: 18, marginLeft: 8 }}>Download Lineups</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.startGameButton} >
            <View style={styles.buttonContent}>
              <Icon name="play-circle-outline" size={36} color="white" />
              <Text style={{ color: 'white', fontSize: 18 }}>Start Game</Text>
            </View>
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131417',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'fff',
  },
  date: {
    fontSize: 18,
    color: '#676D75',
    justifyContent: 'center',
    width: '100%',
    textAlign: 'center',
  },
  scoreboard: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginTop: 16,
  },
  square: {
    width: 70,
    height: 70,
    backgroundColor: '#1D1F24',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  number: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  scoreboardBreadcumb: {
    width: 20,
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginHorizontal: 40,
    height: 4,
  },
  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  teamName: {
    width: 100,
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  teamMargin: {
    width: 20,
    alignSelf: 'center',
    marginHorizontal: 25, 
  },
  badgesContainer: {
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  playersContainer: {
    marginTop: 20,
  },
  playerScroll: {
    flexGrow: 1,
    height: 300,
    maxHeight: 300,
  },
  playersTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  player: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  playerName: {
    fontSize: 16,
    color: '#fff',
  },
  playerPosition: {
    fontSize: 14,
    color: '#999',
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonsLeft: {
    width: 200,
    marginRight: 5,
  },
  lineupsButton: {
    width: 200,
    height: 50,
    backgroundColor: '#539DF3',
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 5,
  },
  downloadLineupsButton: {
    width: 200,
    height: 50,
    backgroundColor: '#9953F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  startGameButton: {
    flex: 1,
    width: 150,
    backgroundColor: '#FD9E02',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MatchDetailsScreen;
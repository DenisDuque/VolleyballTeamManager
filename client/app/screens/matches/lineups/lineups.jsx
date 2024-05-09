import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, Button, TouchableOpacity  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../../../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import Avatar from '../../../components/Avatar';
import Badges from '../../../components/badges';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LineupsScreen = ({ route }) => {
  const { matchId } = route.params;
  const [currentSet, setCurrentSet] = useState(1);
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playersOnCourt, setPlayersOnCourt] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || '192.168.0.30:3000';

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await fetch(`http://`+ apiUrl +`/matches/getMatch/${matchId}`);
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

  const selectPlayer = (player) => {
    setSelectedPlayer(player);
  };

  return (
    <View style={styles.container}>
      <View style={styles.setNavigator}>
        <TouchableOpacity onPress={goToPreviousSet}>
          <Icon name="chevron-left" size={30} color="#676D75" />
        </TouchableOpacity>
        <Text style={styles.setNumber}>Set {currentSet}</Text>
        <TouchableOpacity onPress={goToNextSet}>
          <Icon name="chevron-right" size={30} color="#676D75" />
        </TouchableOpacity>
      </View>
      <View style={styles.court}>
        <View style={styles.frontCourt}>
          <TouchableOpacity style={styles.lineUpPosition} onPress={() => assignPosition(index)}>
            
          </TouchableOpacity>
        </View>
        <View style={styles.backCourt}>
        </View>
      </View>
      <Text>{JSON.stringify(matchDetails.lineups)}</Text>
      <View style={styles.playersContainer}>
        <Text style={styles.playersTitle}>Players</Text>
        <ScrollView style={styles.playerScroll}>
          {matchDetails.players.map((player, index) => (
            <TouchableOpacity onPress={() => selectPlayer(player)} key={index}>
              <View style={[styles.player, selectedPlayer && selectedPlayer._id === player._id && styles.selectedPlayer]} key={index}>
                <Avatar number={player.dorsal} size={50} />
                <View style={styles.playerInfoContainer}>
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{player.name} {player.surname}</Text>
                    {player._id === matchDetails.team.captain && <Badges type="captain" />}
                  </View>
                  <Text style={styles.playerPosition}>{player.position}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
  setNavigator: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  setNumber: {
    fontSize: 20,
    marginHorizontal: 6,
    color: '#fff'
  },
  court: {
    width: '100%',
    height: 200,
    backgroundColor: '#1D1F24',
    borderRadius: 5,
  },
  frontCourt: {
    width: '100%',
    height: 70,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  backCourt: {
    width: '100%',
    height: 130,
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
    alignItems: 'center',
    marginBottom: 5,
  },
  playerInfoContainer: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerName: {
    fontSize: 16,
    color: '#fff',
    marginRight: 5,
  },
  playerPosition: {
    fontSize: 14,
    color: '#999',
    marginTop: -3,
  },
  selectedPlayer: {
    borderWidth: 1,
    borderColor: '#fff',
    overflow: 'visible',
    overlayColor: 'transparent',
  }
});

export default LineupsScreen;

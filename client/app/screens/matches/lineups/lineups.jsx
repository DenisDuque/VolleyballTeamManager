import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, Button, TouchableOpacity  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../../../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import Avatar from '../../../components/Avatar';
import Badges from '../../../components/badges';
import Icon from 'react-native-vector-icons/MaterialIcons';

const apiUrl = process.env.EXPO_PUBLIC_API_URL || '192.168.0.30:3000';

const LineupsScreen = ({ route }) => {
  const { matchId } = route.params;
  const [currentSet, setCurrentSet] = useState(1);
  const [setterPosition, setSetterPosition] = useState({ 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, });
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [lineups, setLineups] = useState({ 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, });
  const [captains, setCaptains] = useState({ 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, });
  const [liberos, setLiberos] = useState({ 1: [], 2: [], 3: [], 4: [], 5: [], });

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await fetch(`http://`+ apiUrl +`/matches/getMatch/${matchId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const matchData = await response.json();
        setMatchDetails(matchData);
        if (matchData.lineups) {
          const updatedRotations = { ...setterPosition };
          for (let set = 0; set <= 4; set++) {
            const rotation = matchData.lineups[set].rotation;
            
            updatedRotations[set+1] = rotation;
            
            
            
            if (matchData.lineups[set]) {
              const updatedLineups = { ...lineups };
              for (let position = 0; position <= 5; position++) {
                if (matchData.lineups[set].players[position]) {
                  const player = {
                    _id: matchData.lineups[set].players[position]._id._id,
                    dorsal: matchData.lineups[set].players[position]._id.dorsal,
                    name: matchData.lineups[set].players[position]._id.name,
                    surname: matchData.lineups[set].players[position]._id.surname,
                    position: matchData.lineups[set].players[position]._id.position,
                  }
                  updatedLineups[set+1][position+1] = player;
                  setLineups(updatedLineups);

                  if (matchData.lineups[set].players[position].isCaptain == true) {
                    const updatedCaptains = { ...captains };
                    updatedCaptains[set+1] = player;
                    setCaptains(updatedCaptains);
                  }
                }
              }
              if (matchData.lineups[set].libero) {
                const updatedLiberos = { ...liberos };
                matchData.lineups[set].libero.forEach((liberoData, index) => {
                  const libero = {
                    _id: liberoData._id._id,
                    dorsal: liberoData._id.dorsal,
                    name: liberoData._id.name,
                    surname: liberoData._id.surname,
                    position: liberoData._id.position,
                  };
                  updatedLiberos[set + 1][index] = libero;
                });
                setLiberos(updatedLiberos);
              }
            }
          };
          setSetterPosition(updatedRotations);
        }
        setLoading(false);
      } catch (error) {
        console.error('There was a problem fetching the data:', error);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  useEffect(() => {


  }, [currentSet]);

  useEffect(() => {


  }, [setterPosition]);

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

  const goToPreviousRotation = () => {
    const updatedRotations = { ...setterPosition };
    if (updatedRotations[currentSet] > 1) {
      updatedRotations[currentSet] -= 1;
      setSetterPosition(updatedRotations, saveChanges);
    }
  };
  
  const goToNextRotation = () => {
    const updatedRotations = { ...setterPosition };
    const totalPositions = 6;
    if (updatedRotations[currentSet] < totalPositions) {
      updatedRotations[currentSet] += 1;
      setSetterPosition(updatedRotations, saveChanges);
    }
  };
  
  const selectPlayer = (player) => {
    setSelectedPlayer(player);
  };

  const assignPosition = (position) => {
    const updatedLineups = { ...lineups };
    const isInLineups = getPositionById(selectedPlayer._id);
    const isInLiberos = getLiberoById(selectedPlayer._id);
    if (isInLiberos != null) {
      const updatedLiberos = { ...liberos };
      delete updatedLiberos[currentSet][isInLiberos];
      setLiberos(updatedLiberos);
    }
    if (isInLineups != null) {
      delete updatedLineups[currentSet][isInLineups];
    }
    updatedLineups[currentSet][position] = selectedPlayer;
    setLineups(updatedLineups);
    saveChanges();
  };

  const assignCaptain = () => {
    const updatedCaptains = { ...captains };
    const isInLineups = getPositionById(selectedPlayer._id);
    if (isInLineups != null) {
      updatedCaptains[currentSet] = selectedPlayer;
    }
    setCaptains(updatedCaptains);
    saveChanges();
  }

  const assignLibero = (index) => {
    const updatedLiberos = { ...liberos };
    const isInLineups = getPositionById(selectedPlayer._id);
    if (isInLineups == null) {
      updatedLiberos[currentSet][index] = selectedPlayer;
    }
    setLiberos(updatedLiberos);
    saveChanges();
  }

  const isDefined = (obj) => {
    const defined = obj && Object.keys(obj).length > 0;
    return defined;
  };

  const getPositionById = (id) => {
    for (const position in lineups[currentSet]) {
      if (lineups[currentSet].hasOwnProperty(position)) {
        if (lineups[currentSet][position]._id === id) {
          return position;
        }
      }
    }
    return null;
  };

  const getLiberoById = (id) => {
    for (const position in liberos[currentSet]) {
      if (liberos[currentSet].hasOwnProperty(position)) {
        if (liberos[currentSet][position]._id === id) {
          return position;
        }
      }
    }
    return null;
  };

  const saveChanges = async () => {
    try {
      const response = await fetch(`http://${apiUrl}/matches/updateLineups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: matchId,
          lineups: formatChanges(),
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Lineups updated successfully!');
    } catch (error) {
      console.error('There was a problem updating lineups:', error);
    }
  };
  
  const formatChanges = () => {
    const formattedLineups = [];
  
    for (let set = 1; set <= 5; set++) {
      const rotation = setterPosition[set];
      const players = [];
      const libero = [];
  
      if (lineups[set] && captains[set]) {
        for (let position = 1; position <= 6; position++) {
          if (lineups[set][position]) {
            players.push({
              _id: lineups[set][position]._id,
              isCaptain: captains[set]._id && lineups[set][position]._id === captains[set]._id,
            });
          }
        }
      }
  
      if (liberos[set] && liberos[set][0] && liberos[set][1]) {
        libero.push({
          _id: liberos[set][0]._id,
          receiving: true,
        }, {
          _id: liberos[set][1]._id,
          receiving: false,
        });
      }
  
      formattedLineups.push({
        set: set,
        rotation: rotation,
        players: players,
        libero: libero,
      });
    };
  
    return formattedLineups;
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
          <TouchableOpacity style={styles.lineUpPosition} onPress={() => assignPosition(4)}>
            {isDefined(lineups[currentSet][4]) ? (
              <Avatar number={lineups[currentSet][4].dorsal} size={50} color="primary" />
            ) : (
              <Avatar size={50} color="primary" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.lineUpPosition} onPress={() => assignPosition(3)}>
            {isDefined(lineups[currentSet][3]) ? (
              <Avatar number={lineups[currentSet][3].dorsal} size={50} color="primary" />
            ) : (
              <Avatar size={50} color="primary" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.lineUpPosition} onPress={() => assignPosition(2)}>
            {isDefined(lineups[currentSet][2]) ? (
              <Avatar number={lineups[currentSet][2].dorsal} size={50} color="primary" />
            ) : (
              <Avatar size={50} color="primary" />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.backCourt}>
          <TouchableOpacity style={styles.lineUpPosition} onPress={() => assignPosition(5)}>
              {isDefined(lineups[currentSet][5]) ? (
                <Avatar number={lineups[currentSet][5].dorsal} size={50} color="primary" />
              ) : (
                <Avatar size={50} color="primary" />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.lineUpPosition} onPress={() => assignPosition(6)}>
              {isDefined(lineups[currentSet][6]) ? (
                <Avatar number={lineups[currentSet][6].dorsal} size={50} color="primary" />
              ) : (
                <Avatar size={50} color="primary" />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.lineUpPosition} onPress={() => assignPosition(1)}>
              {isDefined(lineups[currentSet][1]) ? (
                <Avatar number={lineups[currentSet][1].dorsal} size={50} color="primary" />
              ) : (
                <Avatar size={50} color="primary" />
              )}
            </TouchableOpacity>
        </View>
      </View>
      <View style={styles.rolesContainer}>
        <View style={styles.rolesRow}>
          <View style={styles.roleRowLeft}>
            <Text style={styles.roleTitle}>Captain</Text>
            <TouchableOpacity style={styles.lineUpPosition} onPress={() => assignCaptain()}>
            <View style={styles.player}>
                <Avatar number={captains[currentSet].dorsal} size={50} color="secondary" />
                <View style={styles.playerInfoContainer}>
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{captains[currentSet].name} {captains[currentSet].surname}</Text>
                  </View>
                  <Text style={styles.playerPosition}>{captains[currentSet].position}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.roleTitle}>Rotation</Text>
              <Text style={styles.setterTitle}>Setter Position</Text>
            <View style={styles.rotationNavigator}>
              <TouchableOpacity onPress={goToPreviousRotation}>
                <Icon name="chevron-left" size={30} color="#676D75" />
              </TouchableOpacity>
              <Text style={styles.setNumber}>{setterPosition[currentSet]}</Text>
              <TouchableOpacity onPress={goToNextRotation}>
                <Icon name="chevron-right" size={30} color="#676D75" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View  style={styles.rolesLibero}>
          <Text style={styles.roleTitle}>Libero</Text>
          <TouchableOpacity style={styles.player} onPress={() => assignLibero(0)}>
            {isDefined(liberos[currentSet][0]) ? (
              <View style={styles.player}>
              
                <Avatar number={liberos[currentSet][0].dorsal} size={50} color="secondary" />
                <View style={styles.playerInfoContainer}>
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{liberos[currentSet][0].name} {liberos[currentSet][0].surname}</Text>
                    <Badges type="receive" />
                  </View>
                  <Text style={styles.playerPosition}>{liberos[currentSet][0].position}</Text>
                </View>
              </View>
            ) : (
              <Avatar size={50} color="secondary" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.player} onPress={() => assignLibero(1)}>
            {isDefined(liberos[currentSet][1]) ? (
              <View style={styles.player}>
              
                <Avatar number={liberos[currentSet][1].dorsal} size={50} color="secondary" />
                <View style={styles.playerInfoContainer}>
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{liberos[currentSet][1].name} {liberos[currentSet][1].surname}</Text>
                    <Badges type="defense" />
                  </View>
                  <Text style={styles.playerPosition}>{liberos[currentSet][1].position}</Text>
                </View>
              </View>
            ) : (
              <Avatar size={50} color="secondary" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.playersContainer}>
        <Text style={styles.playersTitle}>Players</Text>
        <ScrollView style={styles.playerScroll}>
          {matchDetails.players.map((player, index) => (
            <TouchableOpacity onPress={() => selectPlayer(player)} key={index}>
              <View style={[styles.player, selectedPlayer && selectedPlayer._id === player._id && styles.selectedPlayer]} key={index}>
                <Avatar number={player.dorsal} size={50} color="secondary" />
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
  rotationNavigator: {
    flexDirection: 'row',
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  court: {
    width: '100%',
    height: 200,
    backgroundColor: '#1D1F24',
    borderRadius: 5,
  },
  frontCourt: {
    width: '100%',
    flexDirection: 'row',
    height: 70,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  lineUpPosition: {

  },
  backCourt: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 130,
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
  roleTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  setterTitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
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
  },
  rolesContainer: {
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#fff',
    height: 250,
  },
  rolesRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '50%',
  },
  roleRowLeft: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    marginRight: '2%',
    borderRightWidth: 1,
    borderRightColor: '#676D75',
  },
});

export default LineupsScreen;

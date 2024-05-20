import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, Button, TouchableOpacity  } from 'react-native';
import Avatar from '../../../components/Avatar';
import Badges from '../../../components/badges';

const InGameScreen = ({ route }) => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || '192.168.0.30:3000';
    const [loading, setLoading] = useState(true);
    const { matchId } = route.params;
    const [matchDetails, setMatchDetails] = useState(null);

    const [currentSet, setCurrentSet] = useState(1);
    const [lineups, setLineups] = useState({ 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, });
    const [setterPosition, setSetterPosition] = useState({ 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, });
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [interactions, setInteractions] = useState({ 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, });

    const [courtStatus, setCourtStatus] = useState([]);
    const [actualRotation, setActualRotation] = useState(1);
    const [lastPoint, setLastPoint] = useState(null);
    const [lastStatus, setLastStatus] = useState([]);
    const [liberos, setLiberos] = useState();
    const [middleBlocker, setMiddleBlocker] = useState();
    const [benchedPlayers, setBenchedPlayers] = useState();
    const [serve, setServe] = useState(false);
    
    const [teamPoints, setTeamPoints] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, });
    const [rivalPoints, setRivalPoints] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, });

    useEffect(() => {
        const fetchMatchDetails = async () => {
          try {
            const response = await fetch(`http://`+ apiUrl +`/matches/getMatch/${matchId}`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const matchData = await response.json();
            setMatchDetails(matchData);
            if (matchData.lineups.length > 0) {
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
                    }
                  }
                  if (matchData.lineups[set].libero) {
                    const updatedLiberos = { ...liberos };
                    if (!updatedLiberos[set + 1]) {
                      updatedLiberos[set + 1] = [];
                    }
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
              setNewCourtStatus();
            }
            setLoading(false);
          } catch (error) {
            console.error('There was a problem fetching the data:', error);
          }
        };
    
        fetchMatchDetails();
    }, [matchId]);

    useEffect(() => {
      updateBenchedPlayers(matchDetails);
    }, [courtStatus]);

    const setNewCourtStatus = () => {
      const newCourtStatus = [];

      for (let position = 1; position <= 6; position++) {
        newCourtStatus.push(lineups[currentSet][position]);
      }
      setLastStatus(courtStatus);
      setCourtStatus(newCourtStatus);
    };

    const updateCourtStatus = () => {
      if (!courtStatus || !lineups || !courtStatus > 0 || !lineups > 0) {
        return;
      }

      const newCourtStatus = [
        courtStatus[1],
        courtStatus[2],
        courtStatus[3],
        courtStatus[4],
        courtStatus[5],
        courtStatus[0]
      ];

      const getRotation = actualRotation;

      if (getRotation == 1) {
        setActualRotation(6);
      } else {
        setActualRotation(getRotation-1)
      }

      setLastStatus(courtStatus);
      setCourtStatus(newCourtStatus);
    };

    const updateBenchedPlayers = (data) => {
        if (data) {
          const currentCourtPlayers = courtStatus.map(player => player ? player._id : null).filter(id => id !== null);
          const currentLiberos = (liberos && liberos[currentSet]) ? liberos[currentSet].map(libero => libero._id) : [];
          const allPlayingPlayers = [...currentCourtPlayers, ...currentLiberos];
          const benchedPlayers = data.players.filter(player => !allPlayingPlayers.includes(player._id));
          console.log(allPlayingPlayers);
          setBenchedPlayers(benchedPlayers);
        }
    };
  

    const revertStatus = () => {
      if (lastStatus.length > 0) {
        setCourtStatus(lastStatus);
      }
      setLastStatus = [];
    }

    const isDefined = (obj) => {
      const defined = obj && Object.keys(obj).length > 0;
      return defined;
    };

    if (loading || !matchDetails) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    };

    return (
      <View style={styles.container}>
        <Text style={[styles.title, { textAlign: 'center' }]}>Court Status</Text>
        <View style={styles.court}>
            <View style={styles.frontCourt}>
              <TouchableOpacity style={styles.lineUpPosition} onPress={() => assignPosition(4)}>
                {courtStatus[3] && courtStatus[3].dorsal ? (
                  <Avatar number={courtStatus[3].dorsal} size={50} color="primary" />
                ) : (
                  <Avatar size={50} color="primary" undefinedAvatar={true} />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.lineUpPosition} onPress={() => assignPosition(3)}>
                {courtStatus[2] && courtStatus[2].dorsal ? (
                  <Avatar number={courtStatus[2].dorsal} size={50} color="primary" />
                ) : (
                  <Avatar size={50} color="primary" undefinedAvatar={true} />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.lineUpPosition} onPress={() => assignPosition(2)}>
                {courtStatus[1] && courtStatus[1].dorsal ? (
                  <Avatar number={courtStatus[1].dorsal} size={50} color="primary" />
                ) : (
                  <Avatar size={50} color="primary" undefinedAvatar={true} />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.backCourt}>
              <TouchableOpacity style={styles.lineUpPosition} onPress={() => assignPosition(5)}>
                {courtStatus[4] && courtStatus[4].dorsal ? (
                  <Avatar number={courtStatus[4].dorsal} size={50} color="primary" />
                ) : (
                  <Avatar size={50} color="primary" undefinedAvatar={true} />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.lineUpPosition} onPress={() => assignPosition(6)}>
                {courtStatus[5] && courtStatus[5].dorsal ? (
                  <Avatar number={courtStatus[5].dorsal} size={50} color="primary" />
                ) : (
                  <Avatar size={50} color="primary" undefinedAvatar={true} />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.lineUpPosition} onPress={() => assignPosition(1)}>
                {courtStatus[0] && courtStatus[0].dorsal ? (
                  <Avatar number={courtStatus[0].dorsal} size={50} color="primary" />
                ) : (
                  <Avatar size={50} color="primary" undefinedAvatar={true} />
                )}
              </TouchableOpacity>
            </View>
        </View>

        <Text style={[styles.title, { textAlign: 'left' }]}>Last point</Text>
        {lastPoint != null ? (
          <Avatar size={50} color="secondary" undefinedAvatar={true} />
        ) : (
          <Avatar size={50} color="secondary" undefinedAvatar={true} />
        )}
        
        <Text style={[styles.title, { textAlign: 'left' }]}>Benched</Text>
        <ScrollView style={styles.playerScroll}>
        {benchedPlayers && benchedPlayers.length > 0 ? (
          benchedPlayers.map((player, index) => (
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
          ))
        ) : (
          <Text style={[styles.title, { color: '#fff' }]}>No benched players available</Text>
        )}

        </ScrollView>
        <Text style={[styles.title, { textAlign: 'center' }]}>Scoreboard</Text>
        <Button title="Update Court Status" onPress={updateCourtStatus} />

      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131417',
    padding: 10,
  },
  title: {
    width: '100%',
    fontSize: 20,
    color: '#fff',
    marginVertical: 10,
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
    height: 175,
    maxHeight: 175,
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
});

export default InGameScreen;
import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, Button, TouchableOpacity, Modal } from 'react-native';
import Avatar from '../../../components/Avatar';
import Badges from '../../../components/badges';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';

const InGameScreen = ({ route }) => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || '192.168.0.30:3000';
    const [loading, setLoading] = useState(true);
    const { matchId } = route.params;
    const [matchDetails, setMatchDetails] = useState(null);

    const [currentSet, setCurrentSet] = useState(1);
    const [lineups, setLineups] = useState({ 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, });
    const [setterPosition, setSetterPosition] = useState({ 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, });
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [interactionSelectedPlayer, setInteractionSelectedPlayer] = useState();
    const [interactions, setInteractions] = useState([[], [], [], [], []]);

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
    const [result, setResult] = useState({ 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, });

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [nestedSelectedValue, setNestedSelectedValue] = useState('');

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

    const addPoints = (team) => {
      if (team) {
        const updatedPoints = {...teamPoints};
        const totalPoints = updatedPoints[currentSet] + 1;
        updatedPoints[currentSet] = totalPoints;
        setTeamPoints(updatedPoints);
        if (!serve) {
          updateCourtStatus();
          setServe(true);
        }
        if (totalPoints >= 25 && (totalPoints-rivalPoints[currentSet] >= 2)) {
          changeSet();
        }
      } else {
        const updatedPoints = {...rivalPoints}
        const totalPoints = updatedPoints[currentSet] + 1;
        updatedPoints[currentSet] = totalPoints;
        setRivalPoints(updatedPoints);
        setServe(false);
        if (totalPoints >= 25 && (totalPoints-teamPoints[currentSet] >= 2)) {
          changeSet();
        }
      }
    }

    const saveInteraction = () => {
      const newInteraction = {
        match: matchId,
        player: interactionSelectedPlayer._id,
        setNumber: currentSet,
        teamPoints: teamPoints,
        rivalPoints: rivalPoints,
        action: nestedSelectedValue,
        type: selectedValue,
      };

      const actualInteractions = {...interactions};
      actualInteractions[currentSet - 1].push(newInteraction);
      setInteractions(actualInteractions);
      setLastInteraction();
    };

    const setLastInteraction = () => {
      const total = countPlayerInteractions(interactionSelectedPlayer._id);
      const {good, bad, neutral} = classifyInteractions(interactionSelectedPlayer._id);
      
      const goodPercentage = ((good / total) * 100).toFixed(0);
      const badPercentage = ((bad / total) * 100).toFixed(0);
      const neutralPercentage = ((neutral / total) * 100).toFixed(0);

      const formatActionText = (text) => {
          let formattedText = text.replace(/_/g, ' ');
          formattedText = formattedText.charAt(0).toUpperCase() + formattedText.slice(1);
          return formattedText;
      };

      const lastInteraction = {
          id: interactionSelectedPlayer._id,
          dorsal: interactionSelectedPlayer.dorsal,
          name: interactionSelectedPlayer.name,
          surname: interactionSelectedPlayer.surname,
          position: interactionSelectedPlayer.position,
          action: formatActionText(nestedSelectedValue),
          type: selectedValue,
          good: `${goodPercentage}%`,
          neutral: `${neutralPercentage}%`,
          bad: `${badPercentage}%`,
      };
      console.log(lastInteraction);
      setLastPoint(lastInteraction);
    };

    const getLastElement = (set) => {
      const keys = Object.keys(set).sort((a, b) => a - b);
      const lastKey = keys[keys.length - 1];
      return set[lastKey];
    };

    const countPlayerInteractions = (playerId) => {
        let count = 0;
        if (interactions.length > 0) {
          interactions.forEach(setInteractions => {
              if (setInteractions.length > 0) {
                setInteractions.forEach(interaction => {
                    if (interaction.player === playerId) {
                        count++;
                    }
                });
              }
          });
        }
        return count;
    };

    const classifyInteractions = (playerId) => {
        let good = 0;
        let bad = 0;
        let neutral = 0;
        if (interactions.length > 0) {
          interactions.forEach(setInteractions => {
            if (setInteractions.length > 0) {
              setInteractions.forEach(interaction => {
                  if (interaction.player === playerId) {
                      if (interaction.type === 'good') {
                          good++;
                      } else if (interaction.type === 'bad') {
                          bad++;
                      } else {
                          neutral++;
                      }
                  }
              });
            }
          });
        }
        return { good, bad, neutral };
    };
  
    

    const changeSet = () => {
      if (currentSet == 5) {
        console.log("Finalizando partido...");
      } else {
        console.log("Cambiando de set...");
        setCurrentSet(currentSet+1);
        setNewCourtStatus();
      }
    }

    const startInteraction = (player) => {
      setInteractionSelectedPlayer(player);
      setModalVisible(true);
    };

    const handleSelect = () => {
        setModalVisible(false);
        saveInteraction();
    };

    return (
      <View style={styles.container}>
        <Text style={[styles.title, { textAlign: 'center' }]}>Court Status</Text>
        <View style={styles.court}>
            <View style={styles.frontCourt}>
              {courtStatus[3] && courtStatus[3].dorsal ? (
                <TouchableOpacity style={styles.lineUpPosition} onPress={() => startInteraction(courtStatus[3])}>
                    <Avatar number={courtStatus[3].dorsal} size={50} color="primary" />
                </TouchableOpacity>
              ) : (
                <Avatar size={50} color="primary" undefinedAvatar={true} />
              )}
              {courtStatus[2] && courtStatus[2].dorsal ? (
                <TouchableOpacity style={styles.lineUpPosition} onPress={() => startInteraction(courtStatus[2])}>
                    <Avatar number={courtStatus[2].dorsal} size={50} color="primary" />
                </TouchableOpacity>
              ) : (
                <Avatar size={50} color="primary" undefinedAvatar={true} />
              )}
              {courtStatus[1] && courtStatus[1].dorsal ? (
                <TouchableOpacity style={styles.lineUpPosition} onPress={() => startInteraction(courtStatus[1])}>
                    <Avatar number={courtStatus[1].dorsal} size={50} color="primary" />
                </TouchableOpacity>
              ) : (
                <Avatar size={50} color="primary" undefinedAvatar={true} />
              )}
            </View>
            <View style={styles.backCourt}>
              {courtStatus[4] && courtStatus[4].dorsal ? (
                <TouchableOpacity style={styles.lineUpPosition} onPress={() => startInteraction(courtStatus[4])}>
                    <Avatar number={courtStatus[4].dorsal} size={50} color="primary" />
                </TouchableOpacity>
              ) : (
                <Avatar size={50} color="primary" undefinedAvatar={true} />
              )}
              {courtStatus[5] && courtStatus[5].dorsal ? (
                <TouchableOpacity style={styles.lineUpPosition} onPress={() => startInteraction(courtStatus[5])}>
                    <Avatar number={courtStatus[5].dorsal} size={50} color="primary" />
                </TouchableOpacity>
              ) : (
                <Avatar size={50} color="primary" undefinedAvatar={true} />
              )}
              {courtStatus[0] && courtStatus[0].dorsal ? (
                <TouchableOpacity style={styles.lineUpPosition} onPress={() => startInteraction(courtStatus[0])}>
                    <Avatar number={courtStatus[0].dorsal} size={50} color="primary" />
                </TouchableOpacity>
              ) : (
                <Avatar size={50} color="primary" undefinedAvatar={true} />
              )}
            </View>
        </View>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.modalView}>
              <Text style={[styles.title, { textAlign: 'center' }]}>Interaction</Text>
              <Picker
                selectedValue={selectedValue}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
              >
                <Picker.Item label="Select type" value="" />
                <Picker.Item label="Good Interaction" value="good" />
                <Picker.Item label="Bad Interaction" value="bad" />
                <Picker.Item label="Continuity" value="neutral" />
                <Picker.Item label="Swap" value="swap" />
              </Picker>

                {selectedValue !== '' && selectedValue !== 'swap' && (
                    <Picker
                        selectedValue={nestedSelectedValue}
                        style={styles.picker}
                        onValueChange={(itemValue, itemIndex) => setNestedSelectedValue(itemValue)}
                    >
                        <Picker.Item label="Select action" value="" />
                        <Picker.Item label="Spike" value="spike" />
                        <Picker.Item label="Block" value="block" />
                        <Picker.Item label="Defense" value="defense" />
                        <Picker.Item label="Serve" value="serve" />
                        <Picker.Item label="Receive" value="receive" />
                    </Picker>
                )}

                <Button title="Seleccionar"  style={[{ marginVertical: 10 }]} onPress={handleSelect} />
                <View style={[{ marginVertical: 5 }]}></View>
                <Button title="Cancelar" onPress={() => setModalVisible(false)} />
            </View>
        </Modal>
        <Text style={[styles.title, { textAlign: 'left' }]}>Last point</Text>
        {lastPoint != null ? (
          <View style={[styles.player]}>
            <Avatar number={lastPoint.dorsal} size={50} color="secondary" />
            <View style={styles.playerInfoContainer}>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{lastPoint.action}</Text>
                {lastPoint.type === 'good' && (
                  <Icon name="thumb-up" size={20} color="green" />
                )}
                {lastPoint.type === 'bad' && (
                        <Icon name="thumb-down" size={20} color="red" />
                )}
                {lastPoint.type === 'neutral' && (
                        <Icon name="drag-handle" size={20} color="orange" />
                )}
              </View>
              <Text style={styles.playerPosition}>{lastPoint.name} {lastPoint.surname}</Text>
            </View>
          </View>
        ) : (
          <Avatar size={50} color="secondary" undefinedAvatar={true} />
        )}
        
        <Text style={[styles.title, { textAlign: 'left' }]}>Benched</Text>
        <ScrollView style={styles.playerScroll}>
        {benchedPlayers && benchedPlayers.length > 0 ? (
          benchedPlayers.map((player, index) => (
            <TouchableOpacity onPress={() => setSelectedPlayer(player)} key={index}>
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
        <View style={[styles.sc_box_container]}>
          <View style={styles.sc_container}>
            <View style={styles.sc_Teams}>
              <Text style={[styles.sc_title]}>You</Text>
              <View  style={styles.sc_square}>
                <Text style={[styles.sc_title, { textAlign: 'center' }]}>{teamPoints[currentSet]}</Text>
              </View>
            </View>
            <View style={styles.sc_info_container}>
              <TouchableOpacity  onPress={() => addPoints(true)}>
                <View style={styles.sc_square_plus}>
                  <Icon name="add" size={30} color="#539DF3" />
                </View>
              </TouchableOpacity>
              <View style={styles.sc_set_info}>
                <Text style={[styles.sc_title, {color: '#676D75'}]}>Set</Text>
                <Text style={[styles.sc_title, { textAlign: 'center' }]}>{currentSet}</Text>
              </View>
              <TouchableOpacity onPress={() => addPoints(false)}>
                <View style={styles.sc_square_plus}>
                  <Icon name="add" size={30} color="#539DF3" />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.sc_Teams}>
              <Text style={[styles.sc_title]}>Rival</Text>
              <View style={styles.sc_square}>
                <Text style={[styles.sc_title, { textAlign: 'center' }]}>{rivalPoints[currentSet]}</Text>
              </View>
            </View>
          </View>
        </View>
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
  sc_box_container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sc_container: {
    width: 300,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  sc_Teams: {
    width: 70,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sc_info_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sc_set_info: {
    marginHorizontal: 15,
  },
  sc_title: {
    fontSize: 20,
    color: '#fff',
  },
  sc_square: {
    width: 40,
    height: 40,
    backgroundColor: '#1D1F24',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  sc_square_plus: {
    width: 30,
    height: 30,
    backgroundColor: '#1D1F24',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  modalView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
      backgroundColor: '#1D1F24',
      padding: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
  },
  picker: {
    height: 50,
    width: 250,
    color: '#fff',
  },
});

export default InGameScreen;
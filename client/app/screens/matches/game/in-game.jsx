import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, Button, TouchableOpacity  } from 'react-native';
import Avatar from '../../../components/Avatar';
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

    const [courtStatus, setCourtStatus] = useState();
    const [actualRotation, setActualRotation] = useState(1);
    const [lastPoint, setLastPoint] = useState(null);
    const [liberos, setLiberos] = useState();
    const [middleBlocker, setMiddleBlocker] = useState();
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
            <View style={styles.frontCourt}></View>
            <View style={styles.backCourt}></View>
        </View>

        <Text style={[styles.title, { textAlign: 'left' }]}>Last point</Text>
        {lastPoint != null ? (
          <Avatar size={50} color="secondary" undefinedAvatar={true} />
        ) : (
          <Avatar size={50} color="secondary" undefinedAvatar={true} />
        )}
        
        <Text style={[styles.title, { textAlign: 'left' }]}>Benched</Text>
        <Text style={[styles.title, { textAlign: 'center' }]}>Scoreboard</Text>
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
});

export default InGameScreen;
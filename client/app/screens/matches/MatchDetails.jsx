import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

const MatchDetailsScreen = ({ route }) => {
  const { matchId } = route.params;
  const [matchDetails, setMatchDetails] = useState(null);
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

  if (loading || !matchDetails) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Date: {matchDetails.date}</Text>
      <Text>Result: {matchDetails.result}</Text>
      <Text>Teams: {matchDetails.teams.join(' vs ')}</Text>
      <Text>Tags: {matchDetails.tags.join(', ')}</Text>
      <Text>Players:</Text>
      {matchDetails.players.map((player, index) => (
        <Text key={index}>{player}</Text>
      ))}
      {/* Agregar botones aquí */}
    </View>
  );
};

MatchDetailsScreen.displayName = "Test";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default MatchDetailsScreen;

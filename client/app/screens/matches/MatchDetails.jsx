import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MatchDetailsScreen = ({ route }) => {
  const { matchId } = route.params;

  // Aquí deberías realizar una solicitud de red para obtener los detalles del partido con el ID `matchId`

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match Details</Text>
      <Text>Match ID: {matchId}</Text>
      {/* Aquí mostrarías los detalles del partido obtenidos de la solicitud de red */}
    </View>
  );
};

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

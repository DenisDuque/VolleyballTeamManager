import React from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';

const MatchesScreen = () => {
  const matches = [
    { id: '1', name: 'Match 1' },
    { id: '2', name: 'Match 2' },
    { id: '3', name: 'Match 3' },
    { id: '4', name: 'Match 4' },
    { id: '5', name: 'Match 5' },
    { id: '6', name: 'Match 6' },
    { id: '7', name: 'Match 7' },
    { id: '8', name: 'Match 8' },
    { id: '9', name: 'Match 9' },
    { id: '10', name: 'Match 10' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.matchItem}>
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matches</Text>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
        />
        {/* Aquí puedes agregar el filtro */}
      </View>
      <FlatList
        data={matches}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      {/* Aquí puedes agregar la barra de navegación */}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  matchItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default MatchesScreen;

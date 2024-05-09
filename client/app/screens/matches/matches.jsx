import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../../context/UserContext';
import { useNavigation } from '@react-navigation/native';

const MatchesScreen = () => {
  const { user } = useContext(UserContext);
  const [matches, setMatches] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || '192.168.0.30:3000';

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(`http://`+ apiUrl +`/matches/getMatches/${user._id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const matchesData = await response.json();
        setMatches(matchesData);
      } catch (error) {
        console.error('There was a problem fetching the data:', error);
      }
    };

    fetchMatches();
  }, [user]);

  const handleMatchPress = (matchId, itemName) => {
    // Navegar a la pantalla de detalles del partido con el ID del partido
    navigation.navigate('MatchDetails', { matchId, itemName });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMatchPress(item._id, item.name)}>
      <View style={styles.matchItem}>
        <Text>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={matches}
        renderItem={renderItem}
        keyExtractor={item => item._id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
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
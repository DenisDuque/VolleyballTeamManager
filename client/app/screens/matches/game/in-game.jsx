import { View, Text } from "react-native";

const InGameScreen = ({ route }) => {
    const { matchId } = route.params;
    const [currentSet, setCurrentSet] = useState(1);
    const [setterPosition, setSetterPosition] = useState({ 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, });
    const [matchDetails, setMatchDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [lineups, setLineups] = useState({ 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, });

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

    if (loading || !matchDetails) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
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
      <View style={styles.playersContainer}>
        <Text style={styles.playersTitle}>Benched</Text>
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
}

export default InGameScreen;
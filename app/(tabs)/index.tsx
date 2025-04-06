import { View, Text, FlatList } from 'react-native';
import tw from 'twrnc';

export default function HomeScreen() {
  const dummyGroups = [
    { id: '1', name: 'Friends', members: ['You', 'Alex'], total: 120 },
    { id: '2', name: 'Family', members: ['You', 'Mom'], total: 250 },
    { id: '3', name: 'Work', members: ['You', 'Team'], total: -75 },
  ];

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <FlatList
        data={dummyGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={tw`bg-gray-200 p-4 mb-3 rounded`}>
            <Text style={tw`text-lg font-bold`}>{item.name}</Text>
            <Text>Total Balance: ₹{item.total}</Text>
            <Text>Members: {item.members.join(', ')}</Text>
          </View>
        )}
      />
    </View>
  );
}

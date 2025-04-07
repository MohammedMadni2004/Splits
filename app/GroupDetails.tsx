import { useRoute } from '@react-navigation/native';
import { useGroupStore } from '@/store/groupStore';
import { View, Text, FlatList } from 'react-native';
import tw from 'twrnc';

export default function GroupDetails() {
  const route = useRoute();
  const { groupId } = route.params as { groupId: string };
  const group = useGroupStore((state) => state.groups.find((g) => g.id === groupId));

  if (!group) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <Text style={tw`text-lg text-gray-500`}>Group not found</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-xl font-bold mb-4`}>{group.name}</Text>
      <Text style={tw`text-gray-600 mb-4`}>{group.description}</Text>

      <Text style={tw`text-lg font-bold mb-2`}>Members</Text>
      <FlatList
        data={group.members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={tw`p-2 border-b border-gray-200`}>{item.name}</Text>
        )}
      />

      <Text style={tw`text-lg font-bold mt-4 mb-2`}>Events</Text>
      <FlatList
        data={group.events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={tw`p-2 border-b border-gray-200`}>
            <Text style={tw`font-bold`}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Amount: ₹{item.amount}</Text>
            <Text>Payer: {group.members.find((m) => m.id === item.payer)?.name}</Text>
            <Text>
              Split: {Object.entries(item.splitBetween).map(([id, amount]) => {
                const member = group.members.find((m) => m.id === id);
                return `${member?.name || 'Unknown'}: ₹${amount}`;
              }).join(', ')}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={tw`text-gray-500`}>No events added</Text>}
      />

      <Text style={tw`text-lg font-bold mt-4 mb-2`}>Payables</Text>
      <FlatList
        data={group.payable}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const fromMember = group.members.find((m) => m.id === item.from);
          const toMember = group.members.find((m) => m.id === item.to);
          return (
            <Text style={tw`p-2 border-b border-gray-200`}>
              {fromMember?.name} owes {toMember?.name}: ₹{item.amount}
            </Text>
          );
        }}
        ListEmptyComponent={<Text style={tw`text-gray-500`}>No payables</Text>}
      />
    </View>
  );
}

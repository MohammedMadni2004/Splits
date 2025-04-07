import { useRoute } from '@react-navigation/native';
import { useGroupStore } from '@/store/groupStore';
import { View, Text, FlatList, useColorScheme } from 'react-native';
import tw from 'twrnc';

export default function GroupDetails() {
  const route = useRoute();
  const { groupId } = route.params as { groupId: string };
  const group = useGroupStore((state) => state.groups.find((g) => g.id === groupId));

  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const styles = {
    backgroundColor: isDark ? '#121212' : '#F5F5F5',
    cardBackground: isDark ? '#1E1E2C' : '#FFFFFF',
    borderColor: isDark ? '#2C2C3E' : '#E0E0E0',
    textColor: isDark ? '#F1F5F9' : '#1E293B',
    highlight: isDark ? '#FFD700' : '#4CAF50',
    fadedText: isDark ? '#A1A1AA' : '#6B7280',
  };

  if (!group) {
    return (
      <View style={[tw`flex-1 justify-center items-center`, { backgroundColor: styles.backgroundColor }]}>
        <Text style={[tw`text-lg`, { color: styles.fadedText }]}>Group not found</Text>
      </View>
    );
  }

  return (
    <View style={[tw`flex-1 p-4`, { backgroundColor: styles.backgroundColor }]}>
      <Text style={[tw`text-3xl font-extrabold mb-4`, { color: styles.highlight }]}>
        {group.name}
      </Text>
      <Text style={[tw`text-base mb-4`, { color: styles.fadedText }]}>
        {group.description}
      </Text>

      <Text style={[tw`text-xl font-bold mb-2`, { color: styles.textColor }]}>Members</Text>
      <FlatList
        data={group.members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={[tw`p-2`, { color: styles.textColor }]}>{item.name}</Text>
        )}
      />

      <Text style={[tw`text-xl font-bold mt-6 mb-2`, { color: styles.textColor }]}>Events</Text>
      <FlatList
        data={group.events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              tw`p-4 mb-3 rounded-2xl`,
              {
                backgroundColor: styles.cardBackground,
                borderColor: styles.borderColor,
                borderWidth: 1,
              },
            ]}
          >
            <Text style={[tw`text-lg font-bold`, { color: styles.highlight }]}>{item.title}</Text>
            <Text style={[tw`text-sm mb-1`, { color: styles.textColor }]}>{item.description}</Text>
            <Text style={[tw`text-sm`, { color: styles.fadedText }]}>Amount: ₹{item.amount}</Text>
            <Text style={[tw`text-sm`, { color: styles.fadedText }]}>
              Payer: {group.members.find((m) => m.id === item.payer)?.name || 'Unknown'}
            </Text>
            <Text style={[tw`text-sm`, { color: styles.fadedText }]}>
              Split: {Object.entries(item.splitBetween)
                .map(([id, amt]) => {
                  const member = group.members.find((m) => m.id === id);
                  return `${member?.name || 'Unknown'}: ₹${amt}`;
                })
                .join(', ')}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[tw`text-sm`, { color: styles.fadedText }]}>No events added</Text>
        }
      />

      <Text style={[tw`text-xl font-bold mt-6 mb-2`, { color: styles.textColor }]}>Payables</Text>
      <FlatList
        data={group.payable}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          const fromMember = group.members.find((m) => m.id === item.from);
          const toMember = group.members.find((m) => m.id === item.to);
          return (
            <Text style={[tw`p-2`, { color: styles.fadedText }]}>
              {fromMember?.name} owes {toMember?.name}: ₹{item.amount}
            </Text>
          );
        }}
        ListEmptyComponent={
          <Text style={[tw`text-sm`, { color: styles.fadedText }]}>No payables</Text>
        }
      />
    </View>
  );
}

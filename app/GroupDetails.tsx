import { useRoute, useNavigation } from '@react-navigation/native';
import { useGroupStore } from '@/store/groupStore';
import { View, Text, FlatList, useColorScheme, ScrollView, TouchableOpacity, Alert } from 'react-native';
import tw from 'twrnc';
import { Event } from '@/types';
export default function GroupDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { groupId } = route.params as { groupId: string };
  const group = useGroupStore((state) => state.groups.find((g) => g.id === groupId));
  const deleteEvent = useGroupStore((state) => state.deleteEvent);
  const editEvent = useGroupStore((state) => state.editEvent);

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

  const totalOwed = group.payable.reduce((sum, payment) => sum + payment.amount, 0);
  const totalReceived = group.events.reduce((sum, event) => sum + event.amount, 0);

  const handleLongPressEvent = (event:Event) => {
    Alert.alert(
      'Manage Event',
      `What would you like to do with "${event.title}"?`,
      [
        {
          text: 'Edit',
          onPress: () => {
            // Ensure correct navigation to EditEvent screen
            navigation.navigate('EditEvent', { groupId: group.id, eventId: event.id });
          },
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteEvent(group.id, event.id);
            Alert.alert('Success', 'Event deleted successfully!');
          },
          style: 'destructive',
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <ScrollView
      style={[tw`flex-1`, { backgroundColor: styles.backgroundColor }]}
      contentContainerStyle={tw`p-4`}
    >
      <Text style={[tw`text-3xl font-extrabold mb-4`, { color: styles.highlight }]}>
        {group.name}
      </Text>
      <Text style={[tw`text-base mb-4`, { color: styles.fadedText }]}>
        {group.description}
      </Text>

      {/* Summary Section */}
      <View
        style={[
          tw`p-4 mb-6 rounded-lg`,
          {
            backgroundColor: styles.cardBackground,
            borderColor: styles.borderColor,
            borderWidth: 1,
          },
        ]}
      >
        <Text style={[tw`text-lg font-bold mb-2`, { color: styles.textColor }]}>Group Analysis</Text>
        <Text style={[tw`text-sm`, { color: styles.textColor }]}>
          Total Owed: ₹{totalOwed}
        </Text>
        <Text style={[tw`text-sm`, { color: styles.textColor }]}>
          Total Received: ₹{totalReceived}
        </Text>
        <Text style={[tw`text-sm`, { color: styles.textColor }]}>
          Net Balance: ₹{totalReceived - totalOwed}
        </Text>
      </View>

      <Text style={[tw`text-xl font-bold mb-2`, { color: styles.textColor }]}>Members</Text>
      <FlatList
        data={group.members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('MemberDetails', { groupId: group.id, memberId: item.id })}
          >
            <Text style={[tw`p-2`, { color: styles.textColor }]}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[tw`text-sm`, { color: styles.fadedText }]}>No members found</Text>
        }
        scrollEnabled={false} 
      />

      <Text style={[tw`text-xl font-bold mt-6 mb-2`, { color: styles.textColor }]}>Events</Text>
      <FlatList
        data={group.events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => handleLongPressEvent(item)}
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
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[tw`text-sm`, { color: styles.fadedText }]}>No events added</Text>
        }
        scrollEnabled={false} // Disable scrolling for FlatList
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
        scrollEnabled={false} 
      />

      <TouchableOpacity
        style={[
          tw`rounded-lg p-4 mt-6`,
          {
            backgroundColor: styles.highlight,
            shadowColor: isDark ? '#000' : '#D3D3D3',
            shadowOpacity: 0.3,
            shadowRadius: 4,
          },
        ]}
        onPress={() => navigation.navigate('CreateEvent', { groupId: group.id })}
      >
        <Text
          style={[
            tw`text-center font-bold`,
            {
              color: isDark ? '#121212' : '#FFFFFF',
            },
          ]}
        >
          Create New Event
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

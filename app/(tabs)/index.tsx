import { Group } from '@/types';
import { calculateTotals } from '@/utils/calculateTotals';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

export default function HomeScreen() {
  const dummyGroups: Group[] = [
    {
      id: '1',
      name: 'Goa Trip',
      description: 'Expenses of Goa trip',
      members: [
        { id: 'm1', name: 'You', email: 'you@example.com', phone: '1234567890' },
        { id: 'm2', name: 'Alex', email: 'alex@example.com', phone: '9876543210' },
      ],
      events: [
        {
          id: 'e1',
          title: 'Hotel Booking',
          description: '2-night stay',
          category: 'Accommodation',
          amount: 2000,
          timestamp: new Date(),
          payer: 'm1',
          splitBetween: { m1: 1000, m2: 1000 }
        },
        {
          id: 'e2',
          title: 'Dinner',
          description: 'Dinner at beach shack',
          category: 'Food',
          amount: 800,
          timestamp: new Date(),
          payer: 'm2',
          splitBetween: { m1: 400, m2: 400 },
        }
      ],
      payable: [
        {
          from: 'm1',
          to: 'm2',
          amount: 200
        }
      ]
    },
    {
      id: '2',
      name: 'Family',
      description: 'Family-related expenses',
      members: [
        { id: 'm1', name: 'You', email: 'you@example.com', phone: '1234567890' },
        { id: 'm3', name: 'Mom', email: 'mom@example.com', phone: '5555555555' },
      ],
      events: [
        {
          id: 'e3',
          title: 'Groceries',
          description: 'Weekly grocery shopping',
          category: 'Essentials',
          amount: 1000,
          timestamp: new Date(),
          payer: 'm1',

          splitBetween: { m1: 500, m3: 500 },
        }
      ],
      payable: [
        {
          from: 'm1',
          to: 'm3',
          amount: 500
        }
      ]
    }
  ];

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <FlatList
        data={dummyGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const { totalAmount, totalOwed, totalPaid } = calculateTotals(item);
          return (
            <View style={tw`bg-gray-200 p-4 mb-3 rounded`}>
              <Text style={tw`text-lg font-bold`}>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text>Members: {item.members.map(m => m.name).join(', ')}</Text>
              <Text style={tw`mt-2 text-sm`}>Total Amount: ₹{totalAmount}</Text>
              <Text>Total Owed: ₹{totalOwed}</Text>
              <Text>Total Paid: ₹{totalPaid}</Text>
            </View>
          );
        }}
      />
      <TouchableOpacity
        style={tw`absolute bottom-8 right-8 bg-blue-500 w-12 h-12 rounded-full items-center justify-center shadow-lg`}
        onPress={() => {
          console.log('Add new group');
        }}
      >
        <Text style={tw`text-white text-2xl`}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

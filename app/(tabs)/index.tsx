import { useEffect, useState } from 'react';
import { useGroupStore } from '@/store/groupStore';
import { calculateTotals } from '@/utils/calculateTotals';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, useColorScheme, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

export default function HomeScreen() {
  const isHydrated = useGroupStore((state) => state.isHydrated);
  const groups = useGroupStore((state) => state.groups);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const theme = useColorScheme(); // 'light' or 'dark'

  const isDark = theme === 'dark';

  const styles = {
    backgroundColor: isDark ? '#1f2937' : '#f5f7fa',
    cardBackground: isDark ? '#374151' : '#ffffff',
    textColor: isDark ? '#f1f5f9' : '#1e293b',
    buttonBackground: isDark ? '#60a5fa' : '#3b82f6',
    buttonText: isDark ? '#1f2937' : '#ffffff',
    inputBackground: isDark ? '#2D3748' : '#FFFFFF',
    inputTextColor: isDark ? '#F1F5F9' : '#1E293B',
  };

  useEffect(() => {
    if (isHydrated && isLoading) {
      setIsLoading(false);
    }
  }, [isHydrated, isLoading]);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalOwedOrReceived = groups.reduce(
    (total, group) => total + group.payable.reduce((sum, payment) => sum + payment.amount, 0),
    0
  );

  const totalToBePaid = groups.reduce(
    (total, group) =>
      total +
      group.payable.reduce((sum, payment) => (payment.from === 'currentUserId' ? sum + payment.amount : sum), 0),
    0
  );

  if (isLoading) {
    return (
      <View style={[tw`flex-1 justify-center items-center`, { backgroundColor: styles.backgroundColor }]}>
        <ActivityIndicator size="large" color={styles.textColor} />
      </View>
    );
  }

  return (
    <View
      style={[
        tw`flex-1 p-4`,
        {
          backgroundColor: isDark ? '#121212' : '#F5F5F5',
        },
      ]}
    >
      <Text
        style={[
          tw`text-3xl font-extrabold mb-6`,
          {
            color: isDark ? '#FFD700' : '#1E293B',
            textShadowColor: isDark ? '#000' : '#D3D3D3',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          },
        ]}
      >
        Your Groups
      </Text>

      <Text
        style={[
          tw`text-lg font-bold mb-2`,
          {
            color: isDark ? '#FFD700' : '#1E293B',
          },
        ]}
      >
        Total Owed/To Be Received: ₹{totalOwedOrReceived}
      </Text>

      <Text
        style={[
          tw`text-lg font-bold mb-4`,
          {
            color: isDark ? '#FFD700' : '#1E293B',
          },
        ]}
      >
        Total To Be Paid: ₹{totalToBePaid}
      </Text>

      <TextInput
        style={[
          tw`border rounded-lg p-3 mb-4`,
          {
            backgroundColor: styles.inputBackground,
            color: styles.inputTextColor,
            borderColor: isDark ? '#4A5568' : '#E2E8F0',
          },
        ]}
        placeholder="Search Groups"
        placeholderTextColor={isDark ? '#A0AEC0' : '#718096'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const { totalAmount, totalOwed, totalPaid } = calculateTotals(item);
          return (
            <TouchableOpacity
              style={[
                tw`p-4 mb-4 rounded-2xl shadow-lg`,
                {
                  backgroundColor: isDark ? '#1E1E2C' : '#FFFFFF',
                  borderColor: isDark ? '#2C2C3E' : '#E0E0E0',
                  borderWidth: 1,
                  shadowColor: isDark ? '#000' : '#D3D3D3',
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                },
              ]}
              onPress={() => navigation.navigate('GroupDetails', { groupId: item.id })}
            >
              <Text
                style={[
                  tw`text-xl font-semibold`,
                  {
                    color: isDark ? '#FFD700' : '#1E293B',
                  },
                ]}
              >
                {item.name}
              </Text>
              <Text
                style={[
                  tw`text-sm mb-2`,
                  {
                    color: isDark ? '#E0E0E0' : '#212121',
                  },
                ]}
              >
                {item.description}
              </Text>
              <View>
                <Text
                  style={[
                    tw`text-sm mb-1`,
                    {
                      color: isDark ? '#E0E0E0' : '#212121',
                    },
                  ]}
                >
                  Members: {item.members.map((m) => m.name).join(', ')}
                </Text>
                <Text
                  style={[
                    tw`text-sm`,
                    {
                      color: isDark ? '#FFD700' : '#4CAF50',
                    },
                  ]}
                >
                  Total Amount: ₹{totalAmount}
                </Text>
                <Text
                  style={[
                    tw`text-sm`,
                    {
                      color: isDark ? '#FFD700' : '#4CAF50',
                    },
                  ]}
                >
                  Total Owed: ₹{totalOwed}
                </Text>
                <Text
                  style={[
                    tw`text-sm`,
                    {
                      color: isDark ? '#FFD700' : '#4CAF50',
                    },
                  ]}
                >
                  Total Paid: ₹{totalPaid}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text
            style={[
              tw`text-center text-lg`,
              {
                color: isDark ? '#757575' : '#BDBDBD',
              },
            ]}
          >
            No groups found
          </Text>
        }
      />
      <TouchableOpacity
        style={[
          tw`absolute bottom-8 right-8 w-16 h-16 rounded-full items-center justify-center shadow-xl`,
          {
            backgroundColor: isDark ? '#FFD700' : '#4CAF50',
            elevation: 6,
          },
        ]}
        onPress={() => navigation.navigate('CreateGroup')}
      >
        <Text style={[tw`text-3xl font-bold`, { color: isDark ? '#121212' : '#FFFFFF' }]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  useColorScheme,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useGroupStore } from '@/store/groupStore';
import tw from 'twrnc';

export default function CreateEvent() {
  const route = useRoute();
  const navigation = useNavigation();
  const { groupId } = route.params as { groupId: string };

  const group = useGroupStore((state) => state.groups.find((g) => g.id === groupId));
  const addEvent = useGroupStore((state) => state.addEvent);

  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const styles = {
    backgroundColor: isDark ? '#121212' : '#FFFFFF',
    textColor: isDark ? '#F1F5F9' : '#1E293B',
    inputBackground: isDark ? '#1E1E1E' : '#F0F0F0',
    borderColor: isDark ? '#3B3B3B' : '#CCCCCC',
    buttonBackground: isDark ? '#FFD700' : '#4CAF50',
    buttonText: isDark ? '#121212' : '#FFFFFF',
    cardBackground: isDark ? '#1F1F1F' : '#E5E5E5',
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'percentage'>('equal');
  const [splitValues, setSplitValues] = useState<{ [key: string]: number }>({});

  const handleSplitChange = () => {
    if (!amount || group.members.length === 0) return;
    const equalSplit = parseFloat(amount) / group.members.length;
    const updatedSplit = group.members.reduce((acc, member) => {
      acc[member.id] = equalSplit;
      return acc;
    }, {} as { [key: string]: number });
    setSplitValues(updatedSplit);
  };

  const handleCreateEvent = () => {
    if (!title.trim() || !description.trim() || !amount || !payer) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    const totalAmount = parseFloat(amount);
    let finalSplit: { [key: string]: number } = {};

    if (splitType === 'equal') {
      const equalAmount = totalAmount / group.members.length;
      group.members.forEach((member) => {
        finalSplit[member.id] = equalAmount;
      });
    } else {
      const totalPercent = Object.values(splitValues).reduce((a, b) => a + b, 0);
      if (totalPercent !== 100) {
        Alert.alert('Invalid Split', 'Total percentage must equal 100%');
        return;
      }

      finalSplit = Object.fromEntries(
        Object.entries(splitValues).map(([memberId, percent]) => [
          memberId,
          (percent / 100) * totalAmount,
        ])
      );
    }

    const newEvent = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category: 'General', // You can make this dynamic later
      amount: totalAmount,
      timestamp: new Date(),
      payer,
      splitBetween: finalSplit,
    };

    addEvent(groupId, newEvent);
    Alert.alert('Success', 'Event created successfully!');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: styles.backgroundColor }}
        contentContainerStyle={tw`p-4 pb-20`}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[tw`text-2xl font-bold mb-6`, { color: styles.textColor }]}>Create Event</Text>

        <TextInput
          style={[
            tw`rounded-xl p-3 mb-4`,
            {
              backgroundColor: styles.inputBackground,
              borderColor: styles.borderColor,
              color: styles.textColor,
              borderWidth: 1,
            },
          ]}
          placeholder="Event Title"
          placeholderTextColor={styles.borderColor}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[
            tw`rounded-xl p-3 mb-4`,
            {
              backgroundColor: styles.inputBackground,
              borderColor: styles.borderColor,
              color: styles.textColor,
              borderWidth: 1,
            },
          ]}
          placeholder="Description"
          placeholderTextColor={styles.borderColor}
          value={description}
          onChangeText={setDescription}
        />

        <TextInput
          style={[
            tw`rounded-xl p-3 mb-4`,
            {
              backgroundColor: styles.inputBackground,
              borderColor: styles.borderColor,
              color: styles.textColor,
              borderWidth: 1,
            },
          ]}
          placeholder="Total Amount"
          placeholderTextColor={styles.borderColor}
          value={amount}
          onChangeText={(val) => {
            setAmount(val);
            if (splitType === 'equal') handleSplitChange();
          }}
          keyboardType="numeric"
        />

        <Text style={[tw`text-lg font-semibold mb-2`, { color: styles.textColor }]}>Who paid?</Text>
        <View style={tw`flex-row flex-wrap gap-2 mb-4`}>
          {group.members.map((member) => (
            <TouchableOpacity
              key={member.id}
              onPress={() => setPayer(member.id)}
              style={[
                tw`px-4 py-2 rounded-full mr-2 mb-2`,
                {
                  backgroundColor: payer === member.id ? styles.buttonBackground : styles.cardBackground,
                },
              ]}
            >
              <Text
                style={{
                  color: payer === member.id ? styles.buttonText : styles.textColor,
                }}
              >
                {member.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[tw`text-lg font-semibold mb-2`, { color: styles.textColor }]}>Split Type</Text>
        <View style={tw`flex-row gap-4 mb-4`}>
          <TouchableOpacity
            style={[
              tw`flex-1 rounded-lg px-4 py-3`,
              {
                backgroundColor: splitType === 'equal' ? styles.buttonBackground : styles.cardBackground,
              },
            ]}
            onPress={() => {
              setSplitType('equal');
              handleSplitChange();
            }}
          >
            <Text
              style={[
                tw`text-center font-bold`,
                { color: splitType === 'equal' ? styles.buttonText : styles.textColor },
              ]}
            >
              Equal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              tw`flex-1 rounded-lg px-4 py-3`,
              {
                backgroundColor: splitType === 'percentage' ? styles.buttonBackground : styles.cardBackground,
              },
            ]}
            onPress={() => setSplitType('percentage')}
          >
            <Text
              style={[
                tw`text-center font-bold`,
                { color: splitType === 'percentage' ? styles.buttonText : styles.textColor },
              ]}
            >
              Percentage
            </Text>
          </TouchableOpacity>
        </View>

        {splitType === 'percentage' && (
          <View style={tw`mb-4`}>
            {group.members.map((member) => (
              <View key={member.id} style={tw`flex-row items-center mb-2`}>
                <Text style={[tw`flex-1`, { color: styles.textColor }]}>{member.name}</Text>
                <TextInput
                  style={[
                    tw`border rounded-lg p-2 w-20 text-right`,
                    { borderColor: styles.borderColor, color: styles.textColor },
                  ]}
                  placeholder="%"
                  placeholderTextColor={styles.borderColor}
                  keyboardType="numeric"
                  onChangeText={(value) =>
                    setSplitValues((prev) => ({
                      ...prev,
                      [member.id]: parseFloat(value) || 0,
                    }))
                  }
                />
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[
            tw`rounded-lg p-4 mt-6 mb-10`,
            {
              backgroundColor: styles.buttonBackground,
            },
          ]}
          onPress={handleCreateEvent}
        >
          <Text style={[tw`text-center font-bold`, { color: styles.buttonText }]}>Create Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

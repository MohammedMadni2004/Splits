import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { useGroupStore } from '@/store/groupStore';
import { Member } from '@/types';
import tw from 'twrnc';
import { z } from 'zod';

const emailSchema = z.string().email({ message: 'Invalid email address' });
const phoneSchema = z.string().regex(/^\d{10}$/, { message: 'Phone number must be 10 digits' });

export default function CreateGroup() {
  const addGroup = useGroupStore((state) => state.addGroup);

  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const theme = useColorScheme(); // 'light' or 'dark'
  const isDark = theme === 'dark';

  const styles = {
    backgroundColor: isDark ? '#1f2937' : '#f5f7fa',
    textColor: isDark ? '#f1f5f9' : '#1e293b',
    borderColor: isDark ? '#374151' : '#e5e7eb',
    buttonBackground: isDark ? '#60a5fa' : '#3b82f6',
    buttonText: isDark ? '#1f2937' : '#ffffff',
  };

  const validateEmail = (email: string) => {
    try {
      emailSchema.parse(email);
      setEmailError('');
    } catch (error) {
      setEmailError((error as z.ZodError).errors[0].message);
    }
  };

  const validatePhone = (phone: string) => {
    try {
      phoneSchema.parse(phone);
      setPhoneError('');
    } catch (error) {
      setPhoneError((error as z.ZodError).errors[0].message);
    }
  };

  const addMember = () => {
    if (!newMemberName.trim() || emailError || phoneError || !newMemberEmail.trim() || !newMemberPhone.trim()) {
      return;
    }

    const newMember: Member = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      email: newMemberEmail.trim(),
      phone: newMemberPhone.trim(),
    };

    setMembers((prev) => [...prev, newMember]);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPhone('');
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || members.length < 2) {
      Alert.alert('Validation Error', 'Group name is required and at least two members are required');
      return;
    }

    const newGroup = {
      id: Date.now().toString(),
      name: groupName.trim(),
      description: groupDescription.trim(),
      members,
      events: [],
      payable: [],
    };

    addGroup(newGroup);

    setGroupName('');
    setGroupDescription('');
    setMembers([]);

    Alert.alert('Success', 'Group created successfully!');
  };

  const isAddMemberDisabled =
    !newMemberName.trim() || !!emailError || !!phoneError || !newMemberEmail.trim() || !newMemberPhone.trim();
  const isCreateDisabled = !groupName.trim() || members.length < 2;

  return (
    <View style={[tw`flex-1 p-6`, { backgroundColor: styles.backgroundColor }]}>
      <Text style={[tw`text-2xl font-bold mb-6`, { color: styles.textColor }]}>Create Group</Text>

      <TextInput
        style={[tw`border rounded-lg p-3 mb-4`, { borderColor: styles.borderColor, color: styles.textColor }]}
        placeholder="Group Name"
        placeholderTextColor={styles.borderColor}
        value={groupName}
        onChangeText={setGroupName}
      />

      <TextInput
        style={[tw`border rounded-lg p-3 mb-4`, { borderColor: styles.borderColor, color: styles.textColor }]}
        placeholder="Group Description"
        placeholderTextColor={styles.borderColor}
        value={groupDescription}
        onChangeText={setGroupDescription}
      />

      <Text style={[tw`text-lg font-bold mb-4`, { color: styles.textColor }]}>Add Member</Text>

      <TextInput
        style={[tw`border rounded-lg p-3 mb-3`, { borderColor: styles.borderColor, color: styles.textColor }]}
        placeholder="Name"
        placeholderTextColor={styles.borderColor}
        value={newMemberName}
        onChangeText={setNewMemberName}
      />
      <TextInput
        style={[tw`border rounded-lg p-3 mb-3`, { borderColor: styles.borderColor, color: styles.textColor }]}
        placeholder="Email"
        placeholderTextColor={styles.borderColor}
        value={newMemberEmail}
        onChangeText={(text) => {
          setNewMemberEmail(text);
          validateEmail(text);
        }}
        keyboardType="email-address"
      />
      {emailError ? <Text style={tw`text-red-500 text-sm mb-3`}>{emailError}</Text> : null}
      <TextInput
        style={[tw`border rounded-lg p-3 mb-3`, { borderColor: styles.borderColor, color: styles.textColor }]}
        placeholder="Phone"
        placeholderTextColor={styles.borderColor}
        value={newMemberPhone}
        onChangeText={(text) => {
          setNewMemberPhone(text);
          validatePhone(text);
        }}
        keyboardType="phone-pad"
      />
      {phoneError ? <Text style={tw`text-red-500 text-sm mb-3`}>{phoneError}</Text> : null}

      <TouchableOpacity
        style={[
          tw`rounded-lg p-4 mb-6`,
          { backgroundColor: styles.buttonBackground, opacity: isAddMemberDisabled ? 0.5 : 1 },
        ]}
        onPress={addMember}
        disabled={isAddMemberDisabled}
      >
        <Text style={[tw`text-center font-bold`, { color: styles.buttonText }]}>Add Member</Text>
      </TouchableOpacity>

      <Text style={[tw`text-lg font-bold mb-4`, { color: styles.textColor }]}>Members List</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={[tw`p-3 border-b`, { color: styles.textColor, borderColor: styles.borderColor }]}>
            {item.name} - {item.email}
          </Text>
        )}
        ListEmptyComponent={<Text style={[tw`text-gray-500`, { color: styles.textColor }]}>No members added</Text>}
      />

      <TouchableOpacity
        style={[
          tw`rounded-lg p-4 mt-6`,
          { backgroundColor: styles.buttonBackground, opacity: isCreateDisabled ? 0.5 : 1 },
        ]}
        onPress={handleCreateGroup}
        disabled={isCreateDisabled}
      >
        <Text style={[tw`text-center font-bold`, { color: styles.buttonText }]}>Create Group</Text>
      </TouchableOpacity>
    </View>
  );
}

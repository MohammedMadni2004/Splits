import { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useGroupStore } from '@/store/groupStore';
import { Member } from '@/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import tw from 'twrnc';
import { z } from 'zod';

const emailSchema = z.string().email({ message: 'Invalid email address' });
const phoneSchema = z.string().regex(/^\d{10}$/, { message: 'Phone number must be 10 digits' });

export default function CreateGroup() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'icon');

  const addGroup = useGroupStore((state) => state.addGroup);

  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

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
    <View style={[tw`flex-1 p-4`, { backgroundColor }]}>
      <Text style={[tw`text-xl font-bold mb-4`, { color: textColor }]}>Create Group</Text>

      <TextInput
        style={[tw`border rounded p-2 mb-3`, { borderColor, color: textColor }]}
        placeholder="Group Name"
        placeholderTextColor={borderColor}
        value={groupName}
        onChangeText={setGroupName}
      />

      <TextInput
        style={[tw`border rounded p-2 mb-3`, { borderColor, color: textColor }]}
        placeholder="Group Description"
        placeholderTextColor={borderColor}
        value={groupDescription}
        onChangeText={setGroupDescription}
      />

      <Text style={[tw`text-lg font-bold mt-4 mb-2`, { color: textColor }]}>Add Member</Text>

      <TextInput
        style={[tw`border rounded p-2 mb-2`, { borderColor, color: textColor }]}
        placeholder="Name"
        placeholderTextColor={borderColor}
        value={newMemberName}
        onChangeText={setNewMemberName}
      />
      <TextInput
        style={[tw`border rounded p-2 mb-2`, { borderColor, color: textColor }]}
        placeholder="Email"
        placeholderTextColor={borderColor}
        value={newMemberEmail}
        onChangeText={(text) => {
          setNewMemberEmail(text);
          validateEmail(text);
        }}
        keyboardType="email-address"
      />
      {emailError ? <Text style={tw`text-red-500 text-sm mb-2`}>{emailError}</Text> : null}
      <TextInput
        style={[tw`border rounded p-2 mb-2`, { borderColor, color: textColor }]}
        placeholder="Phone"
        placeholderTextColor={borderColor}
        value={newMemberPhone}
        onChangeText={(text) => {
          setNewMemberPhone(text);
          validatePhone(text);
        }}
        keyboardType="phone-pad"
      />
      {phoneError ? <Text style={tw`text-red-500 text-sm mb-2`}>{phoneError}</Text> : null}

      <Button title="Add Member" onPress={addMember} disabled={isAddMemberDisabled} />

      <Text style={[tw`text-lg font-bold mt-5 mb-2`, { color: textColor }]}>Members List</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={[tw`p-2 border-b`, { color: textColor, borderColor }]}>{item.name} - {item.email}</Text>
        )}
        ListEmptyComponent={<Text style={[tw`text-gray-500`, { color: textColor }]}>No members added</Text>}
      />

      <View style={tw`mt-6`}>
        <Button title="Create Group" onPress={handleCreateGroup} disabled={isCreateDisabled} />
      </View>
    </View>
  );
}

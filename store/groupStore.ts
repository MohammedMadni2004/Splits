import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Group, Event } from '@/types';
import { dummyGroups } from '@/constants/groupData';

type GroupStore = {
  groups: Group[];
  isHydrated: boolean;
  addGroup: (group: Group) => void;
  removeGroup: (groupId: string) => void;
  resetGroups: () => void;
  addEvent: (groupId: string, event: Event) => void;
};

export const useGroupStore = create<GroupStore>()(
  persist(
    (set) => ({
      groups: dummyGroups,
      isHydrated: false,

      addGroup: (group) =>
        set((state) => ({
          groups: [...state.groups, group],
        })),

      removeGroup: (groupId) =>
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== groupId),
        })),

      resetGroups: () => set({ groups: dummyGroups }),

      addEvent: (groupId, event) =>
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === groupId
              ? { ...group, events: [...group.events, event] }
              : group
          ),
        })),
    }),
    {
      name: 'group-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);

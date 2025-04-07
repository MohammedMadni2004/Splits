import { Group } from '@/types';

export const dummyGroups: Group[] = [
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
        splitBetween: { m1: 400, m2: 400 }
      }
    ],
    payable: [
      { from: 'm1', to: 'm2', amount: 200 }
    ]
  },
  {
    id: '2',
    name: 'Family',
    description: 'Family-related expenses',
    members: [
      { id: 'm1', name: 'You', email: 'you@example.com', phone: '1234567890' },
      { id: 'm3', name: 'Mom', email: 'mom@example.com', phone: '5555555555' }
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
        splitBetween: { m1: 500, m3: 500 }
      }
    ],
    payable: [
      { from: 'm1', to: 'm3', amount: 500 }
    ]
  }
];

import { Group } from '@/types';

export const calculateTotals = (group: Group) => {
  const totalAmount = group.events.reduce((sum, event) => sum + event.amount, 0);
  const totalOwed = group.payable.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPaid = group.events.reduce(
    (sum, event) => sum + (event.payer === 'm1' ? event.amount : 0),
    0
  );
  return { totalAmount, totalOwed, totalPaid };
};

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  amount: number;
  timestamp: Date;
  payer: string; // Member ID
  splitBetween: Record<string, number>; // Member ID to amount mapping
}

export interface Payable {
  from: string; // Member ID
  to: string; // Member ID
  amount: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: Member[];
  events: Event[];
  payable: Payable[];
}

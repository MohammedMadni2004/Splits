export type Member = {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  
  export type Payment = {
    from: string; 
    to: string;   
    amount: number;
  };
  
  export type Event = {
    id: string;
    title: string;
    amount: number;
    description?: string;
    category?: string;
    timestamp: number;
    payer: string; 
    splitBetween: {
      [memberId: string]: number; 
    };
  };
  
  export type Group = {
    id: string;
    name: string;
    description: string;
    members: Member[];
    payable: Payment[];
    events: Event[];
  };
  
export interface Campaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  status: 'active' | 'completed' | 'cancelled';
  beneficiary: {
    id: string;
    name: string;
  };
  group: {
    id: string;
    name: string;
  };
  createdAt: Date;
}

export interface FamilyGroup {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
}

export interface Contribution {
  id: string;
  amount: number;
  currency: string;
  isRecurring: boolean;
  user: {
    name: string;
  };
  createdAt: Date;
}

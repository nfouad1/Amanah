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

// Notification System Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  messageKey: string;
  messageParams?: Record<string, string>;
  timestamp: number;
  isRead: boolean;
  relatedResourceId?: string;
  relatedResourceType?: ResourceType;
}

export type NotificationType = 
  | 'campaign_created'
  | 'campaign_contribution'
  | 'campaign_goal_reached'
  | 'campaign_vote'
  | 'campaign_activated'
  | 'campaign_deleted'
  | 'role_changed'
  | 'group_invited'
  | 'invite_accepted'
  | 'invite_expired'
  | 'contribution_received';

export type ResourceType = 'campaign' | 'group' | 'user' | 'invite';

export type NotificationFilter = 'all' | 'campaigns' | 'contributions' | 'invites' | 'roles' | 'groups';

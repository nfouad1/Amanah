// Mock data storage using localStorage for demo purposes
// In production, this would be replaced with actual API calls

export interface Campaign {
  id: string;
  title: string;
  description: string;
  beneficiaryName: string;
  groupId: string;
  groupName: string;
  current: number;
  target: number;
  currency: string;
  status: 'active' | 'completed' | 'cancelled' | 'pending';
  contributors: number;
  createdAt: string;
  dueDate?: string;
  votes: number;
  votedBy: string[]; // Array of user IDs who voted
  needsApproval?: boolean;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: number;
  memberList?: GroupMember[];
}

export interface GroupMember {
  id: string;
  name: string;
  contact: string; // email or phone
  role: 'admin' | 'member';
  status: 'active' | 'invited';
  joinedDate: string;
}

export interface Activity {
  id: string;
  type: 'contribution' | 'campaign_created' | 'group_created';
  user: string;
  action: string;
  campaign?: string;
  amount?: number;
  currency?: string;
  isPrivate?: boolean;
  createdAt: string;
}

// Default campaigns
const defaultCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Medical Emergency - Uncle Ahmed',
    description: 'Uncle Ahmed needs urgent medical treatment for a serious condition.',
    beneficiaryName: 'Ahmed Hassan',
    groupId: '1',
    groupName: 'Extended Family Circle',
    current: 3200,
    target: 5000,
    currency: 'USD',
    status: 'active',
    contributors: 12,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    votes: 8,
    votedBy: [],
  },
  {
    id: '2',
    title: 'Education Support - Cousin Sara',
    description: 'Supporting Sara\'s university education expenses.',
    beneficiaryName: 'Sara Ahmed',
    groupId: '1',
    groupName: 'Extended Family Circle',
    current: 1800,
    target: 3000,
    currency: 'USD',
    status: 'active',
    contributors: 8,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    votes: 5,
    votedBy: [],
  },
  {
    id: '3',
    title: 'Home Repair - Aunt Fatima',
    description: 'Helping Aunt Fatima repair her home after storm damage.',
    beneficiaryName: 'Fatima Rahman',
    groupId: '2',
    groupName: 'Close Family',
    current: 4500,
    target: 4500,
    currency: 'USD',
    status: 'completed',
    contributors: 15,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    votes: 10,
    votedBy: [],
  },
];

const defaultGroups: Group[] = [
  { 
    id: '1', 
    name: 'Extended Family Circle', 
    description: 'Supporting our extended family', 
    members: 3,
    memberList: [
      { id: '1', name: 'You', contact: 'creator', role: 'admin', status: 'active', joinedDate: new Date().toISOString() },
      { id: '2', name: 'Sarah Miller', contact: 'sarah@email.com', role: 'member', status: 'active', joinedDate: new Date().toISOString() },
      { id: '3', name: 'Ali Khan', contact: '+1234567890', role: 'member', status: 'active', joinedDate: new Date().toISOString() },
    ]
  },
  { 
    id: '2', 
    name: 'Close Family', 
    description: 'Immediate family support', 
    members: 2,
    memberList: [
      { id: '1', name: 'You', contact: 'creator', role: 'admin', status: 'active', joinedDate: new Date().toISOString() },
      { id: '2', name: 'Mom', contact: 'mom@email.com', role: 'member', status: 'active', joinedDate: new Date().toISOString() },
    ]
  },
  { 
    id: '3', 
    name: 'Community Support', 
    description: 'Wider community network', 
    members: 1,
    memberList: [
      { id: '1', name: 'You', contact: 'creator', role: 'admin', status: 'active', joinedDate: new Date().toISOString() },
    ]
  },
];

const defaultActivities: Activity[] = [
  {
    id: '1',
    type: 'contribution',
    user: 'John D.',
    action: 'contributed',
    campaign: 'Medical Emergency - Uncle Ahmed',
    amount: 100,
    currency: 'USD',
    isPrivate: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'campaign_created',
    user: 'Sarah M.',
    action: 'created campaign',
    campaign: 'Education Support - Cousin Sara',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'contribution',
    user: 'You',
    action: 'contributed',
    campaign: 'Home Repair - Aunt Fatima',
    amount: 50,
    currency: 'USD',
    isPrivate: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function getCampaigns(): Campaign[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('amanah_campaigns');
    if (!stored) {
      localStorage.setItem('amanah_campaigns', JSON.stringify(defaultCampaigns));
      return defaultCampaigns;
    }
    
    // Parse and migrate old campaigns
    const campaigns = JSON.parse(stored);
    const migratedCampaigns = campaigns.map((c: any) => ({
      ...c,
      votes: c.votes || 0,
      votedBy: c.votedBy || [],
    }));
    
    // Save migrated data
    localStorage.setItem('amanah_campaigns', JSON.stringify(migratedCampaigns));
    return migratedCampaigns;
  } catch (error) {
    console.error('Error loading campaigns:', error);
    return defaultCampaigns;
  }
}

export function addCampaign(campaign: Omit<Campaign, 'id' | 'current' | 'contributors' | 'createdAt' | 'votes' | 'votedBy'>): Campaign {
  const campaigns = getCampaigns();
  const newCampaign: Campaign = {
    ...campaign,
    id: Date.now().toString(),
    current: 0,
    contributors: 0,
    createdAt: new Date().toISOString(),
    votes: 0,
    votedBy: [],
    status: 'pending', // New campaigns start as pending until they get enough votes
  };
  
  // Add to beginning of array (newest first)
  campaigns.unshift(newCampaign);
  localStorage.setItem('amanah_campaigns', JSON.stringify(campaigns));
  
  // Add activity
  addActivity({
    type: 'campaign_created',
    user: 'You',
    action: 'created campaign',
    campaign: newCampaign.title,
  });
  
  return newCampaign;
}

export function getCampaignById(id: string): Campaign | undefined {
  return getCampaigns().find(c => c.id === id);
}

export function getGroups(): Group[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('amanah_groups');
    if (!stored) {
      localStorage.setItem('amanah_groups', JSON.stringify(defaultGroups));
      return defaultGroups;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading groups:', error);
    return defaultGroups;
  }
}

export function addGroup(group: Omit<Group, 'id' | 'members' | 'memberList'>, invites?: string[], creatorName?: string): Group {
  const groups = getGroups();
  
  // Create member list with creator and invites
  const memberList: GroupMember[] = [
    {
      id: '1',
      name: creatorName || 'You',
      contact: 'creator',
      role: 'admin',
      status: 'active',
      joinedDate: new Date().toISOString(),
    }
  ];
  
  // Add invited members
  if (invites && invites.length > 0) {
    invites.forEach((contact, index) => {
      memberList.push({
        id: (index + 2).toString(),
        name: `Invited Member`,
        contact: contact,
        role: 'member',
        status: 'invited',
        joinedDate: new Date().toISOString(),
      });
    });
  }
  
  const newGroup: Group = {
    ...group,
    id: Date.now().toString(),
    members: memberList.length,
    memberList: memberList,
  };
  
  groups.unshift(newGroup);
  localStorage.setItem('amanah_groups', JSON.stringify(groups));
  
  // Add activity
  addActivity({
    type: 'group_created',
    user: 'You',
    action: 'created group',
    campaign: newGroup.name,
  });
  
  return newGroup;
}

export function getGroupById(id: string): Group | undefined {
  return getGroups().find(g => g.id === id);
}

// Add members to a group
export function addMembersToGroup(groupId: string, invites: string[]): boolean {
  const groups = getGroups();
  const groupIndex = groups.findIndex(g => g.id === groupId);
  
  if (groupIndex === -1) return false;
  
  const group = groups[groupIndex];
  
  // Initialize memberList if it doesn't exist
  if (!group.memberList) {
    group.memberList = [{
      id: '1',
      name: 'You',
      contact: 'creator',
      role: 'admin',
      status: 'active',
      joinedDate: new Date().toISOString(),
    }];
  }
  
  // Get next member ID
  const nextId = Math.max(...group.memberList.map(m => parseInt(m.id)), 0) + 1;
  
  // Add new members
  invites.forEach((contact, index) => {
    group.memberList!.push({
      id: (nextId + index).toString(),
      name: 'Invited Member',
      contact: contact,
      role: 'member',
      status: 'invited',
      joinedDate: new Date().toISOString(),
    });
  });
  
  group.members = group.memberList.length;
  groups[groupIndex] = group;
  localStorage.setItem('amanah_groups', JSON.stringify(groups));
  
  return true;
}

// Remove member from group
export function removeMemberFromGroup(groupId: string, memberId: string): boolean {
  const groups = getGroups();
  const groupIndex = groups.findIndex(g => g.id === groupId);
  
  if (groupIndex === -1) return false;
  
  const group = groups[groupIndex];
  
  if (!group.memberList) return false;
  
  // Don't allow removing the admin
  const member = group.memberList.find(m => m.id === memberId);
  if (member?.role === 'admin') return false;
  
  // Remove member
  group.memberList = group.memberList.filter(m => m.id !== memberId);
  group.members = group.memberList.length;
  
  groups[groupIndex] = group;
  localStorage.setItem('amanah_groups', JSON.stringify(groups));
  
  return true;
}

// Update group details
export function updateGroup(groupId: string, updates: { name?: string; description?: string }): boolean {
  const groups = getGroups();
  const groupIndex = groups.findIndex(g => g.id === groupId);
  
  if (groupIndex === -1) return false;
  
  const group = groups[groupIndex];
  
  if (updates.name) group.name = updates.name;
  if (updates.description !== undefined) group.description = updates.description;
  
  groups[groupIndex] = group;
  localStorage.setItem('amanah_groups', JSON.stringify(groups));
  
  return true;
}

// Delete campaign
export function deleteCampaign(campaignId: string): boolean {
  const campaigns = getCampaigns();
  const filteredCampaigns = campaigns.filter(c => c.id !== campaignId);
  
  if (filteredCampaigns.length === campaigns.length) return false;
  
  localStorage.setItem('amanah_campaigns', JSON.stringify(filteredCampaigns));
  return true;
}

// Delete group
export function deleteGroup(groupId: string): boolean {
  const groups = getGroups();
  const filteredGroups = groups.filter(g => g.id !== groupId);
  
  if (filteredGroups.length === groups.length) return false;
  
  // Also delete all campaigns in this group
  const campaigns = getCampaigns();
  const filteredCampaigns = campaigns.filter(c => c.groupId !== groupId);
  localStorage.setItem('amanah_campaigns', JSON.stringify(filteredCampaigns));
  
  localStorage.setItem('amanah_groups', JSON.stringify(filteredGroups));
  return true;
}

// Vote for campaign
export function voteForCampaign(campaignId: string, userId: string): { success: boolean; message: string } {
  const campaigns = getCampaigns();
  const campaignIndex = campaigns.findIndex(c => c.id === campaignId);
  
  if (campaignIndex === -1) {
    return { success: false, message: 'Campaign not found' };
  }
  
  const campaign = campaigns[campaignIndex];
  
  // Check if user already voted
  if (campaign.votedBy.includes(userId)) {
    return { success: false, message: 'You have already voted for this campaign' };
  }
  
  // Add vote
  campaign.votes += 1;
  campaign.votedBy.push(userId);
  
  // Activate campaign if it reaches minimum votes (3 votes)
  const MINIMUM_VOTES = 3;
  if (campaign.status === 'pending' && campaign.votes >= MINIMUM_VOTES) {
    campaign.status = 'active';
  }
  
  campaigns[campaignIndex] = campaign;
  localStorage.setItem('amanah_campaigns', JSON.stringify(campaigns));
  
  const statusMessage = campaign.status === 'active' && campaign.votes === MINIMUM_VOTES
    ? 'Vote recorded! Campaign is now active and can receive contributions.'
    : 'Vote recorded successfully';
  
  return { success: true, message: statusMessage };
}

// Remove vote from campaign
export function removeVoteFromCampaign(campaignId: string, userId: string): { success: boolean; message: string } {
  const campaigns = getCampaigns();
  const campaignIndex = campaigns.findIndex(c => c.id === campaignId);
  
  if (campaignIndex === -1) {
    return { success: false, message: 'Campaign not found' };
  }
  
  const campaign = campaigns[campaignIndex];
  
  // Check if user has voted
  if (!campaign.votedBy.includes(userId)) {
    return { success: false, message: 'You have not voted for this campaign' };
  }
  
  // Remove vote
  campaign.votes -= 1;
  campaign.votedBy = campaign.votedBy.filter(id => id !== userId);
  
  // Deactivate campaign if votes drop below minimum (3 votes)
  const MINIMUM_VOTES = 3;
  if (campaign.status === 'active' && campaign.votes < MINIMUM_VOTES) {
    campaign.status = 'pending';
  }
  
  campaigns[campaignIndex] = campaign;
  localStorage.setItem('amanah_campaigns', JSON.stringify(campaigns));
  
  const statusMessage = campaign.status === 'pending' && campaign.votes === MINIMUM_VOTES - 1
    ? 'Vote removed. Campaign is now pending and needs more votes to become active.'
    : 'Vote removed successfully';
  
  return { success: true, message: statusMessage };
}

// Activities
export function getActivities(): Activity[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('amanah_activities');
    if (!stored) {
      localStorage.setItem('amanah_activities', JSON.stringify(defaultActivities));
      return defaultActivities;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading activities:', error);
    return defaultActivities;
  }
}

export function addActivity(activity: Omit<Activity, 'id' | 'createdAt'>): Activity {
  const activities = getActivities();
  const newActivity: Activity = {
    ...activity,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  // Add to beginning of array (newest first)
  activities.unshift(newActivity);
  
  // Keep only last 50 activities
  const trimmedActivities = activities.slice(0, 50);
  localStorage.setItem('amanah_activities', JSON.stringify(trimmedActivities));
  return newActivity;
}

export function addContribution(campaignId: string, amount: number, isPrivate: boolean = false): void {
  const campaigns = getCampaigns();
  const campaign = campaigns.find(c => c.id === campaignId);
  
  if (campaign) {
    // Update campaign
    campaign.current += amount;
    campaign.contributors += 1;
    
    // Check if campaign reached or exceeded target
    if (campaign.current >= campaign.target && campaign.status === 'active') {
      campaign.status = 'completed';
    }
    
    localStorage.setItem('amanah_campaigns', JSON.stringify(campaigns));
    
    // Add activity
    addActivity({
      type: 'contribution',
      user: isPrivate ? 'Anonymous' : 'You',
      action: 'contributed',
      campaign: campaign.title,
      amount: amount,
      currency: campaign.currency,
      isPrivate: isPrivate,
    });
  }
}

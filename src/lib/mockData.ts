// Mock data storage using localStorage for demo purposes
// In production, this would be replaced with actual API calls

import { createNotification } from './notifications';
import { getAllUsers } from './auth';
import type { UserRole } from './auth';

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
  createdBy?: string; // User ID of campaign creator
  dueDate?: string;
  votes: number;
  votedBy: string[]; // Array of user IDs who voted
  requiresApproval: boolean; // If true, campaign needs votes to become active
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

export interface AccessRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  groupId: string;
  groupName: string;
  campaignId?: string;
  campaignTitle?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  respondedAt?: string;
  respondedBy?: string;
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

export interface InviteCode {
  id: string;
  code: string;
  createdBy: string;
  createdAt: string;
  usedBy?: string;
  usedAt?: string;
  expiresAt?: string;
  isActive: boolean;
  groupId?: string; // Optional: if set, user will be added to this group automatically
  groupName?: string; // For display purposes
  assignedRole?: 'admin' | 'contributor' | 'member' | 'viewer'; // Role to assign to user who uses this invite
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
    requiresApproval: true,
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
    requiresApproval: true,
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
    requiresApproval: false,
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
    const stored = localStorage.getItem('sanad_campaigns');
    if (!stored) {
      localStorage.setItem('sanad_campaigns', JSON.stringify(defaultCampaigns));
      return defaultCampaigns;
    }
    
    // Parse and migrate old campaigns
    const campaigns = JSON.parse(stored);
    const migratedCampaigns = campaigns.map((c: any) => ({
      ...c,
      votes: c.votes || 0,
      votedBy: c.votedBy || [],
      requiresApproval: c.requiresApproval !== undefined ? c.requiresApproval : true, // Default to true for old campaigns
    }));
    
    // Save migrated data
    localStorage.setItem('sanad_campaigns', JSON.stringify(migratedCampaigns));
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
    // If requiresApproval is true, start as pending. Otherwise, start as active
    status: campaign.requiresApproval ? 'pending' : 'active',
  };
  
  // Add to beginning of array (newest first)
  campaigns.unshift(newCampaign);
  localStorage.setItem('sanad_campaigns', JSON.stringify(campaigns));
  
  // Add activity
  addActivity({
    type: 'campaign_created',
    user: 'You',
    action: 'created campaign',
    campaign: newCampaign.title,
  });
  
  // Create notifications for all group members
  try {
    const group = getGroupById(newCampaign.groupId);
    if (group && group.memberList) {
      group.memberList.forEach(member => {
        // Don't notify the creator (if createdBy is set)
        if (newCampaign.createdBy && member.id === newCampaign.createdBy) return;
        
        // Only notify active members (not invited)
        if (member.status === 'invited') return;
        
        createNotification(
          member.id,
          'campaign_created',
          'notifCampaignCreated',
          {
            campaignTitle: newCampaign.title,
            groupName: newCampaign.groupName,
          },
          newCampaign.id,
          'campaign'
        );
      });
    }
  } catch (error) {
    console.error('Error creating campaign notifications:', error);
  }
  
  return newCampaign;
}

export function getCampaignById(id: string): Campaign | undefined {
  return getCampaigns().find(c => c.id === id);
}

export function getGroups(): Group[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('sanad_groups');
    if (!stored) {
      localStorage.setItem('sanad_groups', JSON.stringify(defaultGroups));
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
  localStorage.setItem('sanad_groups', JSON.stringify(groups));
  
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
  localStorage.setItem('sanad_groups', JSON.stringify(groups));
  
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
  localStorage.setItem('sanad_groups', JSON.stringify(groups));
  
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
  localStorage.setItem('sanad_groups', JSON.stringify(groups));
  
  return true;
}

// Delete campaign
export function deleteCampaign(campaignId: string): boolean {
  const campaigns = getCampaigns();
  const campaign = campaigns.find(c => c.id === campaignId);
  const filteredCampaigns = campaigns.filter(c => c.id !== campaignId);
  
  if (filteredCampaigns.length === campaigns.length) return false;
  
  localStorage.setItem('sanad_campaigns', JSON.stringify(filteredCampaigns));
  
  // Create notifications for contributors
  if (campaign) {
    try {
      const group = getGroupById(campaign.groupId);
      if (group && group.memberList && campaign.contributors > 0) {
        group.memberList.forEach(member => {
          if (member.status === 'invited') return;
          
          createNotification(
            member.id,
            'campaign_deleted',
            'notifCampaignDeleted',
            {
              campaignTitle: campaign.title,
            },
            campaign.id,
            'campaign'
          );
        });
      }
    } catch (error) {
      console.error('Error creating campaign deletion notifications:', error);
    }
  }
  
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
  localStorage.setItem('sanad_campaigns', JSON.stringify(filteredCampaigns));
  
  localStorage.setItem('sanad_groups', JSON.stringify(filteredGroups));
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
  
  // Check if campaign requires approval
  if (!campaign.requiresApproval) {
    return { success: false, message: 'This campaign does not require voting' };
  }
  
  // Check if user already voted
  if (campaign.votedBy.includes(userId)) {
    return { success: false, message: 'You have already voted for this campaign' };
  }
  
  // Add vote
  campaign.votes += 1;
  campaign.votedBy.push(userId);
  
  // Activate campaign if it reaches minimum votes (3 votes)
  const MINIMUM_VOTES = 3;
  const wasActivated = campaign.status === 'pending' && campaign.votes >= MINIMUM_VOTES;
  if (wasActivated) {
    campaign.status = 'active';
  }
  
  campaigns[campaignIndex] = campaign;
  localStorage.setItem('sanad_campaigns', JSON.stringify(campaigns));
  
    // Create notifications
  try {
    const users = getAllUsers();
    const voter = users.find(u => u.id === userId);
    const creator = campaign.createdBy ? users.find(u => u.id === campaign.createdBy) : null;
    
    // Notify campaign creator about the vote
    if (creator && creator.id !== userId) {
      createNotification(
        creator.id,
        'campaign_vote',
        'notifCampaignVote',
        {
          userName: voter?.name || 'Someone',
          campaignTitle: campaign.title,
        },
        campaign.id,
        'campaign'
      );
    }
    
    // If campaign was activated, notify all group members
    if (wasActivated) {
      const group = getGroupById(campaign.groupId);
      if (group && group.memberList) {
        group.memberList.forEach(member => {
          if (member.status === 'invited') return;
          
          createNotification(
            member.id,
            'campaign_activated',
            'notifCampaignActivated',
            {
              campaignTitle: campaign.title,
            },
            campaign.id,
            'campaign'
          );
        });
      }
    }
  } catch (error) {
    console.error('Error creating vote notifications:', error);
  }
  
  const statusMessage = wasActivated
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
  
  // Check if campaign requires approval
  if (!campaign.requiresApproval) {
    return { success: false, message: 'This campaign does not require voting' };
  }
  
  // Check if user has voted
  if (!campaign.votedBy.includes(userId)) {
    return { success: false, message: 'You have not voted for this campaign' };
  }
  
  // Remove vote
  campaign.votes -= 1;
  campaign.votedBy = campaign.votedBy.filter(id => id !== userId);
  
  // Deactivate campaign if votes drop below minimum (3 votes)
  const MINIMUM_VOTES = 3;
  if (campaign.status === 'active' && campaign.votes < MINIMUM_VOTES && campaign.requiresApproval) {
    campaign.status = 'pending';
  }
  
  campaigns[campaignIndex] = campaign;
  localStorage.setItem('sanad_campaigns', JSON.stringify(campaigns));
  
  const statusMessage = campaign.status === 'pending' && campaign.votes === MINIMUM_VOTES - 1
    ? 'Vote removed. Campaign is now pending and needs more votes to become active.'
    : 'Vote removed successfully';
  
  return { success: true, message: statusMessage };
}

// Activities
export function getActivities(): Activity[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('sanad_activities');
    if (!stored) {
      localStorage.setItem('sanad_activities', JSON.stringify(defaultActivities));
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
  localStorage.setItem('sanad_activities', JSON.stringify(trimmedActivities));
  return newActivity;
}

export function addContribution(campaignId: string, amount: number, userId: string, isPrivate: boolean = false): void {
  const campaigns = getCampaigns();
  const campaign = campaigns.find(c => c.id === campaignId);
  
  if (campaign) {
    const previousAmount = campaign.current;
    
    // Update campaign
    campaign.current += amount;
    campaign.contributors += 1;
    
    // Check if campaign reached or exceeded target
    const goalReached = previousAmount < campaign.target && campaign.current >= campaign.target;
    if (goalReached && campaign.status === 'active') {
      campaign.status = 'completed';
    }
    
    localStorage.setItem('sanad_campaigns', JSON.stringify(campaigns));
    
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
    
    // Create notifications
    try {
      const users = getAllUsers();
      const creator = campaign.createdBy ? users.find(u => u.id === campaign.createdBy) : null;
      const contributor = users.find(u => u.id === userId);
      
      // Notify campaign creator about contribution (but not if creator contributed to their own campaign)
      if (creator && creator.id !== userId) {
        const contributorName = isPrivate ? 'Anonymous' : (contributor?.name || 'Someone');
        createNotification(
          creator.id,
          'contribution_received',
          isPrivate ? 'notifContributionAnonymous' : 'notifContributionReceived',
          {
            userName: contributorName,
            amount: `${campaign.currency} ${amount}`,
          },
          campaign.id,
          'campaign'
        );
      }
      
      // If goal was reached, notify all group members
      if (goalReached) {
        const group = getGroupById(campaign.groupId);
        if (group && group.memberList) {
          group.memberList.forEach(member => {
            if (member.status === 'invited') return;
            
            createNotification(
              member.id,
              'campaign_goal_reached',
              'notifCampaignGoalReached',
              {
                campaignTitle: campaign.title,
              },
              campaign.id,
              'campaign'
            );
          });
        }
      }
    } catch (error) {
      console.error('Error creating contribution notifications:', error);
    }
  }
}

// Invite Codes Management
const defaultInviteCodes: InviteCode[] = [
  {
    id: '1',
    code: 'FAMILY2024',
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
];

export function getInviteCodes(): InviteCode[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('sanad_invite_codes');
    if (!stored) {
      localStorage.setItem('sanad_invite_codes', JSON.stringify(defaultInviteCodes));
      return defaultInviteCodes;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading invite codes:', error);
    return defaultInviteCodes;
  }
}

export function validateInviteCode(code: string): { valid: boolean; message: string } {
  const inviteCodes = getInviteCodes();
  const invite = inviteCodes.find(i => i.code.toUpperCase() === code.toUpperCase());
  
  if (!invite) {
    return { valid: false, message: 'Invalid invite code' };
  }
  
  if (!invite.isActive) {
    return { valid: false, message: 'This invite code has been deactivated' };
  }
  
  if (invite.usedBy) {
    return { valid: false, message: 'This invite code has already been used' };
  }
  
  if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
    return { valid: false, message: 'This invite code has expired' };
  }
  
  return { valid: true, message: 'Valid invite code' };
}

export function useInviteCode(code: string, userId: string): boolean {
  const inviteCodes = getInviteCodes();
  const inviteIndex = inviteCodes.findIndex(i => i.code.toUpperCase() === code.toUpperCase());
  
  if (inviteIndex === -1) return false;
  
  const invite = inviteCodes[inviteIndex];
  invite.usedBy = userId;
  invite.usedAt = new Date().toISOString();
  
  inviteCodes[inviteIndex] = invite;
  localStorage.setItem('sanad_invite_codes', JSON.stringify(inviteCodes));
  
  return true;
}

export function createInviteCode(
  createdBy: string, 
  expiresInDays?: number, 
  userRole?: string,
  groupId?: string,
  groupName?: string,
  assignedRole?: 'contributor' | 'member' | 'viewer'
): InviteCode | null {
  const inviteCodes = getInviteCodes();
  
  // Check invite limit based on role
  const maxInvites = getMaxInvites(userRole);
  
  if (maxInvites === 0) {
    return null; // Viewers cannot create invites
  }
  
  if (maxInvites !== Infinity) {
    const userActiveInvites = inviteCodes.filter(
      invite => invite.createdBy === createdBy && 
                invite.isActive && 
                !invite.usedBy
    );
    
    if (userActiveInvites.length >= maxInvites) {
      return null; // Limit reached
    }
  }
  
  // Validate assignedRole - only contributor, member, or viewer allowed (not admin)
  let validatedRole: 'contributor' | 'member' | 'viewer' = 'member'; // Default to member
  if (assignedRole) {
    const allowedRoles: Array<'contributor' | 'member' | 'viewer'> = ['contributor', 'member', 'viewer'];
    if (allowedRoles.includes(assignedRole)) {
      validatedRole = assignedRole;
    }
  }
  
  // Generate random code
  const code = 'FAM-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const newInvite: InviteCode = {
    id: Date.now().toString(),
    code: code,
    createdBy: createdBy,
    createdAt: new Date().toISOString(),
    isActive: true,
    assignedRole: validatedRole, // Store the validated role
  };
  
  // Add group info if provided
  if (groupId) {
    newInvite.groupId = groupId;
    newInvite.groupName = groupName;
  }
  
  if (expiresInDays) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiresInDays);
    newInvite.expiresAt = expiryDate.toISOString();
  }
  
  inviteCodes.push(newInvite);
  localStorage.setItem('sanad_invite_codes', JSON.stringify(inviteCodes));
  
  return newInvite;
}

// Get active invite count for a user
export function getActiveInviteCount(createdBy: string): number {
  const inviteCodes = getInviteCodes();
  return inviteCodes.filter(
    invite => invite.createdBy === createdBy && 
              invite.isActive && 
              !invite.usedBy
  ).length;
}

// Get max invites allowed based on role
export function getMaxInvites(userRole?: string): number {
  switch (userRole) {
    case 'admin':
      return Infinity;
    case 'contributor':
      return 5;
    case 'member':
      return 3;
    case 'viewer':
      return 0;
    default:
      return 3; // Default to member
  }
}

export function deactivateInviteCode(code: string): boolean {
  const inviteCodes = getInviteCodes();
  const inviteIndex = inviteCodes.findIndex(i => i.code.toUpperCase() === code.toUpperCase());
  
  if (inviteIndex === -1) return false;
  
  inviteCodes[inviteIndex].isActive = false;
  localStorage.setItem('sanad_invite_codes', JSON.stringify(inviteCodes));
  
  return true;
}

// Add user to group (used when registering with group-specific invite)
export function addUserToGroup(groupId: string, userId: string, userName: string, userEmail: string): boolean {
  const groups = getGroups();
  const groupIndex = groups.findIndex(g => g.id === groupId);
  
  if (groupIndex === -1) return false;
  
  const group = groups[groupIndex];
  
  // Initialize memberList if it doesn't exist
  if (!group.memberList) {
    group.memberList = [];
  }
  
  // Check if user is already in the group
  if (group.memberList.some(m => m.contact === userEmail)) {
    return true; // Already a member
  }
  
  // Get next member ID
  const nextId = group.memberList.length > 0 
    ? Math.max(...group.memberList.map(m => parseInt(m.id)), 0) + 1 
    : 1;
  
  // Add user to group
  group.memberList.push({
    id: nextId.toString(),
    name: userName,
    contact: userEmail,
    role: 'member',
    status: 'active',
    joinedDate: new Date().toISOString(),
  });
  
  group.members = group.memberList.length;
  groups[groupIndex] = group;
  localStorage.setItem('sanad_groups', JSON.stringify(groups));
  
  return true;
}

// Get invite code with group info
export function getInviteCodeByCode(code: string): InviteCode | null {
  const inviteCodes = getInviteCodes();
  return inviteCodes.find(i => i.code.toUpperCase() === code.toUpperCase()) || null;
}


// Access Request Management
export function getAccessRequests(): AccessRequest[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('sanad_access_requests');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading access requests:', error);
    return [];
  }
}

export function createAccessRequest(
  userId: string,
  userName: string,
  userEmail: string,
  groupId: string,
  groupName: string,
  campaignId?: string,
  campaignTitle?: string
): AccessRequest {
  const requests = getAccessRequests();
  
  // Check if there's already a pending request for this user and group
  const existingRequest = requests.find(
    r => r.userId === userId && r.groupId === groupId && r.status === 'pending'
  );
  
  if (existingRequest) {
    return existingRequest;
  }
  
  const newRequest: AccessRequest = {
    id: Date.now().toString(),
    userId,
    userName,
    userEmail,
    groupId,
    groupName,
    campaignId,
    campaignTitle,
    status: 'pending',
    requestedAt: new Date().toISOString(),
  };
  
  requests.unshift(newRequest);
  localStorage.setItem('sanad_access_requests', JSON.stringify(requests));
  
  // Notify all group admins
  try {
    const group = getGroupById(groupId);
    if (group && group.memberList) {
      const admins = group.memberList.filter(m => m.role === 'admin' && m.status === 'active');
      admins.forEach(admin => {
        createNotification(
          admin.id,
          'group_invited',
          'notifAccessRequest',
          {
            userName,
            groupName,
            campaignTitle: campaignTitle || '',
          },
          groupId,
          'group'
        );
      });
    }
  } catch (error) {
    console.error('Error creating access request notifications:', error);
  }
  
  return newRequest;
}

export function getAccessRequestsByGroup(groupId: string): AccessRequest[] {
  const requests = getAccessRequests();
  return requests.filter(r => r.groupId === groupId);
}

export function getAccessRequestsByUser(userId: string): AccessRequest[] {
  const requests = getAccessRequests();
  return requests.filter(r => r.userId === userId);
}

export function getPendingAccessRequestsForAdmin(adminUserId: string): AccessRequest[] {
  const requests = getAccessRequests();
  const groups = getGroups();
  
  // Get all groups where user is admin
  const adminGroups = groups.filter(g => 
    g.memberList?.some(m => m.id === adminUserId && m.role === 'admin' && m.status === 'active')
  );
  
  const adminGroupIds = adminGroups.map(g => g.id);
  
  // Return pending requests for those groups
  return requests.filter(r => 
    r.status === 'pending' && adminGroupIds.includes(r.groupId)
  );
}

export function approveAccessRequest(requestId: string, adminUserId: string): boolean {
  const requests = getAccessRequests();
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) return false;
  
  const request = requests[requestIndex];
  
  // Update request status
  request.status = 'approved';
  request.respondedAt = new Date().toISOString();
  request.respondedBy = adminUserId;
  
  localStorage.setItem('sanad_access_requests', JSON.stringify(requests));
  
  // Add user to group as member
  const success = addUserToGroup(
    request.groupId,
    request.userId,
    request.userName,
    request.userEmail
  );
  
  if (success) {
    // Notify the user
    createNotification(
      request.userId,
      'group_invited',
      'notifAccessRequestApproved',
      {
        groupName: request.groupName,
      },
      request.groupId,
      'group'
    );
  }
  
  return success;
}

export function rejectAccessRequest(requestId: string, adminUserId: string): boolean {
  const requests = getAccessRequests();
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) return false;
  
  const request = requests[requestIndex];
  
  // Update request status
  request.status = 'rejected';
  request.respondedAt = new Date().toISOString();
  request.respondedBy = adminUserId;
  
  localStorage.setItem('sanad_access_requests', JSON.stringify(requests));
  
  // Notify the user
  createNotification(
    request.userId,
    'group_invited',
    'notifAccessRequestRejected',
    {
      groupName: request.groupName,
    },
    request.groupId,
    'group'
  );
  
  return true;
}


// Group-based filtering functions for privacy and security
// Non-admin users should only see groups they are members of and campaigns from those groups

/**
 * Get user's group IDs (groups where user is a member)
 * @param userId - The user ID to check
 * @returns Array of group IDs the user belongs to
 */
export function getUserGroupIds(userId: string): string[] {
  const groups = getGroups();
  const userGroups: string[] = [];
  
  groups.forEach(group => {
    if (group.memberList) {
      const isMember = group.memberList.some(
        member => member.id === userId && member.status === 'active'
      );
      if (isMember) {
        userGroups.push(group.id);
      }
    }
  });
  
  return userGroups;
}

/**
 * Get campaigns filtered by user's group membership
 * Admin sees all campaigns, others only see campaigns from their groups
 * @param userId - The user ID
 * @param userRole - The user's role
 * @returns Filtered campaigns array
 */
export function getCampaignsForUser(userId: string, userRole: UserRole): Campaign[] {
  const allCampaigns = getCampaigns();
  
  // Admin sees everything
  if (userRole === 'admin') {
    return allCampaigns;
  }
  
  // Get user's groups
  const userGroupIds = getUserGroupIds(userId);
  
  // Filter campaigns to only those from user's groups
  return allCampaigns.filter(campaign => userGroupIds.includes(campaign.groupId));
}

/**
 * Get groups filtered by user's membership
 * Admin sees all groups, others only see groups they belong to
 * @param userId - The user ID
 * @param userRole - The user's role
 * @returns Filtered groups array
 */
export function getGroupsForUser(userId: string, userRole: UserRole): Group[] {
  const allGroups = getGroups();
  
  // Admin sees everything
  if (userRole === 'admin') {
    return allGroups;
  }
  
  // Get user's groups
  const userGroupIds = getUserGroupIds(userId);
  
  // Filter to only user's groups
  return allGroups.filter(group => userGroupIds.includes(group.id));
}

/**
 * Get activities filtered by user's group membership
 * Admin sees all activities, others only see activities from their groups
 * @param userId - The user ID
 * @param userRole - The user's role
 * @returns Filtered activities array
 */
export function getActivitiesForUser(userId: string, userRole: UserRole): Activity[] {
  const allActivities = getActivities();
  
  // Admin sees everything
  if (userRole === 'admin') {
    return allActivities;
  }
  
  // Get user's campaigns (from their groups)
  const userCampaigns = getCampaignsForUser(userId, userRole);
  const userCampaignTitles = userCampaigns.map(c => c.title);
  
  // Filter activities to only those related to user's campaigns
  return allActivities.filter(activity => {
    if (!activity.campaign) return false;
    return userCampaignTitles.includes(activity.campaign);
  });
}

/**
 * Check if user has access to a specific campaign
 * @param userId - The user ID
 * @param userRole - The user's role
 * @param campaignId - The campaign ID to check
 * @returns true if user can access the campaign
 */
export function canUserAccessCampaign(userId: string, userRole: UserRole, campaignId: string): boolean {
  // Admin can access everything
  if (userRole === 'admin') {
    return true;
  }
  
  const campaign = getCampaignById(campaignId);
  if (!campaign) return false;
  
  const userGroupIds = getUserGroupIds(userId);
  return userGroupIds.includes(campaign.groupId);
}

/**
 * Check if user has access to a specific group
 * @param userId - The user ID
 * @param userRole - The user's role
 * @param groupId - The group ID to check
 * @returns true if user can access the group
 */
export function canUserAccessGroup(userId: string, userRole: UserRole, groupId: string): boolean {
  // Admin can access everything
  if (userRole === 'admin') {
    return true;
  }
  
  const userGroupIds = getUserGroupIds(userId);
  return userGroupIds.includes(groupId);
}

// Permission system for role-based access control

import { UserRole } from './auth';

export interface Permissions {
  // Campaign permissions
  canCreateCampaign: boolean;
  canEditOwnCampaign: boolean;
  canEditAnyCampaign: boolean;
  canDeleteOwnCampaign: boolean;
  canDeleteAnyCampaign: boolean;
  canVoteOnCampaign: boolean;
  
  // Contribution permissions
  canContribute: boolean;
  canSeePrivateContributions: boolean;
  
  // Group permissions
  canCreateGroup: boolean;
  canEditOwnGroup: boolean;
  canEditAnyGroup: boolean;
  canDeleteOwnGroup: boolean;
  canDeleteAnyGroup: boolean;
  canInviteToGroup: boolean;
  canRemoveFromGroup: boolean;
  
  // Invite permissions
  canCreateInvites: boolean;
  maxInvites: number;
  
  // User management permissions
  canManageUsers: boolean;
  canChangeUserRoles: boolean;
  
  // View permissions
  canViewCampaigns: boolean;
  canViewGroups: boolean;
  canViewStatistics: boolean;
}

// Get permissions for a specific role
export function getPermissions(role: UserRole): Permissions {
  switch (role) {
    case 'admin':
      return {
        // Campaign permissions
        canCreateCampaign: true,
        canEditOwnCampaign: true,
        canEditAnyCampaign: true,
        canDeleteOwnCampaign: true,
        canDeleteAnyCampaign: true,
        canVoteOnCampaign: true,
        
        // Contribution permissions
        canContribute: true,
        canSeePrivateContributions: true,
        
        // Group permissions
        canCreateGroup: true,
        canEditOwnGroup: true,
        canEditAnyGroup: true,
        canDeleteOwnGroup: true,
        canDeleteAnyGroup: true,
        canInviteToGroup: true,
        canRemoveFromGroup: true,
        
        // Invite permissions
        canCreateInvites: true,
        maxInvites: Infinity,
        
        // User management permissions
        canManageUsers: true,
        canChangeUserRoles: true,
        
        // View permissions
        canViewCampaigns: true,
        canViewGroups: true,
        canViewStatistics: true,
      };
      
    case 'contributor':
      return {
        // Campaign permissions
        canCreateCampaign: true,
        canEditOwnCampaign: true,
        canEditAnyCampaign: false,
        canDeleteOwnCampaign: true,
        canDeleteAnyCampaign: false,
        canVoteOnCampaign: true,
        
        // Contribution permissions
        canContribute: true,
        canSeePrivateContributions: false,
        
        // Group permissions
        canCreateGroup: false,
        canEditOwnGroup: false,
        canEditAnyGroup: false,
        canDeleteOwnGroup: false,
        canDeleteAnyGroup: false,
        canInviteToGroup: false,
        canRemoveFromGroup: false,
        
        // Invite permissions
        canCreateInvites: true,
        maxInvites: 5,
        
        // User management permissions
        canManageUsers: false,
        canChangeUserRoles: false,
        
        // View permissions
        canViewCampaigns: true,
        canViewGroups: true,
        canViewStatistics: true,
      };
      
    case 'member':
      return {
        // Campaign permissions
        canCreateCampaign: false,
        canEditOwnCampaign: false,
        canEditAnyCampaign: false,
        canDeleteOwnCampaign: false,
        canDeleteAnyCampaign: false,
        canVoteOnCampaign: true,
        
        // Contribution permissions
        canContribute: true,
        canSeePrivateContributions: false,
        
        // Group permissions
        canCreateGroup: false,
        canEditOwnGroup: false,
        canEditAnyGroup: false,
        canDeleteOwnGroup: false,
        canDeleteAnyGroup: false,
        canInviteToGroup: false,
        canRemoveFromGroup: false,
        
        // Invite permissions
        canCreateInvites: true,
        maxInvites: 3,
        
        // User management permissions
        canManageUsers: false,
        canChangeUserRoles: false,
        
        // View permissions
        canViewCampaigns: true,
        canViewGroups: true,
        canViewStatistics: true,
      };
      
    case 'viewer':
      return {
        // Campaign permissions
        canCreateCampaign: false,
        canEditOwnCampaign: false,
        canEditAnyCampaign: false,
        canDeleteOwnCampaign: false,
        canDeleteAnyCampaign: false,
        canVoteOnCampaign: false,
        
        // Contribution permissions
        canContribute: false,
        canSeePrivateContributions: false,
        
        // Group permissions
        canCreateGroup: false,
        canEditOwnGroup: false,
        canEditAnyGroup: false,
        canDeleteOwnGroup: false,
        canDeleteAnyGroup: false,
        canInviteToGroup: false,
        canRemoveFromGroup: false,
        
        // Invite permissions
        canCreateInvites: false,
        maxInvites: 0,
        
        // User management permissions
        canManageUsers: false,
        canChangeUserRoles: false,
        
        // View permissions
        canViewCampaigns: true,
        canViewGroups: true,
        canViewStatistics: true,
      };
      
    default:
      // Default to member permissions
      return getPermissions('member');
  }
}

// Helper functions for common permission checks
export function canUserCreateCampaign(role: UserRole): boolean {
  return getPermissions(role).canCreateCampaign;
}

export function canUserContribute(role: UserRole): boolean {
  return getPermissions(role).canContribute;
}

export function canUserVote(role: UserRole): boolean {
  return getPermissions(role).canVoteOnCampaign;
}

export function canUserCreateGroup(role: UserRole): boolean {
  return getPermissions(role).canCreateGroup;
}

export function canUserManageUsers(role: UserRole): boolean {
  return getPermissions(role).canManageUsers;
}

// Get role display name
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'contributor':
      return 'Contributor';
    case 'member':
      return 'Member';
    case 'viewer':
      return 'Viewer';
    default:
      return 'Member';
  }
}

// Get role description
export function getRoleDescription(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'Full access to all features and user management';
    case 'contributor':
      return 'Can create campaigns, vote, and contribute';
    case 'member':
      return 'Can vote and contribute to campaigns';
    case 'viewer':
      return 'Can only view campaigns and statistics';
    default:
      return 'Basic member access';
  }
}

// Get role color for UI
export function getRoleColor(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'warm-600'; // Gold/orange for admin
    case 'contributor':
      return 'primary-600'; // Orange for contributor
    case 'member':
      return 'gray-600'; // Gray for member
    case 'viewer':
      return 'gray-400'; // Light gray for viewer
    default:
      return 'gray-600';
  }
}

// Get role icon
export function getRoleIcon(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '👑';
    case 'contributor':
      return '✨';
    case 'member':
      return '👤';
    case 'viewer':
      return '👁️';
    default:
      return '👤';
  }
}

// Get max invites allowed based on role
export function getMaxInvites(role: UserRole): number {
  return getPermissions(role).maxInvites;
}

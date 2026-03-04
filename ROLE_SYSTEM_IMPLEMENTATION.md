# 4-Role Permission System Implementation

## Overview
Implemented a complete role-based access control system with 4 distinct roles: Admin, Contributor, Member, and Viewer.

## Roles and Permissions

### 👑 Admin
- **Invite Limit**: Unlimited
- **Permissions**: Full access to all features
  - Create/edit/delete any campaign
  - Create/edit/delete any group
  - Vote and contribute
  - Manage users and change roles
  - See all statistics

### ✨ Contributor
- **Invite Limit**: 5 active invites
- **Permissions**: Can create campaigns and participate
  - Create/edit/delete own campaigns
  - Vote and contribute
  - View all campaigns and groups
  - Cannot create groups
  - Cannot manage users

### 👤 Member
- **Invite Limit**: 3 active invites
- **Permissions**: Can participate but not create
  - Vote and contribute
  - View all campaigns and groups
  - Cannot create campaigns or groups
  - Cannot manage users

### 👁️ Viewer
- **Invite Limit**: 0 invites
- **Permissions**: Read-only access
  - View campaigns and statistics only
  - Cannot vote, contribute, or create anything
  - Cannot manage users

## Implementation Details

### Files Modified

1. **src/lib/permissions.ts** (NEW)
   - Complete permission system with `Permissions` interface
   - `getPermissions(role)` function for all permission checks
   - Helper functions: `canUserCreateCampaign()`, `canUserContribute()`, `canUserVote()`, `canUserCreateGroup()`, `canUserManageUsers()`
   - UI helpers: `getRoleDisplayName()`, `getRoleDescription()`, `getRoleColor()`, `getRoleIcon()`, `getMaxInvites()`

2. **src/lib/auth.ts**
   - Updated `UserRole` type to include all 4 roles
   - Changed default role for new users to 'contributor'
   - First user still becomes admin automatically

3. **src/lib/mockData.ts**
   - Updated `getMaxInvites()` to use role-based limits
   - Updated `createInviteCode()` to check role-based invite limits

4. **src/lib/i18n.ts**
   - Added translations for all 4 roles in English, Swedish, and Arabic
   - Added permission error messages
   - Translation keys: `roleAdmin`, `roleContributor`, `roleMember`, `roleViewer`
   - Description keys: `roleDescAdmin`, `roleDescContributor`, `roleDescMember`, `roleDescViewer`
   - Error keys: `noPermissionCreateCampaign`, `noPermissionCreateGroup`, `noPermissionContribute`, `noPermissionVote`

5. **src/app/dashboard/users/page.tsx**
   - Complete role management UI with modal
   - Shows all 4 roles with icons, colors, and descriptions
   - Displays invite limits for each role
   - Admin can change any user's role
   - Role selection modal with visual feedback

6. **src/app/dashboard/campaigns/new/page.tsx**
   - Added permission check on page load
   - Redirects to dashboard if user lacks permission
   - Shows error message: "You do not have permission to create campaigns"

7. **src/app/dashboard/groups/new/page.tsx**
   - Added permission check on page load
   - Redirects to dashboard if user lacks permission
   - Shows error message: "You do not have permission to create groups"

8. **src/app/dashboard/contribute/page.tsx**
   - Added permission check on page load
   - Redirects to dashboard if user lacks permission
   - Shows error message: "You do not have permission to contribute"

9. **src/app/dashboard/campaigns/[id]/page.tsx**
   - Added permission checks to voting functions
   - Prevents viewers from voting
   - Shows error message: "You do not have permission to vote"

10. **src/app/dashboard/page.tsx**
    - Quick action buttons now respect permissions
    - "Start Campaign" button only visible to Contributors and Admins
    - "Contribute" button only visible to Members, Contributors, and Admins
    - "Create Group" button only visible to Admins
    - "Manage Invites" visible to all (but limited by role)
    - "User Management" only visible to Admins

## User Experience

### For Admins
- See all quick action buttons
- Can manage all users and change their roles
- Unlimited invite codes
- Full access to all features

### For Contributors
- See "Start Campaign" and "Contribute" buttons
- Can create up to 5 active invite codes
- Can create and manage their own campaigns
- Can vote and contribute to all campaigns

### For Members
- See only "Contribute" button
- Can create up to 3 active invite codes
- Can vote and contribute to campaigns
- Cannot create campaigns or groups

### For Viewers
- No quick action buttons (except view-only features)
- Cannot create invite codes
- Can only view campaigns and statistics
- Cannot vote or contribute

## Testing Checklist

- [x] Admin can change user roles via modal
- [x] Contributors can create campaigns
- [x] Members cannot create campaigns (redirected with error)
- [x] Viewers cannot contribute (redirected with error)
- [x] Viewers cannot vote (error message shown)
- [x] Quick action buttons show/hide based on role
- [x] Invite limits enforced per role
- [x] All translations work in English, Swedish, and Arabic
- [x] Role badges display correctly with icons
- [x] No TypeScript compilation errors

## Default Behavior

- First registered user → Admin
- Subsequent users → Contributor (changed from Member)
- Admins can promote/demote users to any role
- Role changes take effect immediately

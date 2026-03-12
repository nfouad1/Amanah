# Implementation Plan: Enhanced Role Assignment System

## Overview

This implementation plan converts the Enhanced Role Assignment System design into actionable coding tasks. The system extends the existing authentication and permission infrastructure to support role specification in invites, enforce stricter access controls for Viewer role users, and maintain backward compatibility with the first-user-admin pattern.

The implementation uses TypeScript and integrates with the existing localStorage-based data persistence system. Tasks are organized to build incrementally, with early validation through property-based tests using fast-check.

## Tasks

- [x] 1. Set up testing infrastructure and core type definitions
  - Install fast-check library for property-based testing: `npm install --save-dev fast-check @types/fast-check`
  - Update User interface in mockData.ts to include roleAssignedAt and roleAssignedReason fields
  - Update InviteCode interface in mockData.ts to include assignedRole field
  - Create RolePermissions interface and ROLE_PERMISSIONS constant in permissions.ts
  - _Requirements: 10.1, 2.1, 9.1-9.4_

- [-] 2. Implement core role assignment logic
  - [x] 2.1 Enhance register function in auth.ts with role assignment logic
    - Implement determineUserRole function that checks user count, validates invite tokens, and returns appropriate role
    - Add first-user-admin exception (assign Admin if no users exist)
    - Add invite-based role assignment (extract role from valid invite token)
    - Add default role assignment (Viewer for non-invited users)
    - Store roleAssignedAt and roleAssignedReason in user object
    - _Requirements: 1.1, 2.1, 2.2, 2.4, 3.1, 3.2, 8.4_

  - [ ]* 2.2 Write property test for non-invited user role assignment
    - **Property 1: Non-invited users receive Viewer role**
    - **Validates: Requirements 1.1**

  - [ ]* 2.3 Write property test for invited user role assignment
    - **Property 6: Invited users receive specified role**
    - **Property 7: Invited users without role specification receive Member role**
    - **Validates: Requirements 2.1, 2.2**

  - [ ]* 2.4 Write property test for first user admin assignment
    - Test that first user always receives Admin role regardless of invite token
    - **Validates: Requirements 3.1, 3.2**

- [-] 3. Implement invite creation with role selection
  - [x] 3.1 Enhance createInviteCode function in mockData.ts
    - Add assignedRole parameter to function signature
    - Validate that assignedRole is one of: Contributor, Member, or Viewer (not Admin)
    - Store assignedRole in invite token object
    - Default to Member role if no role specified
    - _Requirements: 2.3, 4.5_

  - [x] 3.2 Update invites page UI with role selection dropdown
    - Add role selection dropdown to invite creation modal
    - Include options: Contributor, Member, Viewer
    - Set default selection to Member
    - Display role descriptions showing permissions and invite limits
    - Pass selected role to createInviteCode function
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6_

  - [ ]* 3.3 Write property test for invite role storage
    - **Property 13: Invite role selection stores role with token**
    - **Validates: Requirements 4.5**

- [-] 4. Implement permission validation system
  - [x] 4.1 Create permission check functions in permissions.ts
    - Implement checkCampaignCreationPermission function
    - Implement checkVotingPermission function
    - Implement checkContributionPermission function
    - Implement checkInviteCreationPermission function
    - Each function returns { allowed: boolean, reason?: string, suggestedAction?: string }
    - _Requirements: 1.2, 1.3, 1.4, 5.1, 9.1_

  - [ ]* 4.2 Write property tests for Viewer restrictions
    - **Property 2: Viewer users cannot create campaigns**
    - **Property 3: Viewer users cannot vote on campaigns**
    - **Property 4: Viewer users cannot contribute to campaigns**
    - **Property 19: Viewer users cannot create invites**
    - **Validates: Requirements 1.2, 1.3, 1.4, 9.1**

  - [ ]* 4.3 Write property tests for invite limit enforcement
    - **Property 20: Member invite limit enforced at 3**
    - **Property 21: Contributor invite limit enforced at 5**
    - **Property 22: Admin users have unlimited invites**
    - **Validates: Requirements 9.2, 9.3, 9.4**

- [ ] 5. Checkpoint - Ensure all tests pass
  - Run all property-based tests and unit tests
  - Verify role assignment logic works correctly
  - Ensure all tests pass, ask the user if questions arise

- [ ] 6. Implement UI access restrictions for Viewer role
  - [ ] 6.1 Update dashboard page to hide/disable restricted actions for Viewers
    - Check user role on page load
    - Hide or disable campaign creation button for Viewers
    - Hide or disable invite creation button for Viewers
    - _Requirements: 5.4_

  - [ ] 6.2 Update campaign creation page with access restriction
    - Add permission check at page entry
    - Display AccessRestrictionMessage component if user is Viewer
    - Block access to campaign creation form for Viewers
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ] 6.3 Update contribute page with access restriction
    - Add permission check before contribution form
    - Display AccessRestrictionMessage component if user is Viewer
    - Block contribution functionality for Viewers
    - _Requirements: 1.4, 5.2, 5.3_

  - [ ] 6.4 Update campaign detail page to disable voting for Viewers
    - Add permission check before vote buttons
    - Display AccessRestrictionMessage component if user is Viewer
    - Disable vote buttons for Viewers
    - _Requirements: 1.3, 5.2, 5.3_

  - [ ]* 6.5 Write property test for Viewer UI restrictions
    - **Property 28: Viewer dashboard hides or disables restricted actions**
    - **Validates: Requirements 5.4**

- [ ] 7. Implement multi-language support for role system
  - [ ] 7.1 Add role-related translations to i18n.ts
    - Add role name translations (Admin, Contributor, Member, Viewer) in English, Swedish, Arabic
    - Add role description translations showing permissions and invite limits
    - Add restriction message translations explaining why access is denied
    - Add invite role selection label translations
    - Add "contact admin for upgrade" message translations
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ] 7.2 Update role selection dropdown to use translations
    - Replace hardcoded role names with translation keys
    - Replace hardcoded descriptions with translation keys
    - Ensure dropdown updates when language changes
    - _Requirements: 7.5_

  - [ ] 7.3 Update AccessRestrictionMessage component to use translations
    - Replace hardcoded restriction messages with translation keys
    - Ensure messages update when language changes
    - _Requirements: 7.5_

  - [ ]* 7.4 Write property test for multi-language support
    - **Property 15: Multi-language support for all role text**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

- [ ] 8. Implement invite token validation
  - [ ] 8.1 Add invite validation logic to register function in auth.ts
    - Check if invite token exists in localStorage
    - Check if invite token has expired (compare expiresAt with current date)
    - Check if invite token has been used (check usedBy field)
    - If invalid, treat as non-invited registration (assign Viewer role)
    - If valid, mark token as consumed with user ID and timestamp
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 8.2 Write property test for invite token validation
    - **Property 16: Invite token validation checks existence, expiry, and usage**
    - **Property 17: Invalid invite tokens treated as non-invited**
    - **Property 18: Used invite tokens marked as consumed**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

- [ ] 9. Implement localStorage persistence for role assignments
  - [ ] 9.1 Update register function to persist role data
    - Ensure role, roleAssignedAt, and roleAssignedReason are saved to localStorage
    - Verify data structure matches enhanced User interface
    - _Requirements: 10.1_

  - [ ] 9.2 Update login function to retrieve role from localStorage
    - Load user role from localStorage on login
    - Apply role to user session
    - _Requirements: 10.2_

  - [ ] 9.3 Implement role change functionality for Admin users
    - Add updateUserRole function in auth.ts or mockData.ts
    - Update user role in localStorage
    - Update roleAssignedAt timestamp
    - Set roleAssignedReason to 'admin_changed'
    - _Requirements: 6.1, 6.3, 10.3_

  - [ ]* 9.4 Write property tests for role persistence
    - **Property 24: Role assignments persist in localStorage**
    - **Property 25: Login retrieves role from localStorage**
    - **Property 26: Role data persists across sessions**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4**

- [ ] 10. Checkpoint - Ensure all tests pass
  - Run all property-based tests and unit tests
  - Verify invite token validation works correctly
  - Verify localStorage persistence works correctly
  - Ensure all tests pass, ask the user if questions arise

- [ ] 11. Implement admin role management UI
  - [ ] 11.1 Update users page with role change functionality
    - Add role dropdown for each user (Admin only)
    - Include all role options: Admin, Contributor, Member, Viewer
    - Call updateUserRole function when role is changed
    - Display success message after role change
    - _Requirements: 6.1, 6.2, 6.4_

  - [ ]* 11.2 Write property tests for admin role management
    - **Property 10: Admin role changes update user roles**
    - **Property 11: Admins can assign any role**
    - **Property 12: Role changes immediately apply new permissions**
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [ ] 12. Implement invite limit display and enforcement
  - [ ] 12.1 Add remaining invite count display to invites page
    - Calculate remaining invites: (max invites for role - active invites created)
    - Display count prominently on invites page
    - Update count when new invite is created
    - _Requirements: 9.5_

  - [ ] 12.2 Enforce invite limits in createInviteCode function
    - Count active invites created by user
    - Check against role's max invite limit
    - Return error if limit exceeded
    - Display error message to user
    - _Requirements: 9.2, 9.3, 9.4_

  - [ ]* 12.3 Write property test for invite limit display
    - **Property 23: UI displays remaining invite count**
    - **Validates: Requirements 9.5**

- [ ] 13. Implement AccessRestrictionMessage component
  - [ ] 13.1 Create reusable AccessRestrictionMessage component
    - Accept props: requiredPermission, userRole, language
    - Display user-friendly restriction message
    - Explain why access is denied
    - Suggest contacting admin for role upgrade
    - Support multi-language display
    - _Requirements: 5.2, 5.3_

  - [ ]* 13.2 Write property test for restriction messages
    - **Property 27: Viewer restriction messages explain and suggest upgrade**
    - **Validates: Requirements 5.2, 5.3**

- [ ] 14. Integration and final wiring
  - [ ] 14.1 Wire all components together
    - Ensure register page uses enhanced role assignment logic
    - Ensure invites page uses role selection dropdown
    - Ensure all restricted pages check permissions
    - Ensure all UI elements use translations
    - Verify end-to-end flow from invite creation to registration to permission enforcement
    - _Requirements: All requirements_

  - [ ] 14.2 Update register page to display role assignment feedback
    - Show assigned role after successful registration
    - Display message if registered without invite (Viewer role)
    - Display message if registered with invite (specified role)
    - _Requirements: 1.1, 2.1_

  - [ ]* 14.3 Write integration tests for end-to-end flows
    - Test complete flow: create invite with role → register → verify permissions
    - Test complete flow: register without invite → verify Viewer restrictions
    - Test complete flow: admin changes role → verify new permissions apply
    - **Validates: All requirements**

- [ ] 15. Final checkpoint - Ensure all tests pass
  - Run all property-based tests, unit tests, and integration tests
  - Verify all requirements are met
  - Test in all three languages (English, Swedish, Arabic)
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property-based tests use fast-check library with minimum 100 iterations
- All code examples and implementations use TypeScript
- The system integrates with existing localStorage-based persistence
- Multi-language support covers English, Swedish, and Arabic
- Checkpoints ensure incremental validation at reasonable breaks

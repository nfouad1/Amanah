# Requirements Document

## Introduction

This document specifies requirements for enhancing the role assignment system in the Amanah family crowdfunding application. The current system assigns Contributor role to all new users after the first Admin. The enhanced system will differentiate between invited and non-invited users, allow role specification in invites, and enforce stricter access controls for Viewer role users.

## Glossary

- **Role_Assignment_System**: The component responsible for determining and assigning user roles during registration
- **Invite_System**: The component that manages user invitations and tracks invite metadata
- **Registration_System**: The component that handles new user account creation
- **Permission_Validator**: The component that enforces role-based access controls
- **Admin**: User role with unlimited invites and full system access
- **Contributor**: User role with 5 invites who can create campaigns
- **Member**: User role with 3 invites who can vote and contribute to campaigns
- **Viewer**: User role with 0 invites and read-only access
- **Invite_Token**: Unique identifier used to track and validate user invitations
- **UI_Component**: User interface elements for role selection and display

## Requirements

### Requirement 1: Role Assignment for Non-Invited Users

**User Story:** As a system administrator, I want users who register without an invite to start as Viewers, so that we maintain control over who can actively participate in campaigns.

#### Acceptance Criteria

1. WHEN a user registers without an Invite_Token, THE Role_Assignment_System SHALL assign the Viewer role to that user
2. WHEN a Viewer user attempts to access the campaign creation interface, THE Permission_Validator SHALL deny access
3. WHEN a Viewer user attempts to vote on a campaign, THE Permission_Validator SHALL deny access
4. WHEN a Viewer user attempts to contribute to a campaign, THE Permission_Validator SHALL deny access
5. WHEN a Viewer user views campaign content, THE Registration_System SHALL allow read access

### Requirement 2: Role Assignment for Invited Users

**User Story:** As a user who invites others, I want to specify what role the invited person should have, so that they get appropriate access levels from the start.

#### Acceptance Criteria

1. WHEN a user registers with a valid Invite_Token that specifies a role, THE Role_Assignment_System SHALL assign the specified role to that user
2. WHEN a user registers with a valid Invite_Token that does not specify a role, THE Role_Assignment_System SHALL assign the Member role to that user
3. WHEN the Role_Assignment_System assigns a role from an invite, THE Role_Assignment_System SHALL validate that the specified role is one of: Contributor, Member, or Viewer
4. IF an Invite_Token specifies an invalid role, THEN THE Role_Assignment_System SHALL assign the Member role as fallback

### Requirement 3: First User Admin Assignment

**User Story:** As a system administrator, I want the first user to automatically become an Admin, so that there is always someone with full system access.

#### Acceptance Criteria

1. WHEN a user registers and no other users exist in the system, THE Role_Assignment_System SHALL assign the Admin role to that user
2. WHEN the first user registers, THE Role_Assignment_System SHALL ignore any Invite_Token and assign Admin role
3. THE Role_Assignment_System SHALL determine user count before role assignment

### Requirement 4: Invite Creation with Role Selection

**User Story:** As a user creating an invite, I want to select which role the invited person will receive, so that I can control their access level.

#### Acceptance Criteria

1. WHEN a user creates an invite, THE UI_Component SHALL display a role selection dropdown
2. THE UI_Component SHALL include role options: Contributor, Member, and Viewer
3. WHEN no role is explicitly selected, THE UI_Component SHALL default to Member
4. WHEN a user selects a role, THE UI_Component SHALL display a description of that role's permissions
5. WHEN an invite is created, THE Invite_System SHALL store the selected role with the Invite_Token
6. THE UI_Component SHALL display role descriptions showing invite limits and access permissions for each role

### Requirement 5: Viewer Access Restriction Enforcement

**User Story:** As a system administrator, I want Viewers to be restricted from creating campaigns, so that only trusted users can initiate fundraising activities.

#### Acceptance Criteria

1. WHEN a Viewer user attempts to access the campaign creation page, THE Permission_Validator SHALL block access
2. WHEN a Viewer user is blocked from campaign creation, THE UI_Component SHALL display a message explaining the restriction
3. THE UI_Component SHALL suggest contacting an Admin for role upgrade in the restriction message
4. WHEN a Viewer user views the dashboard, THE UI_Component SHALL hide or disable the campaign creation button
5. THE Permission_Validator SHALL validate user role before rendering campaign creation interface

### Requirement 6: Admin Role Management Preservation

**User Story:** As an Admin, I want to continue manually changing any user's role, so that I can respond to changing access needs.

#### Acceptance Criteria

1. WHEN an Admin changes a user's role, THE Role_Assignment_System SHALL update the user's role to the specified value
2. THE Role_Assignment_System SHALL allow Admin users to assign any role including Admin, Contributor, Member, or Viewer
3. WHEN a role change occurs, THE Role_Assignment_System SHALL immediately apply the new permissions
4. THE UI_Component SHALL display the current role management interface for Admin users

### Requirement 7: Multi-Language Support for Role System

**User Story:** As a user of the application, I want all role-related text to be available in my language, so that I can understand the permission system.

#### Acceptance Criteria

1. THE UI_Component SHALL display all role names in English, Swedish, and Arabic
2. THE UI_Component SHALL display all role descriptions in English, Swedish, and Arabic
3. THE UI_Component SHALL display all restriction messages in English, Swedish, and Arabic
4. THE UI_Component SHALL display all invite role selection labels in English, Swedish, and Arabic
5. WHEN the user's language preference changes, THE UI_Component SHALL update all role-related text to the selected language

### Requirement 8: Invite Token Validation

**User Story:** As a system administrator, I want invite tokens to be validated during registration, so that role assignments are based on legitimate invites.

#### Acceptance Criteria

1. WHEN a user provides an Invite_Token during registration, THE Registration_System SHALL validate the token exists
2. WHEN a user provides an Invite_Token during registration, THE Registration_System SHALL validate the token has not expired
3. WHEN a user provides an Invite_Token during registration, THE Registration_System SHALL validate the token has not been used
4. IF an Invite_Token is invalid, THEN THE Role_Assignment_System SHALL treat the registration as non-invited
5. WHEN an Invite_Token is successfully used, THE Invite_System SHALL mark the token as consumed

### Requirement 9: Role-Based Invite Limit Enforcement

**User Story:** As a system administrator, I want invite limits to be enforced based on user roles, so that access expansion is controlled.

#### Acceptance Criteria

1. WHEN a Viewer user attempts to create an invite, THE Permission_Validator SHALL deny access
2. WHEN a Member user has created 3 invites, THE Permission_Validator SHALL deny creation of additional invites
3. WHEN a Contributor user has created 5 invites, THE Permission_Validator SHALL deny creation of additional invites
4. WHEN an Admin user creates invites, THE Permission_Validator SHALL allow unlimited invite creation
5. THE UI_Component SHALL display remaining invite count for each user based on their role

### Requirement 10: Data Persistence for Role Assignments

**User Story:** As a user of the application, I want my role assignment to persist across sessions, so that I don't lose my access level.

#### Acceptance Criteria

1. WHEN a user's role is assigned, THE Role_Assignment_System SHALL store the role in localStorage
2. WHEN a user logs in, THE Registration_System SHALL retrieve the user's role from localStorage
3. WHEN a user's role is changed by an Admin, THE Role_Assignment_System SHALL update the role in localStorage
4. THE Role_Assignment_System SHALL maintain role data consistency across browser sessions

# Requirements Document

## Introduction

The Notification Center is a feature that provides users with real-time awareness of important events and activities within the Amanah family crowdfunding application. Users will receive notifications about campaign activities, role changes, invitations, contributions, and other significant events. The system respects the 4-role permission structure (Admin, Contributor, Member, Viewer) and ensures users only see notifications relevant to their role and group memberships. All notification text must support internationalization in English, Swedish, and Arabic.

## Glossary

- **Notification_Center**: The system component that manages, stores, and displays notifications to users
- **Notification**: A message informing a user about an event or activity in the application
- **Notification_Bell**: The UI icon in the dashboard header that displays notification status
- **Unread_Count**: The number of notifications a user has not yet marked as read
- **Badge**: The visual indicator showing the unread count on the Notification_Bell
- **Notification_Panel**: The dropdown interface that displays the list of notifications
- **User**: Any authenticated person using the Amanah application
- **Role**: The permission level assigned to a User (Admin, Contributor, Member, or Viewer)
- **Campaign**: A fundraising initiative within a family group
- **Group**: A family circle where campaigns and contributions are organized
- **Contribution**: A financial donation made to a campaign
- **Invite**: A request for someone to join the application or a specific group
- **I18n_System**: The internationalization system that provides translations in English, Swedish, and Arabic

## Requirements

### Requirement 1: Display Notification Bell

**User Story:** As a user, I want to see a notification bell icon in the dashboard header, so that I can access my notifications from any page.

#### Acceptance Criteria

1. THE Notification_Center SHALL display the Notification_Bell in the dashboard header
2. WHEN the User has unread notifications, THE Notification_Bell SHALL display a Badge with the Unread_Count
3. WHEN the Unread_Count exceeds 99, THE Badge SHALL display "99+"
4. WHEN the User clicks the Notification_Bell, THE Notification_Center SHALL open the Notification_Panel
5. THE Notification_Bell SHALL remain visible on all dashboard pages

### Requirement 2: Generate Campaign Activity Notifications

**User Story:** As a user, I want to receive notifications about campaign activities, so that I stay informed about campaigns I care about.

#### Acceptance Criteria

1. WHEN a new Campaign is created in a Group where the User is a member, THE Notification_Center SHALL create a notification for that User
2. WHEN a Campaign receives a contribution, THE Notification_Center SHALL create a notification for the Campaign creator
3. WHEN a Campaign reaches its goal amount, THE Notification_Center SHALL create a notification for all Group members
4. WHEN a Campaign receives a vote, THE Notification_Center SHALL create a notification for the Campaign creator
5. WHEN a pending Campaign becomes active after receiving sufficient votes, THE Notification_Center SHALL create a notification for all Group members
6. WHEN a Campaign is deleted, THE Notification_Center SHALL create a notification for all Group members who had contributed to that Campaign

### Requirement 3: Generate Role Change Notifications

**User Story:** As a user, I want to be notified when my role changes, so that I understand my new permissions.

#### Acceptance Criteria

1. WHEN a User's Role is changed by an Admin, THE Notification_Center SHALL create a notification for that User
2. THE notification SHALL include the previous Role and the new Role
3. THE notification SHALL be created within 1 second of the Role change

### Requirement 4: Generate Invite Notifications

**User Story:** As a user, I want to receive notifications about invitations, so that I know when I'm invited to groups or when my invites are accepted.

#### Acceptance Criteria

1. WHEN a User is invited to a Group, THE Notification_Center SHALL create a notification for that User
2. WHEN an Invite created by a User is accepted, THE Notification_Center SHALL create a notification for the User who created the Invite
3. WHEN an Invite expires without being used, THE Notification_Center SHALL create a notification for the User who created the Invite

### Requirement 5: Generate Contribution Notifications

**User Story:** As a user, I want to receive notifications about contributions, so that I can track support for campaigns I'm involved with.

#### Acceptance Criteria

1. WHEN a User makes a contribution to a Campaign, THE Notification_Center SHALL create a notification for the Campaign creator
2. WHEN a User makes a contribution to a Campaign, THE Notification_Center SHALL create a notification for all Group admins
3. WHERE the contribution is not anonymous, THE notification SHALL include the contributor's name
4. WHERE the contribution is anonymous, THE notification SHALL display "Anonymous" instead of the contributor's name

### Requirement 6: Mark Notifications as Read

**User Story:** As a user, I want to mark notifications as read, so that I can track which notifications I've already seen.

#### Acceptance Criteria

1. WHEN a User clicks on a notification in the Notification_Panel, THE Notification_Center SHALL mark that notification as read
2. WHEN a notification is marked as read, THE Unread_Count SHALL decrease by 1
3. THE Notification_Center SHALL provide a "Mark all as read" action
4. WHEN the User clicks "Mark all as read", THE Notification_Center SHALL mark all notifications as read
5. WHEN all notifications are marked as read, THE Badge SHALL not be displayed on the Notification_Bell

### Requirement 7: Mark Notifications as Unread

**User Story:** As a user, I want to mark notifications as unread, so that I can flag important notifications for later review.

#### Acceptance Criteria

1. THE Notification_Center SHALL provide a "Mark as unread" action for each read notification
2. WHEN a User marks a notification as unread, THE Unread_Count SHALL increase by 1
3. WHEN a notification is marked as unread, THE Badge SHALL display the updated Unread_Count

### Requirement 8: Delete Notifications

**User Story:** As a user, I want to delete notifications, so that I can remove notifications I no longer need.

#### Acceptance Criteria

1. THE Notification_Center SHALL provide a delete action for each notification
2. WHEN a User deletes a notification, THE Notification_Center SHALL remove that notification from the User's notification list
3. WHEN a User deletes an unread notification, THE Unread_Count SHALL decrease by 1
4. THE Notification_Center SHALL provide a "Clear all" action to delete all notifications
5. WHEN the User clicks "Clear all", THE Notification_Center SHALL prompt for confirmation before deleting all notifications

### Requirement 9: Filter Notifications by Type

**User Story:** As a user, I want to filter notifications by type, so that I can focus on specific kinds of activities.

#### Acceptance Criteria

1. THE Notification_Center SHALL provide filter options for notification types: All, Campaigns, Contributions, Invites, Roles, Groups
2. WHEN a User selects a filter, THE Notification_Panel SHALL display only notifications matching that type
3. WHEN a filter is active, THE Badge SHALL display the Unread_Count for all notifications, not just filtered notifications
4. THE Notification_Center SHALL persist the User's filter selection across sessions

### Requirement 10: Display Notification Content

**User Story:** As a user, I want to see clear notification messages, so that I understand what happened without needing to investigate further.

#### Acceptance Criteria

1. THE Notification_Center SHALL display each notification with a timestamp
2. WHEN a notification is less than 1 hour old, THE timestamp SHALL display in minutes (e.g., "5 minutes ago")
3. WHEN a notification is less than 24 hours old, THE timestamp SHALL display in hours (e.g., "3 hours ago")
4. WHEN a notification is 24 hours or older, THE timestamp SHALL display in days (e.g., "2 days ago")
5. THE Notification_Center SHALL display an icon representing the notification type
6. THE Notification_Center SHALL display the notification message text
7. WHERE applicable, THE notification SHALL include a link to the relevant resource (Campaign, Group, User profile)

### Requirement 11: Respect Role-Based Permissions

**User Story:** As a user, I want to only see notifications relevant to my role, so that I'm not overwhelmed with information I can't act on.

#### Acceptance Criteria

1. WHEN a User has the Viewer Role, THE Notification_Center SHALL NOT create notifications for contribution activities
2. WHEN a User has the Viewer Role, THE Notification_Center SHALL NOT create notifications for voting activities
3. WHEN a User has the Admin Role, THE Notification_Center SHALL create notifications for all user role changes
4. WHEN a User has the Admin Role, THE Notification_Center SHALL create notifications for all group membership changes
5. WHEN a User is not a member of a Group, THE Notification_Center SHALL NOT create notifications for activities in that Group

### Requirement 12: Persist Notifications in LocalStorage

**User Story:** As a user, I want my notifications to persist across sessions, so that I don't lose notification history when I close the browser.

#### Acceptance Criteria

1. THE Notification_Center SHALL store all notifications in localStorage
2. WHEN a User logs in, THE Notification_Center SHALL load notifications from localStorage
3. WHEN a notification is created, marked as read/unread, or deleted, THE Notification_Center SHALL update localStorage within 100 milliseconds
4. THE Notification_Center SHALL store notifications with the following data: id, userId, type, message, timestamp, isRead, relatedResourceId, relatedResourceType

### Requirement 13: Support Internationalization

**User Story:** As a user, I want to see notifications in my preferred language, so that I can understand them clearly.

#### Acceptance Criteria

1. THE Notification_Center SHALL use the I18n_System to translate all notification text
2. THE Notification_Center SHALL support English, Swedish, and Arabic languages
3. WHEN the User changes their language preference, THE Notification_Center SHALL update all displayed notification text to the new language
4. THE Notification_Center SHALL store notification message keys (not translated text) in localStorage
5. THE Notification_Center SHALL translate notification messages at display time using the current language setting

### Requirement 14: Display Empty State

**User Story:** As a user, I want to see a helpful message when I have no notifications, so that I understand the notification system is working.

#### Acceptance Criteria

1. WHEN a User has zero notifications, THE Notification_Panel SHALL display an empty state message
2. THE empty state message SHALL be "No notifications yet"
3. THE empty state message SHALL be translated using the I18n_System

### Requirement 15: Limit Notification History

**User Story:** As a user, I want the system to manage notification storage efficiently, so that the application remains performant.

#### Acceptance Criteria

1. THE Notification_Center SHALL store a maximum of 100 notifications per User
2. WHEN a new notification is created and the User has 100 notifications, THE Notification_Center SHALL delete the oldest read notification
3. IF all 100 notifications are unread, THE Notification_Center SHALL still create the new notification and delete the oldest unread notification
4. THE Notification_Center SHALL prioritize keeping unread notifications over read notifications when managing storage limits

### Requirement 16: Handle Notification Click Actions

**User Story:** As a user, I want to navigate to relevant pages when I click notifications, so that I can quickly view the related content.

#### Acceptance Criteria

1. WHEN a User clicks a Campaign notification, THE Notification_Center SHALL navigate to the Campaign detail page
2. WHEN a User clicks a Group notification, THE Notification_Center SHALL navigate to the Group detail page
3. WHEN a User clicks a Role change notification, THE Notification_Center SHALL navigate to the User's profile page
4. WHEN a User clicks an Invite notification, THE Notification_Center SHALL navigate to the invites management page
5. WHEN a User clicks a notification, THE Notification_Panel SHALL close automatically

### Requirement 17: Display Notification Panel Layout

**User Story:** As a user, I want a well-organized notification panel, so that I can easily scan and manage my notifications.

#### Acceptance Criteria

1. THE Notification_Panel SHALL display notifications in reverse chronological order (newest first)
2. THE Notification_Panel SHALL display a maximum of 10 notifications at a time
3. WHEN a User has more than 10 notifications, THE Notification_Panel SHALL provide a "View all" link
4. THE Notification_Panel SHALL have a maximum height of 500 pixels
5. WHEN the notification list exceeds the maximum height, THE Notification_Panel SHALL provide vertical scrolling
6. THE Notification_Panel SHALL display filter options at the top
7. THE Notification_Panel SHALL display the "Mark all as read" and "Clear all" actions at the top

### Requirement 18: Style Unread Notifications

**User Story:** As a user, I want to easily distinguish unread notifications from read ones, so that I can quickly identify new information.

#### Acceptance Criteria

1. WHEN a notification is unread, THE Notification_Center SHALL display it with a distinct background color
2. WHEN a notification is unread, THE Notification_Center SHALL display it with bold text
3. WHEN a notification is read, THE Notification_Center SHALL display it with normal text weight
4. THE Notification_Center SHALL use Tailwind CSS classes for styling


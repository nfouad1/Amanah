# Technical Design Document

## Overview

The Notification Center is a client-side notification system that provides real-time awareness of important events within the Amanah application. It uses localStorage for persistence and integrates with the existing i18n system for multi-language support.

## Architecture

### Component Structure

```
src/
├── components/
│   ├── NotificationBell.tsx       # Bell icon with badge in header
│   └── NotificationPanel.tsx      # Dropdown panel with notification list
├── lib/
│   ├── notifications.ts           # Core notification logic and storage
│   └── i18n.ts                    # Extended with notification translations
└── types/
    └── index.ts                   # Extended with notification types
```

### Data Model

#### Notification Interface

```typescript
interface Notification {
  id: string;                      // UUID
  userId: string;                  // User who receives the notification
  type: NotificationType;          // Type of notification
  messageKey: string;              // i18n translation key
  messageParams?: Record<string, string>; // Parameters for translation
  timestamp: number;               // Unix timestamp
  isRead: boolean;                 // Read status
  relatedResourceId?: string;      // ID of related resource (campaign, group, etc.)
  relatedResourceType?: ResourceType; // Type of related resource
}

type NotificationType = 
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

type ResourceType = 'campaign' | 'group' | 'user' | 'invite';
```

### Storage Strategy

**LocalStorage Key:** `amanah_notifications_{userId}`

**Storage Format:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "userId": "user-id",
      "type": "campaign_created",
      "messageKey": "notifCampaignCreated",
      "messageParams": { "campaignTitle": "Help Family", "groupName": "Smith Family" },
      "timestamp": 1234567890,
      "isRead": false,
      "relatedResourceId": "campaign-123",
      "relatedResourceType": "campaign"
    }
  ],
  "filter": "all"
}
```

## Component Design

### NotificationBell Component

**Location:** Dashboard header (next to profile icon)

**Features:**
- Bell icon (SVG)
- Badge with unread count (hidden when 0)
- Click to toggle NotificationPanel
- Responsive design (smaller on mobile)

**State:**
- `unreadCount: number`
- `isPanelOpen: boolean`

### NotificationPanel Component

**Layout:**
- Dropdown positioned below bell icon
- Max height: 500px with scroll
- Width: 400px (320px on mobile)

**Sections:**
1. Header with filters and actions
2. Notification list (10 items, "View all" link if more)
3. Empty state when no notifications

**Features:**
- Filter buttons: All, Campaigns, Contributions, Invites, Roles, Groups
- "Mark all as read" button
- "Clear all" button (with confirmation)
- Individual notification actions: mark read/unread, delete

## Notification Generation Logic

### Trigger Points

Notifications are generated at these points in the application:

1. **Campaign Created** - `createCampaign()` in mockData.ts
2. **Campaign Contribution** - `addContribution()` in mockData.ts
3. **Campaign Goal Reached** - Check in `addContribution()`
4. **Campaign Vote** - `voteForCampaign()` in mockData.ts
5. **Campaign Activated** - Check in `voteForCampaign()`
6. **Campaign Deleted** - `deleteCampaign()` in mockData.ts
7. **Role Changed** - `changeUserRole()` in mockData.ts
8. **Group Invited** - `addMembersToGroup()` in mockData.ts
9. **Invite Accepted** - `register()` in auth.ts
10. **Invite Expired** - Periodic check or on invite view

### Permission Filtering

Before creating a notification, check:
- User is member of the group (for group-related notifications)
- User role allows seeing this type of notification
- User is not the actor (don't notify yourself)

## Integration Points

### 1. Dashboard Header

Add NotificationBell component between LanguageSwitcher and profile link:

```tsx
<LanguageSwitcher onLanguageChange={handleLanguageChange} />
<NotificationBell />
<Link href="/dashboard/profile">...</Link>
```

### 2. MockData Functions

Add notification generation calls in:
- `createCampaign()`
- `addContribution()`
- `voteForCampaign()`
- `deleteCampaign()`
- `changeUserRole()`
- `addMembersToGroup()`

### 3. Auth Functions

Add notification generation in:
- `register()` - when invite code is used

### 4. I18n System

Add notification message keys for all notification types in English, Swedish, and Arabic.

## Translation Keys

### Notification Messages

```typescript
// Campaign notifications
notifCampaignCreated: "New campaign '{campaignTitle}' created in {groupName}"
notifCampaignContribution: "{userName} contributed {amount} to '{campaignTitle}'"
notifCampaignGoalReached: "Campaign '{campaignTitle}' reached its goal!"
notifCampaignVote: "{userName} voted for '{campaignTitle}'"
notifCampaignActivated: "Campaign '{campaignTitle}' is now active"
notifCampaignDeleted: "Campaign '{campaignTitle}' was deleted"

// Role notifications
notifRoleChanged: "Your role changed from {oldRole} to {newRole}"

// Invite notifications
notifGroupInvited: "You were invited to join {groupName}"
notifInviteAccepted: "{userName} accepted your invite"
notifInviteExpired: "Your invite code expired"

// Contribution notifications
notifContributionReceived: "{userName} contributed {amount} to your campaign"
notifContributionAnonymous: "Anonymous contribution of {amount} to your campaign"

// UI labels
notifications: "Notifications"
markAllRead: "Mark all as read"
clearAll: "Clear all"
markAsRead: "Mark as read"
markAsUnread: "Mark as unread"
deleteNotification: "Delete"
noNotifications: "No notifications yet"
viewAll: "View all"
filterAll: "All"
filterCampaigns: "Campaigns"
filterContributions: "Contributions"
filterInvites: "Invites"
filterRoles: "Roles"
filterGroups: "Groups"
confirmClearAll: "Are you sure you want to delete all notifications?"
```

## Performance Considerations

1. **Lazy Loading:** NotificationPanel only renders when opened
2. **Debouncing:** LocalStorage writes debounced by 100ms
3. **Pagination:** Show 10 notifications, load more on "View all"
4. **Cleanup:** Maintain max 100 notifications per user
5. **Memoization:** Use React.memo for notification items

## Accessibility

1. Bell icon has `aria-label="Notifications"`
2. Badge has `aria-label="{count} unread notifications"`
3. Panel has `role="dialog"` and `aria-labelledby`
4. Keyboard navigation support (Tab, Enter, Escape)
5. Focus management when opening/closing panel

## Testing Strategy

1. **Unit Tests:** Notification generation logic
2. **Integration Tests:** LocalStorage persistence
3. **UI Tests:** Component rendering and interactions
4. **Permission Tests:** Role-based notification filtering
5. **I18n Tests:** Translation key coverage

## Migration Strategy

Since this is a new feature:
1. No data migration needed
2. Users start with empty notification list
3. Notifications generated from new activities only
4. No retroactive notification generation

## Future Enhancements

1. Real-time notifications (WebSocket/SSE)
2. Push notifications (browser API)
3. Email notifications
4. Notification preferences/settings
5. Notification sound effects
6. Desktop notifications

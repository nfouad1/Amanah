# Implementation Tasks

## Task 1: Create Notification Type Definitions
**Status:** completed
**Assignee:** unassigned
**Estimated effort:** 30 minutes

### Description
Define TypeScript interfaces and types for the notification system in `src/types/index.ts`.

### Acceptance Criteria
- [x] Add `Notification` interface with all required fields
- [x] Add `NotificationType` union type with all notification types
- [x] Add `ResourceType` union type
- [x] Add `NotificationFilter` type
- [x] Export all types from index.ts

### Implementation Notes
```typescript
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
```

---

## Task 2: Add Notification Translation Keys
**Status:** completed
**Assignee:** unassigned
**Estimated effort:** 1 hour

### Description
Add all notification-related translation keys to `src/lib/i18n.ts` in English, Swedish, and Arabic.

### Acceptance Criteria
- [x] Add notification message keys for all notification types
- [x] Add UI label keys (notifications, markAllRead, clearAll, etc.)
- [x] Add filter label keys
- [x] Add empty state message key
- [x] Add confirmation message keys
- [x] Translate all keys to Swedish
- [x] Translate all keys to Arabic

### Implementation Notes
See design document for complete list of translation keys. Use parameter placeholders like `{campaignTitle}`, `{userName}`, `{amount}` for dynamic content.

---

## Task 3: Create Notification Storage Module
**Status:** completed
**Assignee:** unassigned
**Estimated effort:** 2 hours

### Description
Create `src/lib/notifications.ts` with functions for managing notifications in localStorage.

### Acceptance Criteria
- [x] Implement `createNotification()` function
- [x] Implement `getNotifications()` function
- [x] Implement `markAsRead()` function
- [x] Implement `markAsUnread()` function
- [x] Implement `markAllAsRead()` function
- [x] Implement `deleteNotification()` function
- [x] Implement `clearAllNotifications()` function
- [x] Implement `getUnreadCount()` function
- [x] Implement `getFilteredNotifications()` function
- [x] Implement `saveFilter()` and `getFilter()` functions
- [x] Add localStorage error handling with try-catch
- [x] Implement 100 notification limit with cleanup logic
- [x] Add UUID generation for notification IDs

### Implementation Notes
```typescript
export function createNotification(
  userId: string,
  type: NotificationType,
  messageKey: string,
  messageParams?: Record<string, string>,
  relatedResourceId?: string,
  relatedResourceType?: ResourceType
): Notification {
  // Generate UUID, create notification object, save to localStorage
}

export function getNotifications(userId: string): Notification[] {
  // Load from localStorage, return sorted by timestamp desc
}

// ... other functions
```

---

## Task 4: Create NotificationBell Component
**Status:** completed
**Assignee:** unassigned
**Estimated effort:** 1.5 hours

### Description
Create `src/components/NotificationBell.tsx` component that displays the bell icon with badge.

### Acceptance Criteria
- [x] Display bell icon SVG
- [x] Show badge with unread count when > 0
- [x] Display "99+" when count exceeds 99
- [x] Toggle NotificationPanel on click
- [x] Close panel when clicking outside
- [x] Responsive sizing (smaller on mobile)
- [x] Use current user from auth context
- [x] Update unread count reactively
- [x] Add proper accessibility attributes

### Implementation Notes
- Use `useState` for panel open/close state
- Use `useEffect` to load unread count
- Use `useRef` for click-outside detection
- Position panel absolutely below bell icon

---

## Task 5: Create NotificationPanel Component
**Status:** completed
**Assignee:** unassigned
**Estimated effort:** 3 hours

### Description
Create `src/components/NotificationPanel.tsx` component that displays the notification list.

### Acceptance Criteria
- [x] Display filter buttons at top
- [x] Display "Mark all as read" and "Clear all" buttons
- [x] Display notification list (max 10 items)
- [x] Display "View all" link when more than 10 notifications
- [x] Display empty state when no notifications
- [x] Style unread notifications differently (bold, background color)
- [x] Show notification icon based on type
- [x] Show formatted timestamp (minutes/hours/days ago)
- [x] Show notification message with translated text
- [x] Provide mark read/unread action per notification
- [x] Provide delete action per notification
- [x] Handle notification click to navigate to resource
- [x] Close panel after navigation
- [x] Implement vertical scrolling for long lists
- [x] Add confirmation dialog for "Clear all"
- [x] Persist filter selection

### Implementation Notes
- Use `getTranslation()` with messageKey and messageParams
- Use `useRouter()` for navigation
- Use conditional styling for read/unread states
- Implement filter logic client-side

---

## Task 6: Integrate NotificationBell into Dashboard Header
**Status:** completed
**Assignee:** unassigned
**Estimated effort:** 30 minutes

### Description
Add NotificationBell component to the dashboard header in `src/app/dashboard/page.tsx`.

### Acceptance Criteria
- [x] Import NotificationBell component
- [x] Add component between LanguageSwitcher and profile link
- [x] Ensure proper spacing and alignment
- [x] Test on mobile and desktop viewports

### Implementation Notes
```tsx
<LanguageSwitcher onLanguageChange={handleLanguageChange} />
<NotificationBell />
<Link href="/dashboard/profile">...</Link>
```

---

## Task 7: Add Notification Generation to Campaign Functions
**Status:** completed
**Assignee:** unassigned
**Estimated effort:** 2 hours

### Description
Add notification generation calls in campaign-related functions in `src/lib/mockData.ts`.

### Acceptance Criteria
- [x] Add notification in `createCampaign()` for all group members
- [x] Add notification in `addContribution()` for campaign creator
- [x] Add notification in `addContribution()` when goal is reached
- [x] Add notification in `voteForCampaign()` for campaign creator
- [x] Add notification in `voteForCampaign()` when campaign becomes active
- [x] Add notification in `deleteCampaign()` for contributors
- [x] Filter notifications based on user roles and group membership
- [x] Don't notify the user who performed the action

### Implementation Notes
- Import `createNotification` from notifications.ts
- Get all users from localStorage
- Filter users by group membership and role
- Create notification for each eligible user

---

## Task 8: Add Notification Generation to Role and Invite Functions
**Status:** completed
**Assignee:** unassigned
**Estimated effort:** 1 hour

### Description
Add notification generation calls in role and invite-related functions.

### Acceptance Criteria
- [x] Add notification in `changeUserRole()` in mockData.ts for the user whose role changed
- [x] Add notification in `addMembersToGroup()` in mockData.ts for invited users
- [x] Add notification in `register()` in auth.ts when invite is accepted
- [x] Add notification for invite expiration (implement check function)

### Implementation Notes
- For invite accepted: notify the user who created the invite
- For role changed: include old and new role in messageParams
- For group invited: include group name in messageParams

---

## Task 9: Add Notification Icons
**Status:** pending
**Assignee:** unassigned
**Estimated effort:** 30 minutes

### Description
Create SVG icons for each notification type to display in the notification panel.

### Acceptance Criteria
- [ ] Campaign icon (briefcase or target)
- [ ] Contribution icon (dollar sign or coins)
- [ ] Vote icon (thumbs up)
- [ ] Role icon (shield or badge)
- [ ] Invite icon (envelope or user-plus)
- [ ] Group icon (users or people)
- [ ] All icons use consistent size (20x20px)
- [ ] All icons use Tailwind color classes

### Implementation Notes
Use Heroicons or similar icon library for consistency with existing UI.

---

## Task 10: Test Notification System
**Status:** pending
**Assignee:** unassigned
**Estimated effort:** 2 hours

### Description
Manually test all notification scenarios to ensure proper functionality.

### Test Cases
- [ ] Create campaign → verify group members receive notification
- [ ] Contribute to campaign → verify creator receives notification
- [ ] Campaign reaches goal → verify all members receive notification
- [ ] Vote for campaign → verify creator receives notification
- [ ] Campaign becomes active → verify all members receive notification
- [ ] Delete campaign → verify contributors receive notification
- [ ] Change user role → verify user receives notification
- [ ] Invite to group → verify invited user receives notification
- [ ] Accept invite → verify inviter receives notification
- [ ] Mark notification as read → verify unread count decreases
- [ ] Mark notification as unread → verify unread count increases
- [ ] Mark all as read → verify all notifications marked and badge hidden
- [ ] Delete notification → verify notification removed
- [ ] Clear all → verify confirmation and all notifications deleted
- [ ] Filter by type → verify only matching notifications shown
- [ ] Click notification → verify navigation to correct page
- [ ] Change language → verify notification text updates
- [ ] Viewer role → verify no contribution/vote notifications
- [ ] Non-group member → verify no group notifications
- [ ] 100+ notifications → verify oldest deleted when new created

---

## Task 11: Add Notification Bell to Other Dashboard Pages
**Status:** pending
**Assignee:** unassigned
**Estimated effort:** 1 hour

### Description
Add NotificationBell component to headers of other dashboard pages for consistency.

### Acceptance Criteria
- [ ] Add to campaign detail page header
- [ ] Add to campaign creation page header
- [ ] Add to group detail page header
- [ ] Add to group creation page header
- [ ] Add to contribute page header
- [ ] Add to invites page header
- [ ] Add to profile page header
- [ ] Add to users page header (admin only)

### Implementation Notes
Create a reusable DashboardHeader component to avoid duplication, or add NotificationBell to each page individually.

---

## Task 12: Implement Notification Cleanup on Logout
**Status:** pending
**Assignee:** unassigned
**Estimated effort:** 15 minutes

### Description
Ensure notifications are properly handled when user logs out.

### Acceptance Criteria
- [ ] Notifications remain in localStorage after logout
- [ ] Notifications load correctly on next login
- [ ] No memory leaks or stale state

### Implementation Notes
No special cleanup needed since notifications are stored per userId in localStorage.

---

## Summary

**Total estimated effort:** ~15 hours

**Task dependencies:**
1. Task 1 (Types) → Task 3 (Storage)
2. Task 2 (Translations) → Task 5 (Panel)
3. Task 3 (Storage) → Task 4 (Bell), Task 5 (Panel)
4. Task 4 (Bell) + Task 5 (Panel) → Task 6 (Integration)
5. Task 3 (Storage) → Task 7 (Campaign Notifications), Task 8 (Role/Invite Notifications)
6. Task 9 (Icons) → Task 5 (Panel)
7. All tasks → Task 10 (Testing)
8. Task 6 (Integration) → Task 11 (Other Pages)

**Recommended implementation order:**
1. Task 1 (Types)
2. Task 2 (Translations)
3. Task 3 (Storage)
4. Task 9 (Icons)
5. Task 4 (Bell)
6. Task 5 (Panel)
7. Task 6 (Integration)
8. Task 7 (Campaign Notifications)
9. Task 8 (Role/Invite Notifications)
10. Task 10 (Testing)
11. Task 11 (Other Pages)
12. Task 12 (Cleanup)

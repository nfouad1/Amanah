---
feature: Notification Center
status: requirements
created: 2026-03-05
---

# Notification Center - Requirements

## Overview
A notification system that keeps users informed about important events and activities within the Amanah family crowdfunding app.

## Core Requirements

### 1. Notification Types
The system should track and display the following notification types:

#### Campaign-Related
- **Campaign Created**: When a new campaign is created
- **Campaign Approved**: When a campaign receives enough votes and becomes active
- **Campaign Funded**: When a campaign reaches its funding goal
- **Campaign Vote**: When someone votes on your campaign (for campaign creators)

#### Contribution-Related
- **New Contribution**: When someone contributes to a campaign you created or follow
- **Contribution Milestone**: When a campaign reaches 25%, 50%, 75% of goal

#### Group-Related
- **Group Created**: When a new group is created
- **Added to Group**: When you're added to a group
- **Group Activity**: When there's activity in your groups

#### User-Related
- **Role Changed**: When your role is changed by an admin
- **Invite Accepted**: When someone accepts your invite
- **New User Joined**: When a new user joins (Admin only)

#### System-Related
- **Welcome**: First-time login notification
- **System Announcement**: Important system messages (Admin broadcast)

### 2. Notification Properties
Each notification should have:
- **id**: Unique identifier
- **userId**: Who receives the notification
- **type**: Notification type (from list above)
- **title**: Short title (translated)
- **message**: Detailed message (translated)
- **read**: Boolean (read/unread status)
- **createdAt**: Timestamp
- **link**: Optional link to related page (campaign, group, etc.)
- **metadata**: Additional data (campaign id, user name, etc.)

### 3. User Permissions & Visibility
Different roles see different notifications:

- **Admin**: All notification types including system-wide events
- **Contributor**: Campaign, contribution, group, and personal notifications
- **Member**: Contribution, group, and personal notifications
- **Viewer**: Personal notifications only (role changes, invites)

### 4. Notification Triggers
Notifications should be created automatically when:
- User performs an action that affects others
- System events occur (milestones, approvals)
- Admin sends announcements

### 5. User Actions
Users should be able to:
- **View**: See all their notifications in a list
- **Mark as Read**: Mark individual notifications as read
- **Mark All as Read**: Mark all notifications as read at once
- **Delete**: Remove individual notifications
- **Clear All**: Delete all read notifications
- **Filter**: Filter by type (all, unread, campaign, contribution, etc.)
- **Navigate**: Click notification to go to related page

### 6. Display Requirements
- **Badge**: Show unread count on notification bell icon
- **Dropdown**: Click bell to open notification panel
- **List**: Show notifications in reverse chronological order (newest first)
- **Visual States**: Different styling for read/unread
- **Empty State**: Show friendly message when no notifications
- **Pagination**: Show last 50 notifications, with "Load More" option

### 7. Storage
- Use localStorage for client-side storage
- Store notifications per user
- Include SSR safety (return empty during server render)
- Add try-catch error handling

### 8. Internationalization
All notification text must be translated to:
- English
- Swedish
- Arabic

### 9. Real-time Updates (Future Enhancement)
For now, notifications update on:
- Page load
- User action that triggers notification
- Manual refresh

Future: WebSocket or polling for real-time updates

## Questions to Resolve

1. **Notification Retention**: How long should we keep notifications?
   - Option A: Keep all notifications forever
   - Option B: Auto-delete after 30 days
   - Option C: Keep last 100 notifications per user

2. **Sound/Visual Alerts**: Should we add sound or browser notifications?
   - Option A: No sound, just visual badge
   - Option B: Optional sound toggle in settings
   - Option C: Browser push notifications (requires permission)

3. **Email Notifications**: Should important notifications also send emails?
   - Option A: No email, in-app only
   - Option B: Email for critical events only (role change, etc.)
   - Option C: User-configurable email preferences

4. **Notification Preferences**: Should users control what notifications they receive?
   - Option A: Receive all notifications (no settings)
   - Option B: Simple on/off toggle per category
   - Option C: Detailed preferences per notification type

5. **Admin Announcements**: How should admins send system-wide announcements?
   - Option A: Separate admin page for announcements
   - Option B: Quick announcement button in dashboard
   - Option C: Both options

## Success Criteria
- Users can see all relevant notifications based on their role
- Unread count is accurate and visible
- Notifications link to relevant pages
- All text is properly translated
- System is performant (no lag when opening notification panel)
- Works on mobile and desktop

## Out of Scope (For Now)
- Real-time push notifications
- Email notifications
- Sound alerts
- Notification preferences/settings
- Notification history page (separate from dropdown)

---

## Next Steps
1. Review and answer the questions above
2. Move to Design phase
3. Create implementation tasks

// Notification System - Storage and Management

import { Notification, NotificationType, ResourceType, NotificationFilter } from '@/types';

const MAX_NOTIFICATIONS = 100;

// Notification preferences - which types the user wants to receive
export interface NotificationPreferences {
  campaign_created: boolean;
  campaign_contribution: boolean;
  campaign_goal_reached: boolean;
  campaign_vote: boolean;
  campaign_activated: boolean;
  campaign_deleted: boolean;
  role_changed: boolean;
  group_invited: boolean;
  invite_accepted: boolean;
  invite_expired: boolean;
  contribution_received: boolean;
}

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  campaign_created: true,
  campaign_contribution: true,
  campaign_goal_reached: true,
  campaign_vote: true,
  campaign_activated: true,
  campaign_deleted: true,
  role_changed: true,
  group_invited: true,
  invite_accepted: true,
  invite_expired: true,
  contribution_received: true,
};

function getPreferencesKey(userId: string): string {
  return `sanad_notification_prefs_${userId}`;
}

export function getNotificationPreferences(userId: string): NotificationPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const stored = localStorage.getItem(getPreferencesKey(userId));
    if (!stored) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveNotificationPreferences(userId: string, prefs: NotificationPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getPreferencesKey(userId), JSON.stringify(prefs));
  } catch (error) {
    console.error('Error saving notification preferences:', error);
  }
}

// Generate UUID for notification IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get storage key for user
function getStorageKey(userId: string): string {
  return `sanad_notifications_${userId}`;
}

// Get filter storage key
function getFilterKey(userId: string): string {
  return `sanad_notification_filter_${userId}`;
}

// Load notifications from localStorage
export function getNotifications(userId: string): Notification[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const key = getStorageKey(userId);
    const data = localStorage.getItem(key);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return parsed.notifications || [];
  } catch (error) {
    console.error('Error loading notifications:', error);
    return [];
  }
}

// Save notifications to localStorage
function saveNotifications(userId: string, notifications: Notification[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    const key = getStorageKey(userId);
    const data = { notifications };
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving notifications:', error);
  }
}

// Create a new notification (respects user preferences)
export function createNotification(
  userId: string,
  type: NotificationType,
  messageKey: string,
  messageParams?: Record<string, string>,
  relatedResourceId?: string,
  relatedResourceType?: ResourceType
): Notification | null {
  // Check user preferences - system notifications (role_changed, group_invited) always go through
  const alwaysShow: NotificationType[] = ['role_changed', 'group_invited'];
  if (!alwaysShow.includes(type)) {
    const prefs = getNotificationPreferences(userId);
    if (!prefs[type]) return null;
  }

  const notification: Notification = {
    id: generateId(),
    userId,
    type,
    messageKey,
    messageParams,
    timestamp: Date.now(),
    isRead: false,
    relatedResourceId,
    relatedResourceType,
  };
  
  // Load existing notifications
  let notifications = getNotifications(userId);
  
  // Add new notification at the beginning
  notifications.unshift(notification);
  
  // Enforce max limit
  if (notifications.length > MAX_NOTIFICATIONS) {
    // Try to remove oldest read notification first
    const oldestReadIndex = notifications.findIndex((n, i) => i > 0 && n.isRead);
    if (oldestReadIndex !== -1) {
      notifications.splice(oldestReadIndex, 1);
    } else {
      // If all are unread, remove the oldest one
      notifications.pop();
    }
  }
  
  // Save to localStorage
  saveNotifications(userId, notifications);
  
  return notification;
}
export function markAsRead(userId: string, notificationId: string): void {
  const notifications = getNotifications(userId);
  const notification = notifications.find(n => n.id === notificationId);
  
  if (notification) {
    notification.isRead = true;
    saveNotifications(userId, notifications);
  }
}

// Mark notification as unread
export function markAsUnread(userId: string, notificationId: string): void {
  const notifications = getNotifications(userId);
  const notification = notifications.find(n => n.id === notificationId);
  
  if (notification) {
    notification.isRead = false;
    saveNotifications(userId, notifications);
  }
}

// Mark all notifications as read
export function markAllAsRead(userId: string): void {
  const notifications = getNotifications(userId);
  notifications.forEach(n => n.isRead = true);
  saveNotifications(userId, notifications);
}

// Delete a notification
export function deleteNotification(userId: string, notificationId: string): void {
  let notifications = getNotifications(userId);
  notifications = notifications.filter(n => n.id !== notificationId);
  saveNotifications(userId, notifications);
}

// Clear all notifications
export function clearAllNotifications(userId: string): void {
  saveNotifications(userId, []);
}

// Get unread count
export function getUnreadCount(userId: string): number {
  const notifications = getNotifications(userId);
  return notifications.filter(n => !n.isRead).length;
}

// Get filtered notifications
export function getFilteredNotifications(
  userId: string,
  filter: NotificationFilter
): Notification[] {
  const notifications = getNotifications(userId);
  
  if (filter === 'all') {
    return notifications;
  }
  
  // Map filter to notification types
  const typeMap: Record<NotificationFilter, NotificationType[]> = {
    all: [],
    campaigns: ['campaign_created', 'campaign_contribution', 'campaign_goal_reached', 'campaign_vote', 'campaign_activated', 'campaign_deleted'],
    contributions: ['campaign_contribution', 'contribution_received'],
    invites: ['group_invited', 'invite_accepted', 'invite_expired'],
    roles: ['role_changed'],
    groups: ['group_invited'],
  };
  
  const types = typeMap[filter] || [];
  return notifications.filter(n => types.includes(n.type));
}

// Save filter preference
export function saveFilter(userId: string, filter: NotificationFilter): void {
  if (typeof window === 'undefined') return;
  
  try {
    const key = getFilterKey(userId);
    localStorage.setItem(key, filter);
  } catch (error) {
    console.error('Error saving filter:', error);
  }
}

// Get filter preference
export function getFilter(userId: string): NotificationFilter {
  if (typeof window === 'undefined') return 'all';
  
  try {
    const key = getFilterKey(userId);
    const filter = localStorage.getItem(key);
    return (filter as NotificationFilter) || 'all';
  } catch (error) {
    console.error('Error loading filter:', error);
    return 'all';
  }
}

// Format timestamp for display
export function formatTimestamp(timestamp: number, lang: 'en' | 'ar' | 'sv'): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  const labels = {
    en: { minutes: 'minutes ago', hours: 'hours ago', days: 'days ago' },
    ar: { minutes: 'منذ دقائق', hours: 'منذ ساعات', days: 'منذ أيام' },
    sv: { minutes: 'minuter sedan', hours: 'timmar sedan', days: 'dagar sedan' },
  };
  
  if (minutes < 60) {
    return `${minutes} ${labels[lang].minutes}`;
  } else if (hours < 24) {
    return `${hours} ${labels[lang].hours}`;
  } else {
    return `${days} ${labels[lang].days}`;
  }
}

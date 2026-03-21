'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Notification, NotificationFilter } from '@/types';
import {
  getNotifications,
  getFilteredNotifications,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getFilter,
  saveFilter,
  formatTimestamp,
} from '@/lib/notifications';
import { getLanguage, getTranslation, Language } from '@/lib/i18n';

interface NotificationPanelProps {
  userId: string;
  onClose: () => void;
  onUpdate: () => void;
}

export default function NotificationPanel({ userId, onClose, onUpdate }: NotificationPanelProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [lang, setLang] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const currentLang = getLanguage();
    setLang(currentLang);
    setIsRTL(currentLang === 'ar');
    
    // Load saved filter
    const savedFilter = getFilter(userId);
    setFilter(savedFilter);
    
    loadNotifications(savedFilter);
  }, [userId]);

  const loadNotifications = (currentFilter: NotificationFilter) => {
    const allNotifications = getFilteredNotifications(userId, currentFilter);
    setNotifications(allNotifications);
  };

  const t = (key: any) => getTranslation(lang, key);

  const handleFilterChange = (newFilter: NotificationFilter) => {
    setFilter(newFilter);
    saveFilter(userId, newFilter);
    loadNotifications(newFilter);
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(userId, notificationId);
    loadNotifications(filter);
    onUpdate();
  };

  const handleMarkAsUnread = (notificationId: string) => {
    markAsUnread(userId, notificationId);
    loadNotifications(filter);
    onUpdate();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead(userId);
    loadNotifications(filter);
    onUpdate();
  };

  const handleDelete = (notificationId: string) => {
    deleteNotification(userId, notificationId);
    loadNotifications(filter);
    onUpdate();
  };

  const handleClearAll = () => {
    if (confirm(t('confirmClearAll'))) {
      clearAllNotifications(userId);
      loadNotifications(filter);
      onUpdate();
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    // Navigate to related resource
    if (notification.relatedResourceId && notification.relatedResourceType) {
      const { relatedResourceId, relatedResourceType } = notification;
      
      switch (relatedResourceType) {
        case 'campaign':
          router.push(`/dashboard/campaigns/${relatedResourceId}`);
          break;
        case 'group':
          // Access request notifications should go to access-requests page
          if (
            notification.type === 'group_invited' &&
            (notification.messageKey === 'notifAccessRequest' ||
              notification.messageKey === 'notifGroupCreationRequest')
          ) {
            router.push('/dashboard/access-requests');
          } else {
            router.push(`/dashboard/groups/${relatedResourceId}`);
          }
          break;
        case 'user':
          router.push('/dashboard/profile');
          break;
        case 'invite':
          router.push('/dashboard/invites');
          break;
      }
      
      onClose();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'campaign_created':
      case 'campaign_activated':
      case 'campaign_deleted':
        return (
          <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
        );
      case 'campaign_contribution':
      case 'contribution_received':
      case 'campaign_goal_reached':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
        );
      case 'campaign_vote':
        return (
          <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
        );
      case 'role_changed':
        return (
          <svg className="w-5 h-5 text-warm-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'group_invited':
      case 'invite_accepted':
      case 'invite_expired':
        return (
          <svg className="w-5 h-5 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        );
    }
  };

  const formatNotificationMessage = (notification: Notification): string => {
    const message = t(notification.messageKey);
    if (!notification.messageParams) return message;

    let formatted = message;
    Object.entries(notification.messageParams).forEach(([key, value]) => {
      formatted = formatted.replace(`{${key}}`, value);
    });
    return formatted;
  };

  const displayedNotifications = notifications.slice(0, 10);
  const hasMore = notifications.length > 10;

  const filters: { key: NotificationFilter; label: string }[] = [
    { key: 'all', label: t('filterAll') },
    { key: 'campaigns', label: t('filterCampaigns') },
    { key: 'contributions', label: t('filterContributions') },
    { key: 'invites', label: t('filterInvites') },
    { key: 'roles', label: t('filterRoles') },
    { key: 'groups', label: t('filterGroups') },
  ];

  return (
    <div
      className="absolute top-full right-0 mt-2 w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border border-gray-200 z-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{t('notifications')}</h3>
          <div className="flex gap-2">
            {notifications.length > 0 && (
              <>
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t('markAllRead')}
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={handleClearAll}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  {t('clearAll')}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => handleFilterChange(f.key)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filter === f.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-[500px] overflow-y-auto">
        {displayedNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <p className="text-gray-500">{t('noNotifications')}</p>
          </div>
        ) : (
          <>
            {displayedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !notification.isRead ? 'bg-primary-50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm text-gray-900 ${
                        !notification.isRead ? 'font-semibold' : ''
                      }`}
                    >
                      {formatNotificationMessage(notification)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(notification.timestamp, lang)}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-start gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        notification.isRead
                          ? handleMarkAsUnread(notification.id)
                          : handleMarkAsRead(notification.id);
                      }}
                      className="p-1 text-gray-400 hover:text-primary-600 rounded"
                      title={notification.isRead ? t('markAsUnread') : t('markAsRead')}
                    >
                      {notification.isRead ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <circle cx="10" cy="10" r="3" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      title={t('deleteNotification')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {hasMore && (
              <div className="p-3 text-center border-t border-gray-200">
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  {t('viewAll')} ({notifications.length})
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

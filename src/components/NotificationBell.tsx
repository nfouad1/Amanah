'use client';

import { useState, useEffect, useRef } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { getUnreadCount } from '@/lib/notifications';
import { getLanguage, getTranslation } from '@/lib/i18n';
import NotificationPanel from './NotificationPanel';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadUnreadCount(currentUser.id);
    }
  }, []);

  const loadUnreadCount = (userId: string) => {
    const count = getUnreadCount(userId);
    setUnreadCount(count);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (user) {
      loadUnreadCount(user.id);
    }
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        bellRef.current &&
        panelRef.current &&
        !bellRef.current.contains(event.target as Node) &&
        !panelRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, user]);

  const lang = getLanguage();
  const t = (key: any) => getTranslation(lang, key);

  if (!user) return null;

  const displayCount = unreadCount > 99 ? '99+' : unreadCount;

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={handleToggle}
        className="relative text-white hover:text-primary-100 p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label={t('notifications')}
      >
        {/* Bell Icon */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Badge */}
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
            aria-label={`${unreadCount} unread notifications`}
          >
            {displayCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div ref={panelRef}>
          <NotificationPanel
            userId={user.id}
            onClose={handleClose}
            onUpdate={() => loadUnreadCount(user.id)}
          />
        </div>
      )}
    </div>
  );
}

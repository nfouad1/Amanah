'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getAllUsers, updateUserRole, type User } from '@/lib/auth';
import { getLanguage, getTranslation, Language, translations } from '@/lib/i18n';

export default function UsersPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [lang, setLang] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Only admins can access this page
    if (user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    setCurrentUser(user);
    
    const currentLang = getLanguage();
    setLang(currentLang);
    setIsRTL(currentLang === 'ar');
    
    loadUsers();
  }, [router]);

  const loadUsers = () => {
    if (typeof window !== 'undefined') {
      setUsers(getAllUsers());
    }
  };

  const t = (key: keyof typeof translations.en) => {
    if (!mounted) return translations.en[key];
    return getTranslation(lang, key);
  };

  const handleToggleRole = (user: User) => {
    if (!currentUser) return;
    
    const newRole = user.role === 'admin' ? 'member' : 'admin';
    const confirmMessage = newRole === 'admin' 
      ? t('confirmMakeAdmin').replace('{name}', user.name)
      : t('confirmRemoveAdmin').replace('{name}', user.name);
    
    if (confirm(confirmMessage)) {
      const result = updateUserRole(user.id, newRole, currentUser.id);
      if (result.success) {
        alert(t('userRoleUpdated'));
        loadUsers();
        
        // Reload current user if they changed their own role
        if (user.id === currentUser.id) {
          const updatedUser = getCurrentUser();
          if (updatedUser) {
            setCurrentUser(updatedUser);
          }
        }
      } else {
        alert(result.error || t('onlyAdminsCanManage'));
      }
    }
  };

  if (!mounted || !currentUser) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{t('loading')}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-warm-50 to-secondary-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('backToDashboard')}
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('userManagement')}</h1>
            <p className="text-gray-600">{t('allUsers')}</p>
          </div>

          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    {user.role === 'admin' && (
                      <span className="text-xs bg-warm-100 text-warm-800 px-2 py-1 rounded font-semibold">
                        👑 Admin
                      </span>
                    )}
                    {user.role === 'member' && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {t('member')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {t('created')}: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <button
                  onClick={() => handleToggleRole(user)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                    user.role === 'admin'
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {user.role === 'admin' ? t('removeAdmin') : t('makeAdmin')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

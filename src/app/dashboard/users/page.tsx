'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getAllUsers, updateUserRole, type User, type UserRole } from '@/lib/auth';
import { getLanguage, getTranslation, Language, translations } from '@/lib/i18n';
import { getRoleIcon, getRoleColor, getRoleDisplayName, getRoleDescription, getMaxInvites } from '@/lib/permissions';
import { getGroups, type Group } from '@/lib/mockData';

export default function UsersPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [lang, setLang] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isGlobalAdmin, setIsGlobalAdmin] = useState(false);
  const [adminGroups, setAdminGroups] = useState<Group[]>([]);

  useEffect(() => {
    setMounted(true);
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const isDefaultAdmin = user.id === 'admin-default';
    const globalAdmin = user.role === 'admin' || isDefaultAdmin;
    setIsGlobalAdmin(globalAdmin);

    if (globalAdmin) {
      setCurrentUser(user);
      loadUsers();
    } else {
      // Check if user is a group admin
      const allGroups = getGroups();
      const myAdminGroups = allGroups.filter(g =>
        g.memberList?.some(m => m.id === user.id && m.role === 'admin' && m.status === 'active')
      );

      if (myAdminGroups.length === 0) {
        router.push('/dashboard');
        return;
      }

      setCurrentUser(user);
      setAdminGroups(myAdminGroups);
    }

    const currentLang = getLanguage();
    setLang(currentLang);
    setIsRTL(currentLang === 'ar');
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

  const handleOpenRoleModal = (user: User) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const handleChangeRole = (newRole: UserRole) => {
    if (!currentUser || !selectedUser) return;

    const result = updateUserRole(selectedUser.id, newRole, currentUser.id);
    if (result.success) {
      alert(t('userRoleUpdated'));
      loadUsers();
      setShowRoleModal(false);
      setSelectedUser(null);

      if (selectedUser.id === currentUser.id) {
        const updatedUser = getCurrentUser();
        if (updatedUser) setCurrentUser(updatedUser);
      }
    } else {
      alert(result.error || t('onlyAdminsCanManage'));
    }
  };

  if (!mounted || !currentUser) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{t('loading')}</div>;
  }

  // For global admin: show all users with stats
  if (isGlobalAdmin) {
    const roleCount = (role: string) => users.filter(u => u.role === role).length;

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
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow p-4 text-center border-t-4 border-primary-500">
              <p className="text-3xl font-bold text-primary-700">{users.length}</p>
              <p className="text-sm text-gray-500 mt-1">{t('totalMembers' as keyof typeof translations.en)}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center border-t-4 border-secondary-500">
              <p className="text-3xl font-bold text-secondary-600">{roleCount('admin')}</p>
              <p className="text-sm text-gray-500 mt-1">{t('roleAdmin')}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center border-t-4 border-forest-500">
              <p className="text-3xl font-bold text-forest-600">{roleCount('contributor') + roleCount('member')}</p>
              <p className="text-sm text-gray-500 mt-1">{t('roleContributor')} / {t('roleMember')}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center border-t-4 border-warm-400">
              <p className="text-3xl font-bold text-warm-600">{roleCount('viewer')}</p>
              <p className="text-sm text-gray-500 mt-1">{t('roleViewer')}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('userManagement')}</h1>
              <p className="text-gray-600">{t('allUsers')}</p>
            </div>

            <div className="space-y-4">
              {users.map((user) => {
                const maxInvites = getMaxInvites(user.role);
                return (
                  <div key={user.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <span className={`text-xs bg-${getRoleColor(user.role)}/10 text-${getRoleColor(user.role)} px-2 py-1 rounded font-semibold`}>
                          {getRoleIcon(user.role)} {t(`role${user.role.charAt(0).toUpperCase() + user.role.slice(1)}` as keyof typeof translations.en)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {t('created')}: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {maxInvites === Infinity ? t('adminUnlimitedInvites') : `${t('activeInvites')}: ${maxInvites}`}
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenRoleModal(user)}
                      className="px-4 py-2 rounded-lg font-semibold text-sm transition bg-primary-600 text-white hover:bg-primary-700"
                    >
                      {t('changeRole')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Role Selection Modal */}
        {showRoleModal && selectedUser && (
          <RoleModal
            selectedUser={selectedUser}
            t={t}
            onChangeRole={handleChangeRole}
            onClose={() => { setShowRoleModal(false); setSelectedUser(null); }}
          />
        )}
      </div>
    );
  }

  // For group admins: show their group members
  const totalGroupMembers = adminGroups.reduce((sum, g) => sum + (g.memberList?.filter(m => m.status === 'active').length || 0), 0);

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
        {/* Stats for group admin */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 text-center border-t-4 border-primary-500">
            <p className="text-3xl font-bold text-primary-700">{totalGroupMembers}</p>
            <p className="text-sm text-gray-500 mt-1">{t('totalMembers' as keyof typeof translations.en)}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center border-t-4 border-forest-500">
            <p className="text-3xl font-bold text-forest-600">{adminGroups.length}</p>
            <p className="text-sm text-gray-500 mt-1">{t('myGroups')}</p>
          </div>
        </div>

        {adminGroups.map(group => (
          <div key={group.id} className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{group.name}</h2>
                <p className="text-sm text-gray-500">{group.memberList?.filter(m => m.status === 'active').length || 0} {t('members')}</p>
              </div>
              <Link
                href={`/dashboard/groups/${group.id}`}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {t('viewGroup' as keyof typeof translations.en)}
              </Link>
            </div>

            <div className="space-y-3">
              {(group.memberList || []).filter(m => m.status === 'active').map(member => (
                <div key={member.id} className="border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${member.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>
                        {member.role === 'admin' ? getRoleIcon('admin') : '👤'} {member.role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{member.contact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoleModal({ selectedUser, t, onChangeRole, onClose }: {
  selectedUser: User;
  t: (key: keyof typeof translations.en) => string;
  onChangeRole: (role: UserRole) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('changeRole')}</h2>
        <p className="text-gray-600 mb-6">
          {t('selectNewRole')}: {selectedUser.name}
        </p>

        <div className="space-y-3">
          {(['admin', 'contributor', 'member', 'viewer'] as UserRole[]).map((role) => {
            const isCurrentRole = selectedUser.role === role;
            const maxInvites = getMaxInvites(role);

            return (
              <button
                key={role}
                onClick={() => onChangeRole(role)}
                disabled={isCurrentRole}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  isCurrentRole
                    ? 'border-primary-600 bg-primary-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-primary-400 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getRoleIcon(role)}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {t(`role${role.charAt(0).toUpperCase() + role.slice(1)}` as keyof typeof translations.en)}
                    </h3>
                    {isCurrentRole && (
                      <span className="text-xs text-primary-600 font-semibold">
                        {t('status')}: {t('active')}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {t(`roleDesc${role.charAt(0).toUpperCase() + role.slice(1)}` as keyof typeof translations.en)}
                </p>
                <p className="text-xs text-gray-500">
                  {maxInvites === Infinity
                    ? t('adminUnlimitedInvites')
                    : `${t('activeInvites')}: ${maxInvites}`
                  }
                </p>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  );
}
